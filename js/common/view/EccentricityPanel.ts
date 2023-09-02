// Copyright 2023, University of Colorado Boulder

/**
 * Panel that displays the different possible eccentricities within 0 and 1, as well as the
 * current orbital eccentricity and the equation e = c/a .
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import FirstLawGraph from './FirstLawGraph.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import keplersLaws from '../../keplersLaws.js';
import FractionNode from './FractionNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';

const EQUATION_TEXT_OPTIONS = {
  font: new PhetFont( { size: 18, weight: 'bold' } ),
  fill: SolarSystemCommonColors.foregroundProperty
};

export default class EccentricityPanel extends Panel {
  public constructor( model: Pick<KeplersLawsModel, 'engine' | 'eccentricityVisibleProperty'> ) {

    const options = combineOptions<PanelOptions>( {
      visibleProperty: model.eccentricityVisibleProperty
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );

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
          new Text( KeplersLawsStrings.symbols.cStringProperty,
            combineOptions<TextOptions>( {}, EQUATION_TEXT_OPTIONS, {
              fill: KeplersLawsColors.focalDistanceColorProperty,
              maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
            } ) ),
          new Text( KeplersLawsStrings.symbols.aStringProperty,
            combineOptions<TextOptions>( {}, EQUATION_TEXT_OPTIONS, {
              fill: KeplersLawsColors.semiMajorAxisColorProperty,
              maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
            } ) )
        )
      ]
    } );

    // The graph that shows the eccentricity of the orbit, compared to other orbits.
    const graphNode = new FirstLawGraph( model.engine.eccentricityProperty );

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