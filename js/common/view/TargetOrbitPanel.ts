// Copyright 2023-2024, University of Colorado Boulder
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
import { HBox, Node, Path, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TargetOrbitComboBox from './TargetOrbitComboBox.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class TargetOrbitPanel extends Panel {
  public constructor(
    model: Pick<KeplersLawsModel, 'isSecondLawProperty' | 'targetOrbitProperty' | 'isSolarSystemProperty'>,
    topLayer: Node,
    isTargetOrbitPanelVisibleProperty: TReadOnlyProperty<boolean>,
    tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      visibleProperty: new DerivedProperty( [ model.isSecondLawProperty, isTargetOrbitPanelVisibleProperty ], ( isSecondLaw, isTargetOrbitPanelVisible ) => {
        return !isSecondLaw && isTargetOrbitPanelVisible;
      } ),
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true,
      phetioFeatured: true
    } );

    const targetOrbitText = new Text( KeplersLawsStrings.targetOrbitStringProperty,
      combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        maxWidth: 150
      } ) );

    const targetOrbitIcon = new Path( new Shape().ellipse( Vector2.ZERO, 10, 8, 0 ), {
      stroke: KeplersLawsColors.targetOrbitColorProperty,
      lineWidth: 2
    } );

    const targetOrbitComboBox = new TargetOrbitComboBox( model.targetOrbitProperty, topLayer, {
      enabledProperty: model.isSolarSystemProperty,
      layoutOptions: {
        align: 'center'
      },
      tandem: tandem.createTandem( 'targetOrbitComboBox' )
    } );

    const content = new VBox( {
      spacing: 5,
      align: 'left',
      children: [
        new HBox( {
          layoutOptions: { stretch: true },
          children: [ targetOrbitText, targetOrbitIcon ]
        } ),
        targetOrbitComboBox
      ]
    } );

    super( content, options );
  }
}

keplersLaws.register( 'TargetOrbitPanel', TargetOrbitPanel );