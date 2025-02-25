// Copyright 2023-2025, University of Colorado Boulder

/**
 * Panel with the basic orbital values: semi-major and semi-minor axes and focal distance (a,b,c).
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import TPaint from '../../../../scenery/js/util/TPaint.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import OrbitalDataInfoDialog from './OrbitalDataInfoDialog.js';

export default class OrbitalDataPanel extends Panel {
  public constructor(
    model: KeplersLawsModel,
    semiaxesVisibleProperty: TReadOnlyProperty<boolean>,
    eccentricityVisibleProperty: TReadOnlyProperty<boolean>,
    tandem: Tandem
  ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      visibleProperty: DerivedProperty.or( [ semiaxesVisibleProperty, eccentricityVisibleProperty ] ),
      tandem: tandem
    } );

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
    } );
    const semiMinorAxisStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: conditionalAUStringProperty,
      value: new DerivedProperty( [ model.engine.semiMinorAxisProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ], ( semiMinorAxis, allowedOrbit, undefinedMessage ) => {
        return allowedOrbit ? Utils.toFixed( semiMinorAxis, 2 ) : undefinedMessage;
      } )
    } );
    const focalDistanceStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: conditionalAUStringProperty,
      value: new DerivedProperty( [ model.engine.focalDistanceProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ], ( focalDistance, allowedOrbit, undefinedMessage ) => {
        return allowedOrbit ? Utils.toFixed( focalDistance, 2 ) : undefinedMessage;
      } )
    } );

    // An equation for each symbol
    const equationsNode = new VBox( {
      align: 'left',
      children: [

        // a =
        createCustomEquation(
          KeplersLawsStrings.symbol.aStringProperty,
          semiMajorAxisStringProperty,
          KeplersLawsColors.semiMajorAxisColorProperty
        ),

        // b =
        createCustomEquation(
          KeplersLawsStrings.symbol.bStringProperty,
          semiMinorAxisStringProperty,
          KeplersLawsColors.semiMinorAxisColorProperty,
          semiaxesVisibleProperty
        ),

        // c =
        createCustomEquation(
          KeplersLawsStrings.symbol.cStringProperty,
          focalDistanceStringProperty,
          KeplersLawsColors.focalDistanceColorProperty,
          eccentricityVisibleProperty
        )
      ]
    } );

    // Info button and associated dialog
    const infoDialog = new OrbitalDataInfoDialog( tandem.createTandem( 'infoDialog' ) );
    const infoButton = new InfoButton( {
      accessibleName: KeplersLawsStrings.a11y.infoButtonForOrbitalDataStringProperty,
      scale: 0.5,
      touchAreaDilation: 20,
      listener: () => infoDialog.show(),
      tandem: tandem.createTandem( 'infoButton' )
    } );

    // The panel's content
    const content = new HBox( {
      align: 'top',
      spacing: 10,
      children: [
        equationsNode,
        infoButton
      ]
    } );

    super( content, options );
  }
}

function createCustomEquation( symbolStringProperty: TReadOnlyProperty<string>, valueStringProperty: TReadOnlyProperty<string>,
                               symbolColor: TPaint, visibleProperty: TReadOnlyProperty<boolean> | null = null ): Node {
  return new HBox( {
    visibleProperty: visibleProperty,
    spacing: 2,
    children: [
      new RichText( symbolStringProperty, {
        fill: symbolColor,
        font: new PhetFont( { size: 18, weight: 'bold' } ),
        maxWidth: 20
      } ),
      new RichText( ' = ', KeplersLawsConstants.TEXT_OPTIONS ),
      new RichText( valueStringProperty, combineOptions<RichTextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        maxWidth: KeplersLawsConstants.VALUE_MAX_WIDTH
      } ) )
    ]
  } );
}

keplersLaws.register( 'OrbitalDataPanel', OrbitalDataPanel );