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

type SuperTypeOptions = CommonModelOptions<EllipticalOrbitEngine>;

type SelfOptions = {
  initialLaw?: LawMode;
};

export type KeplersLawsModelOptions = SelfOptions & StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

class KeplersLawsModel extends SolarSystemCommonModel<EllipticalOrbitEngine> {
  public readonly selectedLawProperty: EnumerationProperty<LawMode>;

  // Will enforce that the orbit is always circular
  public readonly alwaysCircularProperty = new BooleanProperty( false );

  // Booleans to keep track of which law is selected
  public readonly isFirstLawProperty = new BooleanProperty( false );
  public readonly isSecondLawProperty = new BooleanProperty( false );
  public readonly isThirdLawProperty = new BooleanProperty( false );
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
  public readonly secondLawVisibilities: BooleanProperty[] = [
    this.apoapsisVisibleProperty,
    this.periapsisVisibleProperty,
    this.areaValuesVisibleProperty
  ];

  // Third law properties
  public readonly semiMajorAxisVisibleProperty = new BooleanProperty( true );
  public readonly periodVisibleProperty = new BooleanProperty( false );
  public readonly thirdLawVisibilities: BooleanProperty[] = [
    this.semiMajorAxisVisibleProperty,
    this.periodVisibleProperty
  ];

  // Graph exponents
  public readonly selectedAxisPowerProperty = new NumberProperty( 1 );
  public readonly selectedPeriodPowerProperty = new NumberProperty( 1 );

  public readonly poweredSemiMajorAxisProperty: ReadOnlyProperty<number>;
  public readonly poweredPeriodProperty: ReadOnlyProperty<number>;

  // The object that controls the blue path drawn when measuring the period
  public readonly periodTracker: PeriodTracker;

  public constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, SelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new EllipticalOrbitEngine( bodies ),
      isLab: false,
      timeScale: 2,
      modelToViewTime: 1 / 12.7,
      initialLaw: LawMode.FIRST_LAW
    }, providedOptions );
    super( options );

    this.lawVisibilitiesMap.set( LawMode.FIRST_LAW, this.firstLawVisibilities );
    this.lawVisibilitiesMap.set( LawMode.SECOND_LAW, this.secondLawVisibilities );
    this.lawVisibilitiesMap.set( LawMode.THIRD_LAW, this.thirdLawVisibilities );

    this.pathVisibleProperty.value = false;

    this.isPlayingProperty.link( isPlaying => {
      if ( isPlaying ) {
        this.userControlledProperty.value = true;
      }
    } );

    this.bodies[ 0 ].massProperty.lazyLink( () => {
      // Pause the sim when the Sun's ( id = 0 ) mass is changed
      this.isPlayingProperty.value = false;
    } );

    this.selectedLawProperty = new EnumerationProperty( options.initialLaw );

    this.defaultBodyState = [
      { active: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { active: true, mass: 50, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 100 ) }
    ];
    this.loadBodyStates( this.defaultBodyState );

    let lastLaw = this.selectedLawProperty.value;
    this.selectedLawProperty.link( law => {
      this.saveAndDisableVisibilityState( lastLaw );
      this.resetVisibilityState( law );

      this.isFirstLawProperty.value = law === LawMode.FIRST_LAW;
      this.isSecondLawProperty.value = law === LawMode.SECOND_LAW;
      this.isThirdLawProperty.value = law === LawMode.THIRD_LAW;

      lastLaw = law;
      this.lawUpdatedEmitter.emit();
    } );

    this.periodDivisionProperty.link( divisions => {
      this.engine.periodDivisions = divisions;
      this.engine.resetOrbitalAreas();
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

    this.alwaysCircularProperty.link( alwaysCircular => {
      this.engine.alwaysCircles = alwaysCircular;
      this.engine.update();
    } );

    this.periodTracker = new PeriodTracker( this );

    this.forceScaleProperty.value = 0.5;
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
  }

  public override reset(): void {
    super.reset();
    this.selectedLawProperty.reset();
    this.periodDivisionProperty.reset();
    this.selectedAxisPowerProperty.reset();
    this.selectedPeriodPowerProperty.reset();
    this.alwaysCircularProperty.reset();
    this.periodTracker.reset();

    this.hardVisibilityReset();
    this.engine.updateAllowed = true;
    this.engine.reset();
    this.engine.update();

    this.loadBodyStates( this.defaultBodyState );
  }

  public override update(): void {
    if ( this.engine.updateAllowed ) {
      this.engine.update();
    }
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.periodTracker.step( dt );
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

    // Easter egg color palette
    // const colorPalette = [
    // '#FFB3BA', // Pastel Red
    //   '#FFDFB9', // Pastel Orange
    //   '#FFFFB3', // Pastel Yellow
    //   '#B5FFB3', // Pastel Green
    //   '#B3FFFF', // Pastel Blue
    //   '#D1B3FF'  // Pastel Purple
    // ];
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

    return new Color( colorPalette[ colorIndex ] ).setAlpha( area.alreadyEntered ? 1 : 0 );

  }
}

keplersLaws.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;