// Copyright 2023-2024, University of Colorado Boulder

/**
 * The model in charge of the Kepler's Laws Screen components.
 * It extends the SolarSystemCommonModel, and adds the necessary properties and logic to handle the laws functionalities.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import { Color } from '../../../../scenery/js/imports.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import BodyInfo from '../../../../solar-system-common/js/model/BodyInfo.js';
import SolarSystemCommonModel, { SolarSystemCommonModelOptions } from '../../../../solar-system-common/js/model/SolarSystemCommonModel.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import EllipticalOrbitEngine from './EllipticalOrbitEngine.js';
import LawMode from './LawMode.js';
import OrbitalArea from './OrbitalArea.js';
import PeriodTracker from './PeriodTracker.js';
import TargetOrbit from './TargetOrbit.js';
import TargetOrbitInfoProperty from './TargetOrbitInfoProperty.js';

const PHET_IO_TARGET_ORBITS_TANDEM = Tandem.GLOBAL_MODEL.createTandem( 'phetioTargetOrbits' );

type SelfOptions = {
  isAllLaws?: boolean; // whether the model is for the 'All Laws' screen
  initialLaw?: LawMode;
};

export type KeplersLawsModelOptions = SelfOptions & StrictOmit<SolarSystemCommonModelOptions, 'zoomLevelRange' | 'defaultBodyInfo' | 'engineTimeScale' | 'bodyColors'>;

class KeplersLawsModel extends SolarSystemCommonModel {

  // abstract in SolarSystemCommonModel
  public readonly zoomScaleProperty: TReadOnlyProperty<number>;

  public readonly sun: Body;
  public readonly planet: Body;

  // This is abstract in the base class, so make it concrete here.
  public readonly engine: EllipticalOrbitEngine;

  public readonly selectedLawProperty: EnumerationProperty<LawMode>;
  public readonly isAllLaws: boolean;

  public readonly targetOrbitProperty: EnumerationProperty<TargetOrbit>;
  public readonly isSolarSystemProperty: ReadOnlyProperty<boolean>;

  // Will enforce that the orbit is always circular
  public readonly alwaysCircularProperty: Property<boolean>;

  // Stopwatch visibility
  public readonly stopwatch: Stopwatch;

  // Booleans to keep track of which law is selected
  public readonly isFirstLawProperty: ReadOnlyProperty<boolean>;
  public readonly isSecondLawProperty: ReadOnlyProperty<boolean>;
  public readonly isThirdLawProperty: ReadOnlyProperty<boolean>;
  public readonly lawUpdatedEmitter = new Emitter();

  // Booleans to keep track of features that are only available in certain laws and their tandems
  public readonly hasFirstLawFeatures: boolean;
  public readonly hasSecondLawFeatures: boolean;
  public readonly hasThirdLawFeatures: boolean;

  // Number of divisions of the orbital area
  public readonly periodDivisionsProperty: NumberProperty;

  // Graph exponents
  public readonly correctPowersSelectedProperty: ReadOnlyProperty<boolean>;
  public readonly selectedAxisPowerProperty: NumberProperty;
  public readonly selectedPeriodPowerProperty: NumberProperty;

  public readonly poweredSemiMajorAxisProperty: ReadOnlyProperty<number>;
  public readonly poweredPeriodProperty: ReadOnlyProperty<number>;

  // The object that controls the blue path drawn when measuring the period
  public readonly periodTracker: PeriodTracker;

  // Boolean for properties to know if the change is being toggled by a reset of the model
  public resetting = false;

  // Boolean for properties to know if the change is being toggled by a restart (back to last interacted state) of the model
  public restarting = false;

  // The last law that was selected
  public lastLaw: LawMode;

  // Property that tells the EllipticalOrbitNode to play the sound or not
  public userIsInteractingProperty: BooleanProperty;

  // Stepping forward manually (toggled with the UI button), used to avoid updating the orbit
  private steppingForward = false;

  // Client-configurable target orbits. Private because these Properties can be accessed only via PhET-iO API or Studio.
  // Static because there must be 1 instance of each Property for the entire sim, since each Property modifies 1 value
  // of the TargetOrbit enumeration. See https://github.com/phetsims/keplers-laws/issues/210
  private static readonly targetOrbitInfoProperties = [
    new TargetOrbitInfoProperty( TargetOrbit.TARGET_ORBIT_1,
      PHET_IO_TARGET_ORBITS_TANDEM.createTandem( 'targetOrbit1Property' ) ),
    new TargetOrbitInfoProperty( TargetOrbit.TARGET_ORBIT_2,
      PHET_IO_TARGET_ORBITS_TANDEM.createTandem( 'targetOrbit2Property' ) ),
    new TargetOrbitInfoProperty( TargetOrbit.TARGET_ORBIT_3,
      PHET_IO_TARGET_ORBITS_TANDEM.createTandem( 'targetOrbit3Property' ) ),
    new TargetOrbitInfoProperty( TargetOrbit.TARGET_ORBIT_4,
      PHET_IO_TARGET_ORBITS_TANDEM.createTandem( 'targetOrbit4Property' ) )
  ];

  // More orbital data derived properties
  public readonly distanceProperty: TReadOnlyProperty<number>;
  public readonly distanceAngleProperty: TReadOnlyProperty<number>;
  public readonly velocityAngleProperty: TReadOnlyProperty<number>;
  public readonly rvAngleProperty: TReadOnlyProperty<number>;

  // Third law's equation result ( T^x / a^y )
  public readonly thirdLawEquationResultProperty: ReadOnlyProperty<number | null>;

  public constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, SelfOptions, SolarSystemCommonModelOptions>()( {

      // SelfOptions
      isAllLaws: false,
      initialLaw: LawMode.FIRST_LAW,

      // SolarSystemCommonModelOptionsOptions
      engineTimeScale: 0.002,  // This value works well for EllipticalOrbitEngine
      zoomLevelRange: new RangeWithValue( 1, 2, 2 ),
      modelToViewTime: 1000 / 12.6,
      defaultBodyInfo: [
        new BodyInfo( {
          isActive: true,
          mass: KeplersLawsConstants.MASS_OF_OUR_SUN,
          massRange: new Range( 0.5 * KeplersLawsConstants.MASS_OF_OUR_SUN, 2 * KeplersLawsConstants.MASS_OF_OUR_SUN ),
          position: new Vector2( 0, 0 ),
          positionPropertyOptions: {
            phetioReadOnly: true,
            phetioFeatured: false
          },
          velocity: new Vector2( 0, 0 ),
          velocityPropertyOptions: {
            phetioReadOnly: true,
            phetioFeatured: false
          },
          tandemName: 'sun'
        } ),
        new BodyInfo( {
          isActive: true,
          mass: KeplersLawsConstants.PLANET_MASS,
          massPropertyOptions: {
            phetioReadOnly: true
          },
          massRange: new Range( KeplersLawsConstants.PLANET_MASS, KeplersLawsConstants.PLANET_MASS ),
          position: new Vector2( 2.00, 0 ),
          velocity: new Vector2( 0, 17.2358 ),
          tandemName: 'planet'
        } )
      ],
      bodyColors: [
        KeplersLawsColors.sunColorProperty,
        KeplersLawsColors.planetColorProperty
      ],
      phetioFeaturedTimeProperty: false
    }, providedOptions );
    super( options );

    this.selectedLawProperty = new EnumerationProperty( options.initialLaw, {
      tandem: options.tandem.createTandem( 'selectedLawProperty' ),
      phetioFeatured: true,
      phetioReadOnly: !options.isAllLaws // Only allow the law to be changed via studio in the 'All Laws' screen
    } );
    this.isAllLaws = options.isAllLaws;

    this.isFirstLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.FIRST_LAW );
    this.isSecondLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.SECOND_LAW );
    this.isThirdLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.THIRD_LAW );

    // Boolean used to determine what goes in the sim
    this.hasFirstLawFeatures = this.isAllLaws || options.initialLaw === LawMode.FIRST_LAW;
    this.hasSecondLawFeatures = this.isAllLaws || options.initialLaw === LawMode.SECOND_LAW;
    this.hasThirdLawFeatures = this.isAllLaws || options.initialLaw === LawMode.THIRD_LAW;

    this.sun = this.bodies[ 0 ];
    this.planet = this.bodies[ 1 ];

    this.sun.positionProperty.link( position => {
      assert && assert( position.equals( Vector2.ZERO ), 'This sim requires the sun to be at the origin always!' );
    } );

    this.engine = new EllipticalOrbitEngine( this.bodies, {
      tandem: options.tandem,
      orbitalAreasTandem: this.hasSecondLawFeatures ? options.tandem.createTandem( 'orbitalAreas' ) : Tandem.OPT_OUT
    } );
    this.engine.reset();

    this.periodTracker = new PeriodTracker( this.engine, this.timeProperty,
      this.hasThirdLawFeatures ? options.tandem.createTandem( 'periodTracker' ) : Tandem.OPT_OUT );

    // EllipticalOrbitEngine and PeriodTracker need to know about each other, so we need to call this after they have
    // both been instantiated.
    this.engine.setPeriodTracker( this.periodTracker );

    this.periodDivisionsProperty = new NumberProperty( KeplersLawsConstants.PERIOD_DIVISIONS_RANGE.defaultValue, {
      range: KeplersLawsConstants.PERIOD_DIVISIONS_RANGE,
      tandem: this.hasSecondLawFeatures ? options.tandem.createTandem( 'periodDivisionsProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.targetOrbitProperty = new EnumerationProperty( TargetOrbit.NONE, {
      validValues: [
        TargetOrbit.NONE,
        TargetOrbit.MERCURY,
        TargetOrbit.VENUS,
        TargetOrbit.EARTH,
        TargetOrbit.MARS,
        TargetOrbit.JUPITER,
        TargetOrbit.TARGET_ORBIT_1,
        TargetOrbit.TARGET_ORBIT_2,
        TargetOrbit.TARGET_ORBIT_3,
        TargetOrbit.TARGET_ORBIT_4
      ],
      tandem: options.initialLaw !== LawMode.SECOND_LAW ? options.tandem.createTandem( 'targetOrbitProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    // If the selected target orbit is modified, force an update by switching to 'None', then back.
    KeplersLawsModel.targetOrbitInfoProperties.forEach( targetOrbitInfoProperty => {
      targetOrbitInfoProperty.link( () => {
        if ( targetOrbitInfoProperty.targetOrbit === this.targetOrbitProperty.value ) {
          this.targetOrbitProperty.value = TargetOrbit.NONE;
          this.targetOrbitProperty.value = targetOrbitInfoProperty.targetOrbit;
        }
      } );
    } );

    this.isSolarSystemProperty = new DerivedProperty( [ this.sun.massProperty ], sunMass => sunMass === 200 );

    this.alwaysCircularProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'alwaysCircularProperty' ),
      phetioFeatured: true
    } );

    Multilink.lazyMultilink( [
        this.sun.massProperty,
        this.planet.positionProperty,
        this.planet.velocityProperty
      ],
      () => {
        if ( ( !this.isPlayingProperty.value || isSettingPhetioStateProperty.value ) && !this.steppingForward && !this.engine.internalPropertyMutation ) {
          this.engine.update( this.bodies );
        }
      } );

    this.loadBodyInfo( this.defaultBodyInfo );

    this.lastLaw = this.selectedLawProperty.value;

    this.periodDivisionsProperty.link( divisions => {
      this.engine.periodDivisions = divisions;
      this.engine.resetOrbitalAreas( this.isPlayingProperty.value );
    } );

    this.alwaysCircularProperty.link( alwaysCircular => {
      this.engine.alwaysCircles = alwaysCircular;
      if ( alwaysCircular ) {
        // Because toggling always circular alters the velocity of the body, reset the orbit
        // This is done specially to avoid discountinous changes in the orbital shape
        this.engine.reset();
      }
      else {
        this.engine.update( this.bodies );
      }
    } );

    this.stopwatch = new Stopwatch( {
      tandem: options.tandem.createTandem( 'stopwatch' ),
      phetioFeatured: true
    } );

    const animatedZoomScaleRange = new Range( 45, 100 );
    const animatedZoomScaleProperty = new NumberProperty( animatedZoomScaleRange.max, {
      range: animatedZoomScaleRange,
      tandem: options.tandem.createTandem( 'animatedZoomScaleProperty' ),
      phetioDocumentation: 'For internal use only',
      phetioReadOnly: true
    } );
    const zoomAnimationIn = new Animation( {
      property: animatedZoomScaleProperty,
      duration: 0.5,
      to: animatedZoomScaleRange.min,
      easing: Easing.CUBIC_IN_OUT
    } );
    const zoomAnimationOut = new Animation( {
      property: animatedZoomScaleProperty,
      duration: 0.5,
      to: animatedZoomScaleRange.max,
      easing: Easing.CUBIC_IN_OUT
    } );

    this.zoomLevelProperty.link( zoomLevel => {
      if ( !this.resetting ) {
        zoomLevel === 1 ? zoomAnimationIn.start() : zoomAnimationOut.start();
      }
      else {
        animatedZoomScaleProperty.value = animatedZoomScaleRange.max;
      }
    } );

    this.zoomScaleProperty = new DerivedProperty( [ animatedZoomScaleProperty ], animatedZoomScale => animatedZoomScale );

    this.userIsInteractingProperty = new BooleanProperty( false );

    this.bodies.forEach( body => {
      Multilink.lazyMultilink(
        [ body.userIsControllingPositionProperty, body.userIsControllingVelocityProperty, body.userIsControllingMassProperty ],
        ( userIsControllingPosition: boolean, userIsControllingVelocity: boolean, userIsControllingMass: boolean ) => {
          if ( userIsControllingPosition || userIsControllingVelocity || userIsControllingMass ) {
            // The user has started changing one or more of the body Properties.
            this.isPlayingProperty.value = false;
            this.userInteractingEmitter.emit();
            this.hasPlayedProperty.reset(); // This will disable rewind (restart) button because a new state will be saved shortly after
          }
          else {
            // When the user stops the interaction, save the starting body info
            this.saveStartingBodyInfo();
          }

          // Will tell the EllipticalOrbitNode to play the sound or not
          this.userIsInteractingProperty.value = userIsControllingPosition || userIsControllingVelocity || userIsControllingMass;
        } );
    } );

    // More orbital data number properties
    const moreOrbitalDataTandem = options.tandem.createTandem( 'moreOrbitalData' );

    this.distanceProperty = new DerivedProperty( [ this.planet.positionProperty, this.sun.positionProperty ],
      ( planetPosition, sunPosition ) => planetPosition.distance( sunPosition ),
      {
        tandem: moreOrbitalDataTandem.createTandem( 'distanceProperty' ),
        phetioFeatured: true,
        units: 'AU',
        phetioValueType: NumberIO
      } );

    this.distanceAngleProperty = new DerivedProperty( [ this.planet.positionProperty ],
      position => Utils.toDegrees( position.angle ),
      {
        tandem: moreOrbitalDataTandem.createTandem( 'distanceAngleProperty' ),
        phetioFeatured: true,
        units: '\u00B0',
        phetioValueType: NumberIO
      } );

    this.velocityAngleProperty = new DerivedProperty( [ this.planet.velocityProperty ],
      velocity => Utils.toDegrees( velocity.angle ),
      {
        tandem: moreOrbitalDataTandem.createTandem( 'velocityAngleProperty' ),
        phetioFeatured: true,
        units: '\u00B0',
        phetioValueType: NumberIO
      } );

    this.rvAngleProperty = new DerivedProperty( [ this.planet.positionProperty, this.planet.velocityProperty, this.engine.eccentricityProperty ],
      ( position, velocity, eccentricity ) => {
        if ( eccentricity === 0 ) {
          return 90;
        }
        return Utils.toDegrees( velocity.angle - position.angle );
      },
      {
        tandem: moreOrbitalDataTandem.createTandem( 'rvAngleProperty' ),
        phetioFeatured: true,
        units: '\u00B0',
        phetioValueType: NumberIO
      } );

    const thirdLawGraphTandem = options.tandem.createTandem( 'thirdLawGraph' );
    this.selectedAxisPowerProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 3 ),
      tandem: this.hasThirdLawFeatures ? thirdLawGraphTandem.createTandem( 'selectedAxisPowerProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.selectedPeriodPowerProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 3 ),
      tandem: this.hasThirdLawFeatures ? thirdLawGraphTandem.createTandem( 'selectedPeriodPowerProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    // Powered values of semiMajor axis and period
    this.poweredSemiMajorAxisProperty = new DerivedProperty(
      [ this.selectedAxisPowerProperty, this.engine.semiMajorAxisProperty ],
      ( power, semiMajorAxis ) => Math.pow( semiMajorAxis, power )
    );

    this.poweredPeriodProperty = new DerivedProperty(
      [ this.selectedPeriodPowerProperty, this.engine.periodProperty ],
      ( power, period ) => Math.pow( period, power )
    );

    this.correctPowersSelectedProperty = new DerivedProperty(
      [ this.selectedAxisPowerProperty, this.selectedPeriodPowerProperty ],
      ( axisPower, periodPower ) => axisPower === 3 && periodPower === 2
    );

    this.thirdLawEquationResultProperty = new DerivedProperty( [ this.poweredSemiMajorAxisProperty, this.poweredPeriodProperty, this.engine.allowedOrbitProperty ],
      ( poweredSemiMajorAxis, poweredPeriod, allowedOrbit ) => {
        return allowedOrbit ? poweredPeriod / poweredSemiMajorAxis : null;
      }, {
        tandem: this.hasThirdLawFeatures ? thirdLawGraphTandem.createTandem( 'thirdLawEquationResultProperty' ) : Tandem.OPT_OUT,
        phetioValueType: NullableIO( NumberIO ),
        phetioFeatured: true
      } );
  }

  /**
   * Simpler version of loadBodyInfo than the one in SolarSystemCommonModel
   */
  public override loadBodyInfo( bodiesInfo: BodyInfo[] ): void {
    this.engine.internalPropertyMutation = true; // Disable automatic udpates of the engine
    super.loadBodyInfo( bodiesInfo );
    this.engine.update( this.bodies );
    this.engine.internalPropertyMutation = false;
  }

  public override restart(): void {
    this.restarting = true;
    super.restart();
    this.restarting = false;
  }

  public override reset(): void {
    this.resetting = true;
    super.reset();
    this.selectedLawProperty.reset();
    this.periodDivisionsProperty.reset();
    this.selectedAxisPowerProperty.reset();
    this.selectedPeriodPowerProperty.reset();
    this.alwaysCircularProperty.reset();
    this.periodTracker.reset();
    this.targetOrbitProperty.reset();
    this.stopwatch.reset();

    this.loadBodyInfo( this.defaultBodyInfo );

    this.resetting = false;
    this.engine.reset();

    // Do not reset targetOrbit*Property, since they are for PhET-iO only.
  }

  public override update(): void {
    // no op
  }

  public override step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      this.stepOnce( dt );
    }
    else {
      this.update();
    }

    this.periodTracker.step( dt );

  }

  public override stepOnce( dt: number, usingStepForwardButton = false ): void {
    this.steppingForward = usingStepForwardButton;

    // Scaling dt according to the speeds of the sim
    dt *= this.timeSpeedMap.get( this.timeSpeedProperty.value )!;

    // Scaling dt to the engine time
    dt *= this.engineTimeScale;

    this.engine.run( dt );

    // Scale dt again to convert it to view time
    dt *= this.modelToViewTime;

    this.timeProperty.value += dt;
    if ( this.stopwatch.isRunningProperty.value ) {
      this.stopwatch.step( dt );
    }

    this.steppingForward = false;

    if ( usingStepForwardButton ) {
      this.userInteractingEmitter.emit();
    }
  }

  /**
   * Retrieves the color of the given orbital area, based on which is active and the palette.
   * @param area
   */
  public getAreaColor( area: OrbitalArea ): Color {
    const orbitalAreaColors = KeplersLawsColors.ORBITAL_AREA_COLORS;
    const numAreas = this.periodDivisionsProperty.value;
    const activeAreaIndex = this.engine.activeAreaIndexProperty.value;

    let colorIndex;

    // Calculate the index difference and map it to color palette.
    let indexDiff = this.engine.retrograde ? area.index - activeAreaIndex : activeAreaIndex - area.index;
    indexDiff = Utils.moduloBetweenDown( indexDiff, 0, numAreas );

    colorIndex = indexDiff;
    if ( numAreas < orbitalAreaColors.length ) {
      colorIndex = Math.floor( indexDiff * orbitalAreaColors.length / numAreas );
    }
    if ( indexDiff === numAreas - 1 ) {
      colorIndex = orbitalAreaColors.length - 1;
    }

    return new Color( orbitalAreaColors[ colorIndex ] );

  }
}

keplersLaws.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;