// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's first law panel control: eccentricity display
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import MySolarSystemStrings from '../../../../my-solar-system/js/MySolarSystemStrings.js';
import Panel from '../../../../sun/js/Panel.js';
import FirstLawGraph from './FirstLawGraph.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import keplersLaws from '../../keplersLaws.js';

export default class FirstLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      children: [
        new ExcentricityPanel( model ),
        new ValuesPanel( model )
      ]
    } );
  }
}

class ExcentricityPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    super( new VBox( {
      children: [
        new HBox( {
          children: [
            new Text( MySolarSystemStrings.eccentricityEquationStringProperty, SolarSystemCommonConstants.TITLE_OPTIONS ),
            new Text( MySolarSystemStrings.symbols.focalDistanceStringProperty, combineOptions<TextOptions>( {},
              SolarSystemCommonConstants.TITLE_OPTIONS, { fill: SolarSystemCommonColors.thirdBodyColorProperty } ) ),
            new Text( MySolarSystemStrings.symbols.divisionStringProperty, SolarSystemCommonConstants.TITLE_OPTIONS ),
            new Text( MySolarSystemStrings.symbols.semiMajorAxisStringProperty, combineOptions<TextOptions>( {},
              SolarSystemCommonConstants.TITLE_OPTIONS, { fill: 'orange' } ) )
          ]
        } ),
        new FirstLawGraph( model )
      ],
      spacing: 10,
      align: 'left',
      stretch: true,
      visibleProperty: model.eccentricityVisibleProperty
    } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );
  }
}

class ValuesPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {

    const conditionalAUStringProperty = new DerivedProperty(
      [ MySolarSystemStrings.units.AUStringProperty, model.engine.allowedOrbitProperty ],
      ( AUString, allowedOrbit ) => {
        return allowedOrbit ? AUString : '';
      } );

    const semiMajorAxisStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.semiMajorAxisStringProperty,
      units: conditionalAUStringProperty,
      value: new DerivedProperty( [ model.engine.semiMajorAxisProperty, model.engine.allowedOrbitProperty ], ( semiMajorAxis, allowedOrbit ) => {
        return allowedOrbit ? Utils.toFixed( semiMajorAxis, 2 ) : KeplersLawsStrings.undefinedStringProperty;
      } )
    } );
    const semiMinorAxisStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.semiMinorAxisStringProperty,
      units: conditionalAUStringProperty,
      value: new DerivedProperty( [ model.engine.semiMinorAxisProperty, model.engine.allowedOrbitProperty ], ( semiMinorAxis, allowedOrbit ) => {
        return allowedOrbit ? Utils.toFixed( semiMinorAxis, 2 ) : KeplersLawsStrings.undefinedStringProperty;
      } )
    } );
    const focalDistanceStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.focalDistanceStringProperty,
      units: conditionalAUStringProperty,
      value: new DerivedProperty( [ model.engine.focalDistanceProperty, model.engine.allowedOrbitProperty ], ( focalDistance, allowedOrbit ) => {
        return allowedOrbit ? Utils.toFixed( focalDistance, 2 ) : KeplersLawsStrings.undefinedStringProperty;
      } )
    } );

    super( new VBox( {
      align: 'left',
      children: [
        new RichText( semiMajorAxisStringProperty, combineOptions<TextOptions>( {
          visibleProperty: model.semiaxisVisibleProperty
        }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
        new RichText( semiMinorAxisStringProperty, combineOptions<TextOptions>( {
          visibleProperty: model.semiaxisVisibleProperty
        }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
        new RichText( focalDistanceStringProperty, combineOptions<TextOptions>( {
          visibleProperty: model.eccentricityVisibleProperty
        }, SolarSystemCommonConstants.TEXT_OPTIONS ) )
      ]
    } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );
  }
}

keplersLaws.register( 'FirstLawPanels', FirstLawPanels );