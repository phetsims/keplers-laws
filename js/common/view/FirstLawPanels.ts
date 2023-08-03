// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's first law panel control: eccentricity display
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, Line, RichText, Text, TextOptions, TPaint, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import Panel from '../../../../sun/js/Panel.js';
import FirstLawGraph from './FirstLawGraph.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import keplersLaws from '../../keplersLaws.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import KeplersLawsConstants from '../../KeplersLawsConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import KeplersLawsColors from '../../KeplersLawsColors.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import InfoDialog from './InfoDialog.js';

export default class FirstLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      children: [
        new EccentricityPanel( model ),
        new ValuesPanel( model )
      ],
      maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 1.5
    } );
  }
}

class EccentricityPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    super( new VBox( {
      children: [
        new HBox( {
          justify: 'left',
          margin: 5,
          children: [
            new Text( KeplersLawsStrings.eccentricityEquationStringProperty, KeplersLawsConstants.TITLE_OPTIONS ),
            new VBox( {
              children: [
                new Text( KeplersLawsStrings.symbols.focalDistanceStringProperty, combineOptions<TextOptions>( {},
                  KeplersLawsConstants.TITLE_OPTIONS, {
                    fill: KeplersLawsColors.focalDistanceColorProperty
                  } ) ),
                new Line( 0, 0, 30, 0, { stroke: SolarSystemCommonColors.foregroundProperty, lineWidth: 1.5, lineCap: 'round' } ),
                new Text( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, combineOptions<TextOptions>( {},
                  KeplersLawsConstants.TITLE_OPTIONS, {
                    fill: KeplersLawsColors.semimajorAxisColorProperty
                  } ) )
              ]
            } )
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
      [ SolarSystemCommonStrings.units.AUStringProperty, model.engine.allowedOrbitProperty ],
      ( AUString, allowedOrbit ) => {
        return allowedOrbit ? AUString : '';
      } );

    const semiMajorAxisStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: conditionalAUStringProperty,
      value: new DerivedProperty( [ model.engine.semiMajorAxisProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ], ( semiMajorAxis, allowedOrbit, undefinedMessage ) => {
        return allowedOrbit ? Utils.toFixed( semiMajorAxis, 2 ) : undefinedMessage;
      } )
    }, { tandem: Tandem.OPT_OUT } );
    const semiMinorAxisStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: conditionalAUStringProperty,
      value: new DerivedProperty( [ model.engine.semiMinorAxisProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ], ( semiMinorAxis, allowedOrbit, undefinedMessage ) => {
        return allowedOrbit ? Utils.toFixed( semiMinorAxis, 2 ) : undefinedMessage;
      } )
    }, { tandem: Tandem.OPT_OUT } );
    const focalDistanceStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: conditionalAUStringProperty,
      value: new DerivedProperty( [ model.engine.focalDistanceProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ], ( focalDistance, allowedOrbit, undefinedMessage ) => {
        return allowedOrbit ? Utils.toFixed( focalDistance, 2 ) : undefinedMessage;
      } )
    }, { tandem: Tandem.OPT_OUT } );

    const createCustomEquation = ( symbol: TReadOnlyProperty<string>, text: TReadOnlyProperty<string>, symbolColor: TPaint ) => {
      return [
        new RichText( symbol, {
          fill: symbolColor,
          font: new PhetFont( { size: 18, weight: 'bold' } ),
          maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
        } ),
        new RichText( ' = ', KeplersLawsConstants.TEXT_OPTIONS ),
        new RichText( text, KeplersLawsConstants.TEXT_OPTIONS )
      ];
    };

    const infoDialog = new InfoDialog();

    super( new HBox( {
      align: 'top',
      visibleProperty: DerivedProperty.or( [ model.semiaxisVisibleProperty, model.eccentricityVisibleProperty ] ),
      children: [
        new VBox( {
          align: 'left',
          children: [
            new HBox( {
              spacing: 2,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.semiMajorAxisStringProperty,
                semiMajorAxisStringProperty,
                KeplersLawsColors.semimajorAxisColorProperty
              )
            } ),
            new HBox( {
              spacing: 2,
              visibleProperty: model.semiaxisVisibleProperty,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.semiMinorAxisStringProperty,
                semiMinorAxisStringProperty,
                KeplersLawsColors.semiminorAxisColorProperty
              )
            } ),
            new HBox( {
              spacing: 2,
              visibleProperty: model.eccentricityVisibleProperty,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.focalDistanceStringProperty,
                focalDistanceStringProperty,
                KeplersLawsColors.focalDistanceColorProperty
              )
            } )
          ]
        } ),
        new InfoButton( {
          accessibleName: 'accessibleName',
          scale: 0.5,
          iconFill: 'rgb( 41, 106, 163 )',
          touchAreaDilation: 20,
          listener: () => infoDialog.show()
        } )
      ]
    } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );
  }
}

keplersLaws.register( 'FirstLawPanels', FirstLawPanels );