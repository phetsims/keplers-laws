// Copyright 2023-2025, University of Colorado Boulder

/**
 * Panel that displays the different possible eccentricities within 0 and 1, as well as the
 * current orbital eccentricity and the equation e = c/a .
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import FirstLawGraph from './FirstLawGraph.js';
import FractionNode from './FractionNode.js';

const EQUATION_TEXT_OPTIONS = {
  font: new PhetFont( { size: 18, weight: 'bold' } ),
  fill: SolarSystemCommonColors.foregroundProperty
};

export default class EccentricityPanel extends Panel {
  public constructor( eccentricityProperty: NumberProperty, eccentricityVisibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      visibleProperty: eccentricityVisibleProperty,
      tandem: tandem
    } );

    // Eccentricity = c / a
    const equationNode = new HBox( {
      justify: 'left',
      spacing: 2,
      children: [
        new Text( KeplersLawsStrings.eccentricityStringProperty,
          combineOptions<TextOptions>( {}, EQUATION_TEXT_OPTIONS, {
            maxWidth: 150
          } ) ),
        new Text( ' = ', EQUATION_TEXT_OPTIONS ),
        new FractionNode(
          new Text( KeplersLawsStrings.symbol.cStringProperty,
            combineOptions<TextOptions>( {}, EQUATION_TEXT_OPTIONS, {
              fill: KeplersLawsColors.focalDistanceColorProperty,
              maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
            } ) ),
          new Text( KeplersLawsStrings.symbol.aStringProperty,
            combineOptions<TextOptions>( {}, EQUATION_TEXT_OPTIONS, {
              fill: KeplersLawsColors.semiMajorAxisColorProperty,
              maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
            } ) )
        )
      ]
    } );

    // The graph that shows the eccentricity of the orbit, compared to other orbits.
    const graphNode = new FirstLawGraph( eccentricityProperty );

    const content = new VBox( {
      children: [ equationNode, graphNode ],
      spacing: 10,
      align: 'left',
      stretch: true
    } );

    super( content, options );
  }
}

keplersLaws.register( 'EccentricityPanel', EccentricityPanel );