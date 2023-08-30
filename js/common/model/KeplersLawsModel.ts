// Copyright 2023, University of Colorado Boulder

/**
 * The model in charge of the Kepler's Laws Screen components.
 * It extends the SolarSystemCommonModel, and adds the necessary properties and logic to handle the laws functionalities.
 *
 * @author Agustín Vallejo
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SolarSystemCommonModel, { BodyInfo, CommonModelOptions } from '../../../../solar-system-common/js/model/SolarSystemCommonModel.js';
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
import Body from '../../../../solar-system-common/js/model/Body.js';

type SuperTypeOptions = CommonModelOptions<EllipticalOrbitEngine>;

type SelfOptions = {
  initialLaw?: LawMode;
};

export type KeplersLawsModelOptions = SelfOptions & StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

class KeplersLawsModel extends SolarSystemCommonModel<EllipticalOrbitEngine> {
  public readonly sun: Body;
  public readonly planet: Body;
  
  public readonly selectedLawProperty: EnumerationProperty<LawMode>;

  public readonly targetOrbitProperty = new EnumerationProperty( TargetOrbits.NONE );
  public readonly isSolarSystemProperty: ReadOnlyProperty<boolean>;

  // Will enforce that the orbit is always circular
  public readonly alwaysCircularProperty = new BooleanProperty( false );

  // Stopwatch visibility
  public readonly stopwatchVisibleProperty = new BooleanProperty( false );
  public readonly stopwatch = new Stopwatch();

  // Booleans to keep track of which law is selected
  public readonly isFirstLawProperty: ReadOnlyProperty<boolean>;
  public readonly isSecondLawProperty: ReadOnlyProperty<boolean>;
  public readonly isThirdLawProperty: ReadOnlyProperty<boolean>;
  public readonly lawUpdatedEmitter = new Emitter();

  // Map that relates each law with its corresponding visible boolean properties
  public lawVisibilitiesMap = new Map<LawMode, BooleanProperty[]>();

  // First Law Properties
  public readonly axisVisibleProperty = new BooleanProperty( false );
  public readonly semiaxisVisibleProperty = new BooleanProperty( false );
  public readonly fociVisibleProperty = new BooleanProperty( false );
  public readonly stringsVisibleProperty = new BooleanProperty( false );
  public readonly eccentricityVisibleProperty = new BooleanProperty( false );
  public readonly firstLawVisibilities: BooleanProperty[] = [
    this.stringsVisibleProperty,
    this.semiaxisVisibleProperty,
    this.axisVisibleProperty,
    this.fociVisibleProperty,
    this.eccentricityVisibleProperty
  ];

  // Second Law properties
  public readonly periodDivisionProperty = new NumberProperty( 4 );
  public readonly apoapsisVisibleProperty = new BooleanProperty( false );
  public readonly periapsisVisibleProperty = new BooleanProperty( false );
  public readonly areaValuesVisibleProperty = new BooleanProperty( false );
  public readonly timeValuesVisibleProperty = new BooleanProperty( false );
  public readonly secondLawVisibilities: BooleanProperty[] = [
    this.apoapsisVisibleProperty,
    this.periapsisVisibleProperty,
    this.areaValuesVisibleProperty,
    this.timeValuesVisibleProperty
  ];

  // Third law properties
  public readonly semiMajorAxisVisibleProperty = new BooleanProperty( true );
  public readonly periodVisibleProperty = new BooleanProperty( false );
  public readonly thirdLawVisibilities: BooleanProperty[] = [
    this.semiMajorAxisVisibleProperty,
    this.periodVisibleProperty
  ];

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

  public constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, SelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new EllipticalOrbitEngine( bodies ),
      isLab: false,
      timeScale: 2,
      modelToViewTime: 1 / 12.7,
      initialLaw: LawMode.FIRST_LAW
    }, providedOptions );
    super( options );

    this.sun = this.bodies[ 0 ];
    this.planet = this.bodies[ 1 ];

    this.isSolarSystemProperty = new DerivedProperty( [ this.sun.massProperty ], sunMass => sunMass === 200 );
    this.lawVisibilitiesMap.set( LawMode.FIRST_LAW, this.firstLawVisibilities );
    this.lawVisibilitiesMap.set( LawMode.SECOND_LAW, this.secondLawVisibilities );
    this.lawVisibilitiesMap.set( LawMode.THIRD_LAW, this.thirdLawVisibilities );

    this.pathVisibleProperty.value = false;

    this.isPlayingProperty.link( isPlaying => {
      if ( isPlaying ) {
        this.userControlledProperty.value = true;
        this.engine.resetOrbitalAreas( isPlaying );
      }
    } );

    this.sun.massProperty.lazyLink( () => {
      // Pause the sim when the Sun's ( id = 0 ) mass is changed
      this.isPlayingProperty.value = false;
    } );

    this.selectedLawProperty = new EnumerationProperty( options.initialLaw );

    this.defaultBodyState = [
      { active: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { active: true, mass: 50, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 81.6 ) }
    ];
    this.loadBodyStates( this.defaultBodyState );

    this.isFirstLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.FIRST_LAW );
    this.isSecondLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.SECOND_LAW );
    this.isThirdLawProperty = new DerivedProperty( [ this.selectedLawProperty ],
      selectedLaw => selectedLaw === LawMode.THIRD_LAW );

    let lastLaw = this.selectedLawProperty.value;
    this.selectedLawProperty.link( law => {
      this.saveAndDisableVisibilityState( lastLaw );
      this.resetVisibilityState( law );
      lastLaw = law;
      this.lawUpdatedEmitter.emit();
    } );

    this.periodDivisionProperty.link( divisions => {
      this.engine.periodDivisions = divisions;
      this.engine.resetOrbitalAreas( this.isPlayingProperty.value );
    } );

    this.axisVisibleProperty.link( axisVisible => {
      this.semiaxisVisibleProperty.value = axisVisible ? this.semiaxisVisibleProperty.value : false;
    } );
    this.fociVisibleProperty.link( fociVisible => {
      this.stringsVisibleProperty.value = fociVisible ? this.stringsVisibleProperty.value : false;
    } );

    this.velocityVisibleProperty.value = true;
    this.velocityVisibleProperty.setInitialValue( true );

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
      this.engine.update();
    } );

    this.periodTracker = new PeriodTracker( this );

    this.forceScaleProperty.setInitialValue( -0.25 );
    this.forceScaleProperty.reset();

    const zoomRange = new Range( 0.45, 1 );
    this.zoomLevelProperty = new NumberProperty( 2, {
      range: new Range( 1, 2 ),
      numberType: 'Integer'
    } );
    const animatedZoomProperty = new NumberProperty( 1 );
    const zoomAnimationIn = new Animation( {
      property: animatedZoomProperty,
      duration: 0.5,
      to: zoomRange.min,
      easing: Easing.CUBIC_IN_OUT
    } );
    const zoomAnimationOut = new Animation( {
      property: animatedZoomProperty,
      duration: 0.5,
      to: zoomRange.max,
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
        animatedZoomProperty.value = zoomRange.max;
      }
    } );

    this.zoomProperty = new DerivedProperty( [ animatedZoomProperty ], zoom => zoom );
  }

  /**
   * Simpler version of loadBodyStates than the one in SolarSystemCommonModel
   */
  public override loadBodyStates( bodiesInfo: BodyInfo[] ): void {
    super.loadBodyStates( bodiesInfo );

    this.engine && this.engine.update();
  }

  public saveAndDisableVisibilityState( law: LawMode ): void {
    // When going from Law A to Law B, it saves the current state of Law A and sets it all to false.
    // When going back to Law A, it will restore the state of Law A.
    this.lawVisibilitiesMap.get( law )!.forEach( property => {
      property.setInitialValue( property.value );
      property.value = false;
    } );
  }

  public resetVisibilityState( law: LawMode ): void {
    // Because in saveAndDisableVisibilityState, the initial values were set,
    // this will restore the initial values.
    this.lawVisibilitiesMap.get( law )!.forEach( property => {
      property.reset();
    } );
  }

  public hardVisibilityReset(): void {
    this.lawVisibilitiesMap.forEach( properties => {
      properties.forEach( property => {
        property.setInitialValue( false );
        property.value = false;
      } );
    } );

    // This property is the exception as it should be set to true by default
    this.semiMajorAxisVisibleProperty.setInitialValue( true );
    this.semiMajorAxisVisibleProperty.value = true;
  }

  public override reset(): void {
    this.resetting = true;
    super.reset();
    this.selectedLawProperty.reset();
    this.periodDivisionProperty.reset();
    this.selectedAxisPowerProperty.reset();
    this.selectedPeriodPowerProperty.reset();
    this.alwaysCircularProperty.reset();
    this.periodTracker.reset();
    this.targetOrbitProperty.reset();

    this.hardVisibilityReset();
    this.engine.reset();
    this.engine.updateAllowedProperty.reset();

    this.loadBodyStates( this.defaultBodyState );
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

    if ( this.stopwatch.isRunningProperty.value && this.isPlayingProperty.value ) {
      this.stopwatch.step( dt * this.modelToViewTime * this.timeScale );
    }
  }

  /**
   * Retrieves the color of the given orbital area, based on which is active and the palette.
   * @param area
   */
  public getAreaColor( area: OrbitalArea ): Color {
    const colorPalette = [
      '#FF92FF',
      '#FF6DFF',
      '#FF24FF',
      '#C800C8',
      '#A400A4',
      '#80007F'
    ];

    const numAreas = this.periodDivisionProperty.value;
    const activeAreaIndex = this.engine.activeAreaIndex;

    let colorIndex;

    // Calculate the index difference and map it to color palette.
    let indexDiff = this.engine.retrograde ? area.index - activeAreaIndex : activeAreaIndex - area.index;
    indexDiff = Utils.moduloBetweenDown( indexDiff, 0, numAreas );

    colorIndex = indexDiff;
    if ( numAreas < colorPalette.length ) {
      colorIndex = Math.floor( indexDiff * colorPalette.length / numAreas );
    }
    if ( indexDiff === numAreas - 1 ) {
      colorIndex = colorPalette.length - 1;
    }

    return new Color( colorPalette[ colorIndex ] );

  }
}

keplersLaws.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;