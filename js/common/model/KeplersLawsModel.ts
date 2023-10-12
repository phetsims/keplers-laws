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
import TargetOrbits from './TargetOrbits.js';
import Range from '../../../../dot/js/Range.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import Body, { BodyInfo } from '../../../../solar-system-common/js/model/Body.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';

type SuperTypeOptions = SolarSystemCommonModelOptions<EllipticalOrbitEngine>;

type SelfOptions = {
  isAllLaws?: boolean; // whether the model is for the 'All Laws' screen
  initialLaw?: LawMode;
};

export type KeplersLawsModelOptions = SelfOptions & StrictOmit<SuperTypeOptions, 'engineFactory' | 'zoomLevelRange' | 'defaultBodyInfo'>;

class KeplersLawsModel extends SolarSystemCommonModel<EllipticalOrbitEngine> {

  // abstract in SolarSystemCommonModel
  public readonly zoomScaleProperty: TReadOnlyProperty<number>;

  public readonly sun: Body;
  public readonly planet: Body;

  public readonly selectedLawProperty: EnumerationProperty<LawMode>;
  public readonly isAllLaws: boolean;

  public readonly targetOrbitProperty = new EnumerationProperty( TargetOrbits.NONE );
  public readonly isSolarSystemProperty: ReadOnlyProperty<boolean>;

  // Will enforce that the orbit is always circular
  public readonly alwaysCircularProperty = new BooleanProperty( false );

  // Stopwatch visibility
  public readonly stopwatch: Stopwatch;

  // Booleans to keep track of which law is selected
  public readonly isFirstLawProperty: ReadOnlyProperty<boolean>;
  public readonly isSecondLawProperty: ReadOnlyProperty<boolean>;
  public readonly isThirdLawProperty: ReadOnlyProperty<boolean>;
  public readonly lawUpdatedEmitter = new Emitter();

  // Number of divisions of the orbital area
  public readonly periodDivisionsProperty: NumberProperty;

  // Graph exponents
  public readonly correctPowersSelectedProperty: ReadOnlyProperty<boolean>;
  public readonly selectedAxisPowerProperty = new NumberProperty( 1 );
  public readonly selectedPeriodPowerProperty = new NumberProperty( 1 );

  public readonly poweredSemiMajorAxisProperty: ReadOnlyProperty<number>;
  public readonly poweredPeriodProperty: ReadOnlyProperty<number>;

  // The object that controls the blue path drawn when measuring the period
  public readonly periodTracker: PeriodTracker;

  // Boolean for properties to know if the change is being toggled by a reset of the model
  public resetting = false;

  // The last law that was selected
  public lastLaw: LawMode;

  public constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, SelfOptions, SuperTypeOptions>()( {

      // SelfOptions
      isAllLaws: false,
      initialLaw: LawMode.FIRST_LAW,

      // SolarSystemCommonModelOptionsOptions
      engineFactory: bodies => new EllipticalOrbitEngine( bodies ),
      zoomLevelRange: new RangeWithValue( 1, 2, 2 ),
      timeScale: 2,
      modelToViewTime: 1 / 12.7,
      defaultBodyInfo: [
        { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ), tandemName: 'sun' },
        { isActive: true, mass: 50, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 81.6 ), tandemName: 'planet' }
      ]
    }, providedOptions );
    super( options );

    this.sun = this.bodies[ 0 ];
    this.planet = this.bodies[ 1 ];

    this.periodDivisionsProperty = new NumberProperty( KeplersLawsConstants.PERIOD_DIVISIONS_RANGE.defaultValue, {
      range: KeplersLawsConstants.PERIOD_DIVISIONS_RANGE,
      tandem: options.tandem.createTandem( 'periodDivisionsProperty' )
    } );

    this.isSolarSystemProperty = new DerivedProperty( [ this.sun.massProperty ], sunMass => sunMass === 200 );

    this.isPlayingProperty.link( isPlaying => {
      if ( isPlaying ) {
        this.userControlledProperty.value = true;
      }
    } );

    this.sun.massProperty.lazyLink( () => {
      // Pause the sim when the Sun's ( id = 0 ) mass is changed
      this.isPlayingProperty.value = false;
      this.engine.update();
    } );

    this.selectedLawProperty = new EnumerationProperty( options.initialLaw );
    this.isAllLaws = options.isAllLaws;

    this.loadBodyInfo( this.defaultBodyInfo );

    this.isFirstLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.FIRST_LAW );
    this.isSecondLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.SECOND_LAW );
    this.isThirdLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.THIRD_LAW );

    this.lastLaw = this.selectedLawProperty.value;

    this.periodDivisionsProperty.link( divisions => {
      this.engine.periodDivisions = divisions;
      this.engine.resetOrbitalAreas( this.isPlayingProperty.value );
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
        this.engine.update();
      }
    } );

    this.stopwatch = new Stopwatch( {
      tandem: options.tandem.createTandem( 'stopwatch' )
    } );

    this.periodTracker = new PeriodTracker( this );

    this.forceScaleProperty.setInitialValue( -0.25 );
    this.forceScaleProperty.reset();

    const animatedZoomScaleRange = new Range( 0.45, 1 );
    const animatedZoomScaleProperty = new NumberProperty( 1 );
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
  }

  /**
   * Simpler version of loadBodyInfo than the one in SolarSystemCommonModel
   */
  public override loadBodyInfo( bodiesInfo: BodyInfo[] ): void {
    super.loadBodyInfo( bodiesInfo );

    this.engine && this.engine.update();
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
  }

  public override update(): void {
    if ( this.engine.updateAllowedProperty.value ) {
      this.engine.update();
    }
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.periodTracker.step( dt );
  }

  public override stepOnce( dt: number ): void {
    super.stepOnce( dt );

    if ( this.stopwatch.isRunningProperty.value ) {
      this.stopwatch.step( dt * this.timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale * this.modelToViewTime );
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