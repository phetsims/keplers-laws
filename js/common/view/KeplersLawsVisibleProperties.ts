// Copyright 2023, University of Colorado Boulder

/**
 * KeplersLawsVisibleProperties is an abstract class that each law will use to define the visible properties
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonVisibleProperties from '../../../../solar-system-common/js/view/SolarSystemCommonVisibleProperties.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LawMode from '../model/LawMode.js';

export default class KeplersLawsVisibleProperties extends SolarSystemCommonVisibleProperties {

  // Indicates if the stopwatch is visible.
  public readonly stopwatchVisibleProperty: BooleanProperty;

  // FIRST LAW VISIBLE PROPERTIES ######################################################################################
  // Indicates if the axes are visible.
  public readonly axesVisibleProperty: BooleanProperty;

  // Indicates if the semiaxes are visible.
  public readonly semiaxesVisibleProperty: BooleanProperty;

  // Indicates if the foci are visible.
  public readonly fociVisibleProperty: BooleanProperty;

  // Indicates if the focal string is visible
  public readonly stringVisibleProperty: BooleanProperty;

  // Indicates if the eccentricity panel and indicators are visible
  public readonly eccentricityVisibleProperty: BooleanProperty;

  // List that contains all the first law visible properties
  public readonly firstLawVisibilities: BooleanProperty[];

  // SECOND LAW VISIBLE PROPERTIES #####################################################################################
  // Indicates if the apoapsis is visible.
  public readonly apoapsisVisibleProperty: BooleanProperty;

  // Indicates if the periapsis is visible.
  public readonly periapsisVisibleProperty: BooleanProperty;

  // Indicates if the area values are visible.
  public readonly areaValuesVisibleProperty: BooleanProperty;

  // Indicates if the time values are visible.
  public readonly timeValuesVisibleProperty: BooleanProperty;

  // Indicates if the second law accordion box is expanded.
  public readonly secondLawAccordionBoxExpandedProperty: BooleanProperty;

  // List that contains all the second law visible properties
  public readonly secondLawVisibilities: BooleanProperty[];


  // THIRD LAW VISIBLE PROPERTIES ######################################################################################
  // Indicates if the semi-major axis is visible.
  public readonly semiMajorAxisVisibleProperty: BooleanProperty;

  // Indicates if the period is visible.
  public readonly periodVisibleProperty: BooleanProperty;

  // Indicates if the third law accordion box is expanded.
  public readonly thirdLawAccordionBoxExpandedProperty: BooleanProperty;

  // List that contains all the third law visible properties
  public readonly thirdLawVisibilities: BooleanProperty[];


  // Map that relates each law with its corresponding visible boolean properties
  public readonly lawVisibilitiesMap = new Map<LawMode, BooleanProperty[]>();

  public constructor( tandem: Tandem ) {
    super( tandem );

    this.stopwatchVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'stopwatchVisibleProperty' ) } );

    this.axesVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'axesVisibleProperty' ) } );
    this.semiaxesVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'semiaxesVisibleProperty' ) } );
    this.fociVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'fociVisibleProperty' ) } );
    this.stringVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'stringVisibleProperty' ) } );
    this.eccentricityVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'eccentricityVisibleProperty' ) } );
    this.firstLawVisibilities = [
      this.stringVisibleProperty,
      this.semiaxesVisibleProperty,
      this.axesVisibleProperty,
      this.fociVisibleProperty,
      this.eccentricityVisibleProperty
    ];

    this.apoapsisVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'apoapsisVisibleProperty' ) } );
    this.periapsisVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'periapsisVisibleProperty' ) } );
    this.areaValuesVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'areaValuesVisibleProperty' ) } );
    this.timeValuesVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'timeValuesVisibleProperty' ) } );
    this.secondLawAccordionBoxExpandedProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'secondLawAccordionBoxExpandedProperty' ) } );
    this.secondLawVisibilities = [
      this.apoapsisVisibleProperty,
      this.periapsisVisibleProperty,
      this.areaValuesVisibleProperty,
      this.timeValuesVisibleProperty,
      this.secondLawAccordionBoxExpandedProperty
    ];

    this.semiMajorAxisVisibleProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'semiMajorAxisVisibleProperty' ) } );
    this.periodVisibleProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'periodVisibleProperty' ) } );
    this.thirdLawAccordionBoxExpandedProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'thirdLawAccordionBoxExpandedProperty' ) } );
    this.thirdLawVisibilities = [
      this.semiMajorAxisVisibleProperty,
      this.periodVisibleProperty,
      this.thirdLawAccordionBoxExpandedProperty
    ];

    this.lawVisibilitiesMap.set( LawMode.FIRST_LAW, this.firstLawVisibilities );
    this.lawVisibilitiesMap.set( LawMode.SECOND_LAW, this.secondLawVisibilities );
    this.lawVisibilitiesMap.set( LawMode.THIRD_LAW, this.thirdLawVisibilities );
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

    // This properties are the exception as they should be set to true by default
    this.semiMajorAxisVisibleProperty.setInitialValue( true );
    this.semiMajorAxisVisibleProperty.value = true;

    this.secondLawAccordionBoxExpandedProperty.setInitialValue( true );
    this.secondLawAccordionBoxExpandedProperty.value = true;

    this.thirdLawAccordionBoxExpandedProperty.setInitialValue( true );
    this.thirdLawAccordionBoxExpandedProperty.value = true;

    this.stopwatchVisibleProperty.reset();
  }
}

keplersLaws.register( 'KeplersLawsVisibleProperties', KeplersLawsVisibleProperties );