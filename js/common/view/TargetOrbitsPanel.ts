// Copyright 2023, University of Colorado Boulder
/**
 * Panel with the controls for the target orbits.
 *
 * Contains a title text node, the grey target orbit symbol, and the target orbit selector.
 * Available orbits are: Mercury, Venus, Earth, Mars, Jupiter.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Node, HBox, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TargetOrbitsComboBox from './TargetOrbitsComboBox.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsColors from '../KeplersLawsColors.js';

export default class TargetOrbitsPanel extends Panel {
  public constructor( model: Pick<KeplersLawsModel, 'isSecondLawProperty' | 'targetOrbitProperty' | 'isSolarSystemProperty'>, topLayer: Node ) {

    const options = combineOptions<PanelOptions>( {
      visibleProperty: DerivedProperty.not( model.isSecondLawProperty )
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );
    const targetOrbitText = new Text( KeplersLawsStrings.targetOrbitStringProperty, SolarSystemCommonConstants.TEXT_OPTIONS );

    const targetOrbitIcon = new Path( new Shape().ellipse( Vector2.ZERO, 10, 8, 0 ), {
      stroke: KeplersLawsColors.targetOrbitColorProperty,
      lineWidth: 2
    } );

    const comboBox = new TargetOrbitsComboBox( model.targetOrbitProperty, topLayer, {
      enabledProperty: model.isSolarSystemProperty,
      layoutOptions: {
        align: 'center'
      }
    } );

    const content = new VBox( {
      spacing: 5,
      align: 'left',
      children: [
        new HBox( {
          layoutOptions: { stretch: true },
          children: [ targetOrbitText, targetOrbitIcon ]
        } ),
        comboBox
      ]
    } );

    super( content, options );
  }
}

keplersLaws.register( 'TargetOrbitsPanel', TargetOrbitsPanel );