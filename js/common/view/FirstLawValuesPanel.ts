// Copyright 2023, University of Colorado Boulder
/**
 * Panel with the basic orbital values: semimajor and semiminor axis and focal distance (a,b,c).
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { HBox, RichText, TPaint, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import InfoDialog from './InfoDialog.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';

export default class FirstLawValuesPanel extends Panel {
  public constructor( model: KeplersLawsModel, providedOptions: PanelOptions ) {

    const options = combineOptions<PanelOptions>( {
      visibleProperty: DerivedProperty.or( [ model.semiaxisVisibleProperty, model.eccentricityVisibleProperty ] )
    }, providedOptions );

    const conditionalAUStringProperty = new DerivedProperty(
      [ KeplersLawsStrings.units.AUStringProperty, model.engine.allowedOrbitProperty ],
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
          maxWidth: KeplersLawsConstants.EQUATION_MAX_WIDTH
        } ),
        new RichText( ' = ', KeplersLawsConstants.EQUATION_TEXT_OPTIONS ),
        new RichText( text, KeplersLawsConstants.EQUATION_TEXT_OPTIONS )
      ];
    };

    const infoDialog = new InfoDialog();

    super( new HBox( {
      align: 'top',
      children: [
        new VBox( {
          align: 'left',
          children: [
            new HBox( {
              spacing: 2,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.semiMajorAxisStringProperty,
                semiMajorAxisStringProperty,
                KeplersLawsColors.semiMajorAxisColorProperty
              )
            } ),
            new HBox( {
              spacing: 2,
              visibleProperty: model.semiaxisVisibleProperty,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.semiMinorAxisStringProperty,
                semiMinorAxisStringProperty,
                KeplersLawsColors.semiMinorAxisColorProperty
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
          accessibleName: KeplersLawsStrings.a11y.infoButtonStringProperty,
          scale: 0.5,
          iconFill: 'rgb( 41, 106, 163 )',
          touchAreaDilation: 20,
          listener: () => infoDialog.show()
        } )
      ]
    } ), combineOptions<PanelOptions>( options, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) );
  }
}

keplersLaws.register( 'FirstLawValuesPanel', FirstLawValuesPanel );