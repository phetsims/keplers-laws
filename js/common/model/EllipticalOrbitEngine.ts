// Copyright 2023-2025, University of Colorado Boulder

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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import Engine from '../../../../solar-system-common/js/model/Engine.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import OrbitalArea from './OrbitalArea.js';
import OrbitTypes from './OrbitTypes.js';
import PeriodTracker from './PeriodTracker.js';

const TWO_PI = 2 * Math.PI;

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

type SelfOptions = {
  orbitalAreasTandem: Tandem;
};

type EllipticalOrbitEngineOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// Initial G for the sim
const INITIAL_G = 4.45669;

// Equal to G*M in model units.
const INITIAL_MU = 891.34;

export default class EllipticalOrbitEngine extends Engine {

  private readonly sun: Body;
  private readonly planet: Body;

  // mu = G * Mass_sun, and G in this sim is 1e4
  private mu;

  // Boolean that keeps track of the engine's state
  private isRunning = false;

  // Flag that warns of internal changes caused by the engine that should not trigger a new update
  public internalPropertyMutation = false;

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

  public readonly semiMajorAxisProperty: NumberProperty;
  public readonly semiMinorAxisProperty: NumberProperty;
  public readonly focalDistanceProperty: NumberProperty;
  public readonly distance1Property: NumberProperty;
  public readonly distance2Property: NumberProperty;
  public readonly periodProperty: NumberProperty;
  public readonly eccentricityProperty: NumberProperty;

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
  public activeAreaIndexProperty: NumberProperty;
  public areasErased = false; // When areas were just erased. run() sets this to false

  // Object which will keep track of the measured period on the orbit
  private periodTracker: PeriodTracker | null;

  public constructor( bodies: Body[], providedOptions: EllipticalOrbitEngineOptions ) {
    super( bodies );
    this.mu = INITIAL_MU;

    this.orbitTypeProperty = new EnumerationProperty( OrbitTypes.STABLE_ORBIT );

    // In the case of this sim, the body0 is the sun, and body1 is the planet
    assert && assert( bodies.length === 2, 'This engine requires exactly 2 bodies.' );
    this.sun = bodies[ 0 ];
    this.planet = bodies[ 1 ];

    const orbitalDataTandem = providedOptions.tandem.createTandem( 'orbitalData' );
    this.semiMajorAxisProperty = new NumberProperty( 1, {
      phetioReadOnly: true,
      tandem: orbitalDataTandem.createTandem( 'semiMajorAxisProperty' ),
      units: 'AU',
      phetioFeatured: true
    } );
    this.semiMinorAxisProperty = new NumberProperty( 1, {
      phetioReadOnly: true,
      tandem: orbitalDataTandem.createTandem( 'semiMinorAxisProperty' ),
      units: 'AU',
      phetioFeatured: true
    } );
    this.focalDistanceProperty = new NumberProperty( 1, {
      phetioReadOnly: true,
      tandem: orbitalDataTandem.createTandem( 'focalDistanceProperty' ),
      units: 'AU',
      phetioFeatured: true
    } );
    this.distance1Property = new NumberProperty( 1, {
      phetioReadOnly: true,
      tandem: orbitalDataTandem.createTandem( 'distance1Property' ),
      units: 'AU',
      phetioFeatured: true
    } );
    this.distance2Property = new NumberProperty( 1, {
      phetioReadOnly: true,
      tandem: orbitalDataTandem.createTandem( 'distance2Property' ),
      units: 'AU',
      phetioFeatured: true
    } );
    this.periodProperty = new NumberProperty( 1, {
      phetioReadOnly: true,
      tandem: orbitalDataTandem.createTandem( 'periodProperty' ),
      units: 'years',
      phetioFeatured: true
    } );
    this.eccentricityProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: orbitalDataTandem.createTandem( 'eccentricityProperty' ),
      phetioFeatured: true
    } );

    // Populate the orbital areas
    for ( let i = 0; i < KeplersLawsConstants.PERIOD_DIVISIONS_RANGE.max; i++ ) {
      this.orbitalAreas.push( new OrbitalArea( i, providedOptions.orbitalAreasTandem ) );
    }

    // Multilink to update the escape speed and distance based on the bodies position and velocity
    Multilink.multilink(
      [ this.planet.positionProperty, this.planet.velocityProperty, this.sun.massProperty ],
      ( position, velocity, mass ) => {
        const rMagnitude = position.magnitude;
        const vMagnitude = velocity.magnitude;

        this.mu = INITIAL_G * mass;

        this.escapeRadiusProperty.value = 2 * this.mu / ( vMagnitude * vMagnitude ) * epsilon * epsilon;
        this.escapeSpeedProperty.value = Math.sqrt( 2 * this.mu / rMagnitude ) * epsilon;
      } );

    // Multilink to release orbital updates when the user is controlling the body
    Multilink.multilink(
      [ this.planet.userIsControllingPositionProperty, this.planet.userIsControllingVelocityProperty, this.sun.userIsControllingMassProperty ],
      ( userIsControllingPosition, userIsControllingVelocity, userIsControllingMass ) => {
        this.resetOrbitalAreas();
        this.update( this.bodies );
      } );

    // Initially set this to null. EllipticalOrbitEngine and PeriodTracker need to know about each other. So
    // call setPeriodTracker after construction.
    this.periodTracker = null;

    this.activeAreaIndexProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'activeAreaIndexProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
  }

  public setPeriodTracker( periodTracker: PeriodTracker ): void {
    this.periodTracker = periodTracker;
  }

  public override run( dt: number, notifyPropertyListeners = true ): void {
    // Note that the notifyPropertyListeners optimization is not needed here, because the engine only needs to run
    // once, and there is only 1 body that is changed.

    // Set the engine to running
    this.isRunning = true;
    this.internalPropertyMutation = true;

    // Calculate the new position and velocity of the body
    this.M += dt * this.W;
    this.nu = this.getTrueAnomaly( this.M );

    // Update the position and velocity of the body
    const newPosition = this.createPolar( this.nu, this.w );
    const newVelocity = this.calculateOrbitalVelocity( this.nu, this.w );
    const newAngularMomentum = newPosition.crossScalar( newVelocity );
    newVelocity.multiplyScalar( this.L / newAngularMomentum );

    this.planet.positionProperty.value = newPosition;
    this.planet.velocityProperty.value = newVelocity;

    this.updateBodyDistances();
    this.updateForces( newPosition );

    this.calculateOrbitalDivisions();
    this.ranEmitter.emit();

    if ( this.periodTracker && this.periodTracker.tracingPathProperty.value ) {
      this.periodTracker.periodTraceEndProperty.value = Utils.moduloBetweenDown( this.nu, this.periodTracker.periodTraceStartProperty.value, this.periodTracker.periodTraceStartProperty.value + TWO_PI );
    }

    this.areasErased = false;
    this.isRunning = false;
    this.internalPropertyMutation = false;
  }

  /**
   * Based on the current position and velocity of the body
   * Updates the orbital elements of the body using Orbital Mechanics Analytic Equations
   */
  public override update( bodies: Body[] ): void {
    assert && assert( _.isEqual( bodies, this.bodies ), 'This engine expects the set of bodies to remain constant.' );

    this.resetOrbitalAreas();
    if ( this.periodTracker ) {
      this.periodTracker.periodTraceStartProperty.value = 0;
      this.periodTracker.periodTraceEndProperty.value = 0;
    }

    this.enforceValidPosition();

    const r = this.planet.positionProperty.value;
    this.updateForces( r );

    // Calculate again the escape speed based on the position of the body
    this.escapeSpeedProperty.value = Math.sqrt( 2 * this.mu / r.magnitude ) * epsilon;

    this.enforceValidVelocity();
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

    assert && assert( !isNaN( this.a ) && this.a > 0, `a is invalid, \n r=${r},\n v=${v}` );

    this.T = this.thirdLaw( this.a );

    this.updateBodyDistances();
    this.totalArea = Math.PI * this.a * this.b;
    this.segmentArea = this.totalArea / this.periodDivisions;

    this.semiMajorAxisProperty.value = this.a;
    this.semiMinorAxisProperty.value = this.b;
    this.focalDistanceProperty.value = this.c;
    this.periodProperty.value = this.T;

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
   * Updates the distances from the foci to the body
   */
  private updateBodyDistances(): void {
    this.bodyPolarPosition = this.createPolar( this.nu );
    this.d1 = this.bodyPolarPosition.magnitude;
    this.d2 = 2 * this.a - this.d1;

    this.distance1Property.value = this.d1;
    this.distance2Property.value = this.d2;
  }

  private updateForces( position: Vector2 ): void {
    const gravityForce = position.timesScalar( -this.mu * this.planet.massProperty.value / Math.pow( position.magnitude, 3 ) );
    this.planet.gravityForceProperty.value = gravityForce;
    this.planet.accelerationProperty.value = gravityForce.timesScalar( 1 / this.planet.massProperty.value );
    this.sun.gravityForceProperty.value = gravityForce.timesScalar( -1 );
  }


  // Kepler's Third Law, when this.mu == INITIAL_MU (solar system), then it's T = a^(3/2)
  // Returns the period in model units
  public thirdLaw( a: number ): number {
    assert && assert( a > 0, 'Axis needs to be positive' );
    return Math.pow( a * a * a * INITIAL_MU / this.mu, 1 / 2 );
  }

  /**
   * Always set the velocity to be perpendicular to the position and circular
   */
  private enforceCircularOrbit( position: Vector2 ): void {
    this.internalPropertyMutation = true;
    const direction = this.retrograde ? -1 : 1;
    this.planet.velocityProperty.value =
      position.perpendicular.normalized().timesScalar( direction * 1.0001 * Math.sqrt( this.mu / position.magnitude ) );
    this.internalPropertyMutation = false;
  }

  /**
   * Makes sure the velocity is never greater than the escape speed
   */
  private enforceEscapeSpeed(): void {
    this.internalPropertyMutation = true;
    this.planet.velocityProperty.value = this.planet.velocityProperty.value.normalized().timesScalar( this.escapeSpeedProperty.value );
    this.internalPropertyMutation = false;
  }

  /**
   * Makes sure the velocity will not cause an equation breakdown (v=0 or v perfectly aligned with r)
   */
  private enforceValidVelocity(): void {
    // 1. Make sure v is not 0 (Shouldn't be possible by dragging, but it is with PhET-iO)
    assert && assert( this.planet.velocityProperty.value.magnitude !== 0, 'Velocity cannot be 0' );

    // 2. Make sure v is not perfectly aligned with r (Extremely unlikely by dragging, but it is possible to do with PhET-iO)
    if ( Math.abs( Math.sin( this.planet.velocityProperty.value.angleBetween( this.planet.positionProperty.value ) ) ) <= 1e-6 ) {
      // Slightly spin the velocity vector
      this.planet.velocityProperty.value = this.planet.velocityProperty.value.rotated( 0.01 );
    }
  }

  private enforceValidPosition(): void {
    // 1. Make sure r is not 0 (Extremely unlikely by dragging, but it is possible to do with PhET-iO)
    if ( this.planet.positionProperty.value.magnitude === 0 ) {
      // Slightly change the position vector
      this.planet.positionProperty.value = new Vector2( 0.01, 0 );
    }
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

  public calculateOrbitalVelocity( nu: number, w = 0 ): Vector2 {
    const V_theta = 2 * Math.PI * this.a * ( 1 + this.e * Math.cos( nu ) ) / ( this.T * Math.sqrt( 1 - this.e * this.e ) );
    const V_r = -2 * Math.PI * this.a * this.e * Math.sin( nu ) / ( this.T * Math.sqrt( 1 - this.e * this.e ) );

    return this.createPolar( nu, w ).perpendicular.normalized().timesScalar( V_theta ).plus( this.createPolar( nu, w ).normalized().timesScalar( V_r ) );
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
    const angularSection = TWO_PI / this.periodDivisions;

    this.orbitalAreas.forEach( ( orbitalArea, i ) => {
      if ( i < this.periodDivisions && this.allowedOrbitProperty.value ) {
        // Calculate true anomaly
        // ( i + 1 ) because first angle is always nu = 0
        const M = ( i + 1 ) * TWO_PI / this.periodDivisions;
        const nu = this.getTrueAnomaly( M );

        // Update orbital areas angles, constrained by the startAngle
        let startAngle = previousNu;
        let endAngle = Utils.moduloBetweenDown( nu, startAngle, startAngle + TWO_PI );
        bodyAngle = Utils.moduloBetweenDown( bodyAngle, startAngle, startAngle + TWO_PI );

        orbitalArea.startAngle = startAngle;
        orbitalArea.endAngle = endAngle;

        // Set the default values with this function in the else{} cases to not trigger a listener update on the properties
        const setDefaultAreaValues = ( orbitalArea: OrbitalArea ) => {
          orbitalArea.sweptAreaProperty.value = this.segmentArea;
          orbitalArea.insideProperty.value = false;
        };

        // When the sim is running, check if the body is inside an area and slice it accordingly
        if ( startAngle <= bodyAngle && bodyAngle < endAngle ) {
          if ( this.isRunning ) {
            orbitalArea.insideProperty.value = true;
            orbitalArea.alreadyEnteredProperty.value = true;
            this.activeAreaIndexProperty.value = orbitalArea.index;

            if ( this.retrograde ) {
              startAngle = bodyAngle;
            }
            else {
              endAngle = bodyAngle;
            }
            orbitalArea.sweptAreaProperty.value = this.calculateSweptArea( startAngle, endAngle );
            orbitalArea.completionProperty.value = this.meanAnomalyDiff( startAngle, endAngle ) / angularSection;
          }
          else {
            setDefaultAreaValues( orbitalArea );
          }
        }
        else {
          setDefaultAreaValues( orbitalArea );
        }

        // Update orbital area properties
        if ( !orbitalArea.alreadyEnteredProperty.value ) {
          orbitalArea.completionProperty.value = 0; // Set it to 0 if it hasn't entered yet
          orbitalArea.sweptAreaProperty.value = 0;
        }
        orbitalArea.dotPositionProperty.value = this.createPolar( nu ); // Position for the dots

        // Position of the area section's start and end
        orbitalArea.startPositionProperty.value = this.createPolar( startAngle );
        orbitalArea.endPositionProperty.value = this.createPolar( endAngle );

        orbitalArea.activeProperty.value = true;

        previousNu = nu;
      }
      else {
        orbitalArea.completionProperty.value = 0;
        orbitalArea.activeProperty.value = false;
        orbitalArea.insideProperty.value = false;
      }
    } );
  }

  /**
   * Angular difference as calculated by the mean anomaly, i.e. independent of the eccentricity.
   */
  private meanAnomalyDiff( startAngle: number, endAngle: number ): number {
    return Utils.moduloBetweenDown( this.getMeanAnomaly( endAngle, this.e ) - this.getMeanAnomaly( startAngle, this.e ), 0, TWO_PI );
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
    const epsilon = 1e-2;  // Set a desired level of accuracy
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

    return Utils.moduloBetweenDown( nu, 0, TWO_PI );
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
    this.update( this.bodies );
    this.resetEmitter.emit();
  }
}

keplersLaws.register( 'EllipticalOrbitEngine', EllipticalOrbitEngine );