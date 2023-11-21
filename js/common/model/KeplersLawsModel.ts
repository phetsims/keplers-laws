// Copyright 2023, University of Colorado Boulder

/**
 * The model in charge of the Kepler's Laws Screen components.
 * It extends the SolarSystemCommonModel, and adds the necessary properties and logic to handle the laws functionalities.
 *
 * @author Agustín Vallejo
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SolarSystemCommonModel, { SolarSystemCommonModelOptions } from '../../../../solar-system-common/js/model/SolarSystemCommonModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import LawMode from './LawMode.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import EllipticalOrbitEngine from './EllipticalOrbitEngine.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import keplersLaws from '../../keplersLaws.js';
import PeriodTracker from './PeriodTracker.js';
import OrbitalArea from './OrbitalArea.js';
import { Color } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import TargetOrbit from './TargetOrbit.js';
import Range from '../../../../dot/js/Range.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import Property from '../../../../axon/js/Property.js';
import BodyInfo from '../../../../solar-system-common/js/model/BodyInfo.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TargetOrbitInfoProperty from './TargetOrbitInfoProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';

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

  // The last law that was selected
  public lastLaw: LawMode;

  // Client-configurable target orbits. They are private because they can be accessed only via PhET-iO API or Studio.
  // See https://github.com/phetsims/keplers-laws/issues/210
  private readonly targetOrbit1Property?: TargetOrbitInfoProperty;
  private readonly targetOrbit2Property?: TargetOrbitInfoProperty;
  private readonly targetOrbit3Property?: TargetOrbitInfoProperty;
  private readonly targetOrbit4Property?: TargetOrbitInfoProperty;

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
          velocity: new Vector2( 0, 0 ),
          tandemName: 'sun'
        } ),
        new BodyInfo( {
          isActive: true,
          mass: KeplersLawsConstants.PLANET_MASS,
          massRange: new Range( KeplersLawsConstants.PLANET_MASS, KeplersLawsConstants.PLANET_MASS ),
          position: new Vector2( 2.00, 0 ),
          velocity: new Vector2( 0, 17.2358 ),
          tandemName: 'planet'
        } )
      ],
      bodyColors: [
        KeplersLawsColors.sunColorProperty,
        KeplersLawsColors.planetColorProperty
      ]
    }, providedOptions );
    super( options );

    this.sun = this.bodies[ 0 ];
    this.planet = this.bodies[ 1 ];

    this.sun.positionProperty.link( position => {
      assert && assert( position.equals( Vector2.ZERO ), 'This sim requires the sun to be at the origin always!' );
    } );

    this.engine = new EllipticalOrbitEngine( this.bodies, providedOptions.tandem );
    this.engine.reset();

    this.selectedLawProperty = new EnumerationProperty( options.initialLaw, {
      tandem: options.tandem.createTandem( 'selectedLawProperty' ),
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

    this.periodDivisionsProperty = new NumberProperty( KeplersLawsConstants.PERIOD_DIVISIONS_RANGE.defaultValue, {
      range: KeplersLawsConstants.PERIOD_DIVISIONS_RANGE,
      tandem: this.hasSecondLawFeatures ? options.tandem.createTandem( 'periodDivisionsProperty' ) : Tandem.OPT_OUT
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
      tandem: options.initialLaw !== LawMode.SECOND_LAW ? options.tandem.createTandem( 'targetOrbitProperty' ) : Tandem.OPT_OUT
    } );

    if ( options.initialLaw !== LawMode.SECOND_LAW ) {
      const phetioTargetOrbitsTandem = options.tandem.createTandem( 'phetioTargetOrbits' );
      this.targetOrbit1Property = new TargetOrbitInfoProperty( TargetOrbit.TARGET_ORBIT_1, this.targetOrbitProperty,
        phetioTargetOrbitsTandem.createTandem( 'targetOrbit1Property' ) );
      this.targetOrbit2Property = new TargetOrbitInfoProperty( TargetOrbit.TARGET_ORBIT_2, this.targetOrbitProperty,
        phetioTargetOrbitsTandem.createTandem( 'targetOrbit2Property' ) );
      this.targetOrbit3Property = new TargetOrbitInfoProperty( TargetOrbit.TARGET_ORBIT_3, this.targetOrbitProperty,
        phetioTargetOrbitsTandem.createTandem( 'targetOrbit3Property' ) );
      this.targetOrbit4Property = new TargetOrbitInfoProperty( TargetOrbit.TARGET_ORBIT_4, this.targetOrbitProperty,
        phetioTargetOrbitsTandem.createTandem( 'targetOrbit4Property' ) );
    }

    this.isSolarSystemProperty = new DerivedProperty( [ this.sun.massProperty ], sunMass => sunMass === 200 );

    this.alwaysCircularProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'alwaysCircularProperty' )
    } );

    this.sun.massProperty.lazyLink( () => {
      // Pause the sim when the Sun's ( id = 0 ) mass is changed
      this.isPlayingProperty.value = false;
      this.engine.update( this.bodies );
    } );

    this.loadBodyInfo( this.defaultBodyInfo );

    this.lastLaw = this.selectedLawProperty.value;

    this.periodDivisionsProperty.link( divisions => {
      this.engine.periodDivisions = divisions;
      this.engine.resetOrbitalAreas( this.isPlayingProperty.value );
    } );

    this.selectedAxisPowerProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 3 ),
      tandem: this.hasThirdLawFeatures ? options.tandem.createTandem( 'selectedAxisPowerProperty' ) : Tandem.OPT_OUT
    } );

    this.selectedPeriodPowerProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 3 ),
      tandem: this.hasThirdLawFeatures ? options.tandem.createTandem( 'selectedPeriodPowerProperty' ) : Tandem.OPT_OUT
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
      tandem: options.tandem.createTandem( 'stopwatch' )
    } );

    this.periodTracker = new PeriodTracker( this, this.hasThirdLawFeatures ? options.tandem.createTandem( 'periodTracker' ) : Tandem.OPT_OUT );

    const animatedZoomScaleRange = new Range( 45, 100 );
    const animatedZoomScaleProperty = new NumberProperty( animatedZoomScaleRange.min, {
      range: animatedZoomScaleRange
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
      if ( zoomLevel === 1 && !this.resetting ) {
        zoomAnimationIn.start();
      }
      else if ( !this.resetting ) {
        zoomAnimationOut.start();
      }
      else {
        animatedZoomScaleProperty.value = animatedZoomScaleRange.max;
      }
    } );

    this.zoomScaleProperty = new DerivedProperty( [ animatedZoomScaleProperty ], animatedZoomScale => animatedZoomScale );

    this.bodies.forEach( body => {
      Multilink.lazyMultilink(
        [ body.userIsControllingPositionProperty, body.userIsControllingVelocityProperty, body.userIsControllingMassProperty ],
        ( userIsControllingPosition: boolean, userIsControllingVelocity: boolean, userIsControllingMass: boolean ) => {
          // It's OK to keep playing when the user is changing mass.
          if ( userIsControllingPosition || userIsControllingVelocity ) {
            this.isPlayingProperty.value = false;
          }

          if ( userIsControllingPosition || userIsControllingVelocity || userIsControllingMass ) {
            // The user has started changing one or more of the body Properties.
            this.userInteractingEmitter.emit();
          }
        } );
    } );
  }

  /**
   * Simpler version of loadBodyInfo than the one in SolarSystemCommonModel
   */
  public override loadBodyInfo( bodiesInfo: BodyInfo[] ): void {
    super.loadBodyInfo( bodiesInfo );

    this.engine && this.engine.update( this.bodies );
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

    this.engine.reset();
    this.engine.updateAllowedProperty.reset();
    this.resetting = false;

    // Do not reset targetOrbit*Property, since they are for PhET-iO only.
  }

  public override update(): void {
    if ( this.engine.updateAllowedProperty.value ) {
      this.engine.update( this.bodies );
    }
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.periodTracker.step( dt );
  }

  public override stepOnce( dt: number ): void {
    // Scaling dt according to the speeds of the sim
    dt *= this.timeSpeedMap.get( this.timeSpeedProperty.value )!;

    // Scaling dt to the engine time
    dt *= this.engineTimeScale;

    this.engine.run( dt, true );

    // Scale dt again to convert it to view time
    dt *= this.modelToViewTime;

    this.timeProperty.value += dt;
    if ( this.stopwatch.isRunningProperty.value ) {
      this.stopwatch.step( dt );
    }
  }

  /**
   * Retrieves the color of the given orbital area, based on which is active and the palette.
   * @param area
   */
  public getAreaColor( area: OrbitalArea ): Color {
    const orbitalAreaColors = KeplersLawsColors.ORBITAL_AREA_COLORS;
    const numAreas = this.periodDivisionsProperty.value;
    const activeAreaIndex = this.engine.activeAreaIndex;

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