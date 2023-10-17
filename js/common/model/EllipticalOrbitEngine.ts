// Copyright 2023, University of Colorado Boulder
/**
 * The Elliptical Orbit model element. Evolves the body and keeps track of orbital elements.
 * Serves as the Engine for the Kepler's Laws Model
 *
 * UNITS:
 * - Distance: arbitrary model units, converted to AU through SolarSystemCommonConstants.POSITION_MULTIPLIER
 * - Time: arbitrary model units, converted to years through SolarSystemCommonConstants.POSITION_MULTIPLIER and Kepler's Third Law
 * - Angle: radians
 * - Mass: arbitrary model units.
 *
 * VARIABLE DEFINITIONS: (These don't follow usual naming conventions to better relate them to the equations)
 * r: position vector
 * v: velocity vector
 * rAngle: heading of r
 * vAngle: heading of v
 * a: semi-major axis
 * b: semi-minor axis
 * c: focal distance
 * e: eccentricity
 * nu: true anomaly ( angular position of the body seen from main focus )
 * w: argument of periapsis ( angular deviation of periapsis from the 0° heading )
 * M: Initial mean anomaly ( angular position of the body seen from the center of the ellipse )
 * W: angular velocity
 *
 * @author Agustín Vallejo
 */

import Body from '../../../../solar-system-common/js/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import Engine from '../../../../solar-system-common/js/model/Engine.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import OrbitTypes from './OrbitTypes.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import OrbitalArea from './OrbitalArea.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';

const TWOPI = 2 * Math.PI;

// Scaling down factor for the escape velocity to avoid unwanted errors
const epsilon = 0.99;

// Creation of children classes
// See the file documentation for description of each variable
class Ellipse {
  public constructor(
    public a: number,
    public b: number,
    public c: number,
    public e: number,
    public w: number,
    public M: number,
    public W: number,
    public nu: number
  ) {}
}

// Equal to G*M in model units.
const INITIAL_MU = 2e6;

export default class EllipticalOrbitEngine extends Engine {

  private readonly sun: Body;
  private readonly planet: Body;

  // mu = G * Mass_sun, and G in this sim is 1e4
  private mu = INITIAL_MU;

  // Boolean that keeps track of the engine's state
  private isRunning = false;

  // For changes that require changes in the shape of the orbit
  public readonly changedEmitter = new Emitter();

  // For changes that mostly track the body through its orbit
  public readonly ranEmitter = new Emitter();

  // For changes that require a reset of the orbit
  public readonly resetEmitter = new Emitter();

  private bodyPolarPosition = new Vector2( 1, 0 );
  public periodDivisions = 4;
  public retrograde = false;
  public alwaysCircles = false;

  public orbitalAreas: OrbitalArea[] = [];
  public readonly isCircularProperty = new BooleanProperty( true );

  // When the sim plays, the orbit won't be constantly updating, only on user interactions
  public readonly updateAllowedProperty = new BooleanProperty( false );

  public readonly semiMajorAxisProperty = new NumberProperty( 1 );
  public readonly semiMinorAxisProperty = new NumberProperty( 1 );
  public readonly focalDistanceProperty = new NumberProperty( 1 );
  public readonly distance1Property = new NumberProperty( 1 );
  public readonly distance2Property = new NumberProperty( 1 );
  public readonly periodProperty = new NumberProperty( 1 );
  public readonly eccentricityProperty = new NumberProperty( 0 );

  // These variable names are letters to compare and read more easily the equations they are in
  public a = 1;  // semi-major axis
  public b = 0;  // semi-minor axis
  public c = 0;  // focal distance
  public e = 0;  // eccentricity
  public w = 0;  // argument of periapsis
  private M = 0;  // mean anomaly
  private W = 0;  // angular velocity
  private T = 1;  // period
  public nu = 0; // true anomaly
  private L = 0;  // angular momentum
  public d1 = 0; // distance from the main focus to the body
  public d2 = 0; // distance from the secondary focus to the body

  // Keeps track of the validity of the orbit. True if elliptic, false either if parabolic or collision orbit.
  public readonly allowedOrbitProperty = new BooleanProperty( false );

  // Stable, crash or escape orbit.
  public readonly orbitTypeProperty: EnumerationProperty<OrbitTypes>;

  // Escape speed and radius
  public readonly escapeSpeedProperty = new NumberProperty( 0 );
  public readonly escapeRadiusProperty = new NumberProperty( 0 );

  public totalArea = 1;
  public segmentArea = 1;
  public activeAreaIndex = 0;
  public areasErased = false; // When areas were just erased. run() sets this to false

  // These variables keep track of the period trace on Third Law (When the user measures period, a blue line will be traced)
  public readonly tracingPathProperty = new BooleanProperty( false );
  public periodTraceStart = 0;
  public periodTraceEnd = 0;

  public constructor( bodies: ObservableArray<Body> ) {
    super( bodies );

    this.orbitTypeProperty = new EnumerationProperty( OrbitTypes.STABLE_ORBIT );

    // In the case of this screen, the body0 is the sun, and body1 is the planet
    this.sun = bodies[ 0 ];
    this.planet = bodies[ 1 ];

    // Populate the orbital areas
    for ( let i = 0; i < KeplersLawsConstants.PERIOD_DIVISIONS_RANGE.max; i++ ) {
      this.orbitalAreas.push( new OrbitalArea( i ) );
    }

    // Multilink to update the escape speed and distance based on the bodies position and velocity
    Multilink.multilink(
      [
        this.planet.positionProperty,
        this.planet.velocityProperty,
        this.sun.massProperty
      ],
      (
        position: Vector2,
        velocity: Vector2,
        mass: number
      ) => {
        const rMagnitude = position.magnitude;
        const vMagnitude = velocity.magnitude;

        this.mu = 1e4 * mass;

        this.escapeRadiusProperty.value = 2 * this.mu / ( vMagnitude * vMagnitude ) * epsilon * epsilon;
        this.escapeSpeedProperty.value = Math.sqrt( 2 * this.mu / rMagnitude ) * epsilon;
      } );

    // Multilink to release orbital updates when the user is controlling the body
    Multilink.multilink(
      [ this.planet.userIsControllingPositionProperty, this.planet.userIsControllingVelocityProperty, this.sun.userIsControllingMassProperty ],
      ( userIsControllingPosition, userIsControllingVelocity, userIsControllingMass ) => {
        this.updateAllowedProperty.value = userIsControllingPosition || userIsControllingVelocity || userIsControllingMass;
        this.resetOrbitalAreas();
        this.update();
      } );

    this.tracingPathProperty.lazyLink( tracing => {
      if ( tracing ) {
        // Sets the beginning of the period trace to the planet's current angular position
        this.periodTraceStart = this.nu;
      }
    } );
  }

  // Kepler's Third Law, when this.mu == INITIAL_MU (solar system), then it's T = a^(3/2)
  // Returns the period in model units
  public thirdLaw( a: number ): number {
    return Math.pow( a * a * a * INITIAL_MU / this.mu, 1 / 2 );
  }

  public override run( dt: number ): void {
    // Prevent the orbit from updating if the body is orbiting
    this.updateAllowedProperty.value = false;

    // Set the engine to running
    this.isRunning = true;

    // Calculate the new position and velocity of the body
    this.M += dt * this.W;
    this.nu = this.getTrueAnomaly( this.M );

    // Update the position and velocity of the body
    const currentPosition = this.planet.positionProperty.value;
    const newPosition = this.createPolar( this.nu, this.w );
    const newVelocity = newPosition.minus( currentPosition ).normalize();
    const newAngularMomentum = newPosition.crossScalar( newVelocity );
    newVelocity.multiplyScalar( this.L / newAngularMomentum );

    this.planet.positionProperty.value = newPosition;
    this.planet.velocityProperty.value = newVelocity;

    this.updateBodyDistances();
    this.updateForces( newPosition );

    this.calculateOrbitalDivisions();
    this.ranEmitter.emit();

    if ( this.tracingPathProperty.value ) {
      this.periodTraceEnd = Utils.moduloBetweenDown( this.nu, this.periodTraceStart, this.periodTraceStart + TWOPI );
    }

    this.areasErased = false;

    this.isRunning = false;
  }

  /**
   * Updates the distances from the foci to the body
   */
  private updateBodyDistances(): void {
    this.bodyPolarPosition = this.createPolar( this.nu );
    this.d1 = this.bodyPolarPosition.magnitude;
    this.d2 = 2 * this.a - this.d1;

    this.distance1Property.value = this.d1 * SolarSystemCommonConstants.POSITION_MULTIPLIER;
    this.distance2Property.value = this.d2 * SolarSystemCommonConstants.POSITION_MULTIPLIER;
  }

  private updateForces( position: Vector2 ): void {
    const force = position.timesScalar( -this.mu * this.planet.massProperty.value / Math.pow( position.magnitude, 3 ) );
    this.planet.forceProperty.value = force;
    this.planet.accelerationProperty.value = force.timesScalar( 1 / this.planet.massProperty.value );
    this.sun.forceProperty.value = force.timesScalar( -1 );
  }

  /**
   * Based on the current position and velocity of the body
   * Updates the orbital elements of the body using Orbital Mechanics Analytic Equations
   */
  public override update(): void {
    this.resetOrbitalAreas();
    this.periodTraceStart = 0;
    this.periodTraceEnd = 0;

    const r = this.planet.positionProperty.value;
    this.updateForces( r );

    let escaped = false;
    if ( this.alwaysCircles ) {
      this.enforceCircularOrbit( r );
    }
    else {
      const escapeSpeed = this.escapeSpeedProperty.value;
      const currentSpeed = this.planet.velocityProperty.value.magnitude;
      if ( currentSpeed >= escapeSpeed ) {
        this.enforceEscapeSpeed();
      }
      // Using epsilon for a lower threshold on escape orbits to avoid floating point errors, which induced some flickering on edge cases
      escaped = currentSpeed >= ( escapeSpeed * epsilon );
      if ( escaped ) {
        this.allowedOrbitProperty.value = false;
        this.orbitTypeProperty.value = OrbitTypes.ESCAPE_ORBIT;
        this.eccentricityProperty.value = 1;
      }
    }

    const v = this.planet.velocityProperty.value;

    // Angular momentum
    this.L = r.crossScalar( v );

    const { a, b, c, e, w, M, W, nu } = this.calculateEllipse( r, v );
    this.a = a;
    this.b = b;
    this.c = c;
    this.e = e;
    this.w = w;
    this.M = M;
    this.W = W;
    this.nu = nu;

    this.T = this.thirdLaw( this.a );

    this.updateBodyDistances();
    this.totalArea = Math.PI * this.a * this.b;
    this.segmentArea = this.totalArea / this.periodDivisions;

    this.semiMajorAxisProperty.value = this.a * SolarSystemCommonConstants.POSITION_MULTIPLIER;
    this.semiMinorAxisProperty.value = this.b * SolarSystemCommonConstants.POSITION_MULTIPLIER;
    this.focalDistanceProperty.value = this.c * SolarSystemCommonConstants.POSITION_MULTIPLIER;
    this.periodProperty.value = this.T * Math.pow( SolarSystemCommonConstants.POSITION_MULTIPLIER, 3 / 2 );

    if ( this.collidedWithSun( a, e ) ) {
      this.allowedOrbitProperty.value = false;
      this.orbitTypeProperty.value = OrbitTypes.CRASH_ORBIT;
    }
    else if ( !escaped ) {
      this.allowedOrbitProperty.value = true;
      this.orbitTypeProperty.value = OrbitTypes.STABLE_ORBIT;
      this.calculateOrbitalDivisions();
    }

    if ( e !== this.eccentricityProperty.value && this.orbitTypeProperty.value !== OrbitTypes.ESCAPE_ORBIT ) {
      if ( this.alwaysCircles || e < 0.01 ) {
        this.eccentricityProperty.value = 0;
      }
      else {
        this.eccentricityProperty.value = e;
      }
      this.isCircularProperty.value = this.eccentricityProperty.value === 0;
    }


    this.changedEmitter.emit();
    this.ranEmitter.emit();
  }

  /**
   * Always set the velocity to be perpendicular to the position and circular
   */
  private enforceCircularOrbit( position: Vector2 ): void {
    const direction = this.retrograde ? -1 : 1;
    this.planet.velocityProperty.value =
      position.perpendicular.normalize().multiplyScalar( direction * 1.0001 * Math.sqrt( this.mu / position.magnitude ) );
  }

  /**
   * Makes sure the velocity is never greater than the escape speed
   */
  private enforceEscapeSpeed(): void {
    this.planet.velocityProperty.value = this.planet.velocityProperty.value.normalized().multiplyScalar( this.escapeSpeedProperty.value );
  }

  private collidedWithSun( a: number, e: number ): boolean {
    return a * ( 1 - e ) < Body.massToRadius( this.sun.massProperty.value );
  }

  /**
   * Creates a polar representation of the position of the body
   * @param nu True anomaly (Angle between periapsis and the body)
   * @param w Argument of periapsis (global rotation of periapsis)
   *
   * When w is not provided (0), we're using local orbital coordinates. When provided, the result is in global coordinates.
   */
  public createPolar( nu: number, w = 0 ): Vector2 {
    return EllipticalOrbitEngine.staticCreatePolar( this.a, this.e, nu, w );
  }

  public static staticCreatePolar( a: number, e: number, nu: number, w = 0 ): Vector2 {
    return Vector2.createPolar( EllipticalOrbitEngine.calculateR( a, e, nu ), nu + w );
  }

  /**
   * Based on the number of divisions provided by the model,
   * divides the orbit in equal time sections.
   */
  private calculateOrbitalDivisions(): void {
    // Nu is the angular position of the body as seen from the main focus
    let previousNu = 0;
    let bodyAngle = -this.nu;

    // The area of one section of the ellipse
    this.segmentArea = this.totalArea / this.periodDivisions;

    // The angle of one section of the ellipse
    const angularSection = TWOPI / this.periodDivisions;

    this.orbitalAreas.forEach( ( orbitalArea, i ) => {
      if ( i < this.periodDivisions && this.allowedOrbitProperty.value ) {
        // Calculate true anomaly
        // ( i + 1 ) because first angle is always nu = 0
        const M = ( i + 1 ) * TWOPI / this.periodDivisions;
        const nu = this.getTrueAnomaly( M );

        // Update orbital areas angles, constrained by the startAngle
        let startAngle = previousNu;
        let endAngle = Utils.moduloBetweenDown( nu, startAngle, startAngle + TWOPI );
        bodyAngle = Utils.moduloBetweenDown( bodyAngle, startAngle, startAngle + TWOPI );

        orbitalArea.startAngle = startAngle;
        orbitalArea.endAngle = endAngle;

        // When the sim is running, check if the body is inside an area and slice it accordingly
        if ( startAngle <= bodyAngle && bodyAngle < endAngle && this.isRunning ) {
          orbitalArea.insideProperty.value = true;
          orbitalArea.alreadyEntered = true;
          this.activeAreaIndex = orbitalArea.index;

          if ( this.retrograde ) {
            startAngle = bodyAngle;
          }
          else {
            endAngle = bodyAngle;
          }
          orbitalArea.sweptArea = this.calculateSweptArea( startAngle, endAngle );
          orbitalArea.completion = this.meanAnomalyDiff( startAngle, endAngle ) / angularSection;
        }
        else {
          orbitalArea.insideProperty.value = false;
        }

        // Update orbital area properties
        if ( !orbitalArea.alreadyEntered ) {
          orbitalArea.completion = 0; // Set it to 0 if it hasn't entered yet
        }
        orbitalArea.dotPosition = this.createPolar( nu ); // Position for the dots

        // Position of the area section's start and end
        orbitalArea.startPosition = this.createPolar( startAngle );
        orbitalArea.endPosition = this.createPolar( endAngle );

        orbitalArea.active = true;

        previousNu = nu;
      }
      else {
        orbitalArea.completion = 0;
        orbitalArea.active = false;
        orbitalArea.insideProperty.value = false;
      }
    } );
  }

  /**
   * Angular difference as calculated by the mean anomaly, i.e. independent of the eccentricity.
   */
  private meanAnomalyDiff( startAngle: number, endAngle: number ): number {
    return Utils.moduloBetweenDown( this.getMeanAnomaly( endAngle, this.e ) - this.getMeanAnomaly( startAngle, this.e ), 0, TWOPI );
  }

  private calculateSweptArea( startAngle: number, endAngle: number ): number {
    return Utils.clamp( Math.abs( 0.5 * this.a * this.b * this.meanAnomalyDiff( startAngle, endAngle ) ), 0, this.segmentArea );
  }

  /**
   * From the "vis viva" equation, calculate semi-major axis.
   */
  private calculate_a( r: Vector2, v: Vector2 ): number {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;

    return rMagnitude * this.mu / ( 2 * this.mu - rMagnitude * vMagnitude * vMagnitude );
  }

  /**
   * obtained from the equation for the specific orbital energy
   */
  private calculate_e( r: Vector2, v: Vector2, a: number ): number {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;
    const rAngle = r.angle;
    const vAngle = v.angle;

    return Math.pow(
      Math.abs( 1 - Math.pow( rMagnitude * vMagnitude * Math.sin( vAngle - rAngle ), 2 ) / ( a * this.mu ) ),
      0.5 );
  }

  /**
   * Calculates the different angles present in the ellipse.
   *
   * From the polar ellipse equation, the true anomaly (nu) is calculated. In this step the quadrants are also
   * determined, as well as if the orbit is retrograde. Other angles are calculated such as the argument of periapsis (w)
   * and the mean anomaly (M).
   */
  private calculateAngles( r: Vector2, v: Vector2, a: number, e: number ): number[] {
    const rMagnitude = r.magnitude;

    // Position and velocity angles
    const rAngle = r.angle;
    const vAngle = v.angle;

    // Circular orbit case
    let nu = rAngle;

    // Elliptical orbit case
    if ( e > 0 ) {
      // True anomaly comes from the polar ellipse equation. Based on rMagnitude, at what angle should it be
      nu = Math.acos( Utils.clamp( ( 1 / e ) * ( a * ( 1 - e * e ) / rMagnitude - 1 ), -1, 1 ) );

      // Determine the cuadrant of the true anomaly
      if ( Math.cos( rAngle - vAngle ) > 0 ) {
        nu *= -1;
      }
    }

    // Mean angular velocity
    let W = -500 / this.thirdLaw( a );

    this.retrograde = r.crossScalar( v ) > 0;
    if ( this.retrograde ) {
      nu *= -1;
      W *= -1;
    }

    // Calculate Mean Anomaly
    const M = this.getMeanAnomaly( nu, e );

    // Calculate the argument of periapsis
    const w = rAngle - nu;

    return [ w, M, W, nu ];
  }

  private calculateEllipse( r: Vector2, v: Vector2 ): Ellipse {
    const a = this.calculate_a( r, v );
    const e = this.calculate_e( r, v, a );
    const b = a * Math.sqrt( 1 - e * e );
    const c = a * e;
    const [ w, M, W, nu ] = this.calculateAngles( r, v, a, e );
    return new Ellipse( a, b, c, e, w, M, W, nu );
  }

  public static calculateR( a: number, e: number, nu: number ): number {
    return a * ( 1 - e * e ) / ( 1 + e * Math.cos( nu ) );
  }

  // Numerical solution to Kepler's Equations for Eccentric Anomaly (E) and then True Anomaly (nu)
  private getTrueAnomaly( M: number ): number {
    let E = M;
    const epsilon = 1e-1;  // Set a desired level of accuracy
    let delta = 1;

    // Newton-Raphson method to solve Kepler's equation
    while ( Math.abs( delta ) > epsilon ) {
      const g = E - this.e * Math.sin( E ) - M;  // g(E) = E - e*sin(E) - M
      const g_prime = 1 - this.e * Math.cos( E );  // g'(E) = 1 - e*cos(E)
      delta = g / g_prime;
      E = E - delta;
    }

    // Calculate the true anomaly (nu)
    const nu = Math.atan2(
      Math.sqrt( 1 - this.e * this.e ) * Math.sin( E ),
      Math.cos( E ) - this.e
    );

    return Utils.moduloBetweenDown( nu, 0, TWOPI );
  }

  private getMeanAnomaly( nu: number, e: number ): number {
    // Calculate Eccentric Anomaly and determine its cuadrant
    let E = -Math.acos( Utils.clamp( ( e + Math.cos( nu ) ) / ( 1 + e * Math.cos( nu ) ), -1, 1 ) );
    if ( Math.sin( E ) * Math.sin( nu ) < 0 ) {
      E *= -1;
    }

    // Calculate Mean Anomaly
    const M = E - e * Math.sin( E );
    return M;
  }

  public resetOrbitalAreas( eraseAreas = false ): void {
    this.orbitalAreas.forEach( area => {
      area.reset( eraseAreas );
    } );
    this.calculateOrbitalDivisions();
    this.areasErased = true;
    this.ranEmitter.emit();
  }

  public override reset(): void {
    this.resetOrbitalAreas();
    this.a = 1; // semiMajor axis
    this.e = 0; // eccentricity
    this.w = 0; // argument of periapsis
    this.M = 0; // mean anomaly
    this.W = 0; // angular velocity
    this.T = 1; // period
    this.nu = 0; // true anomaly
    this.update();
    this.resetEmitter.emit();
  }
}

keplersLaws.register( 'EllipticalOrbitEngine', EllipticalOrbitEngine );