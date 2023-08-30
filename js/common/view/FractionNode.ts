// Copyright 2023, University of Colorado Boulder
/**
 * Node that displays a fraction that grows dynamically based on the contents.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { Node, Line, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

const FRACTION_LINE_MARGIN = 5;

export default class FractionNode extends VBox {
  public constructor( numeratorNode: Node, denominatorNode: Node, providedOptions?: StrictOmit<VBoxOptions, 'children'> ) {

    const fractionLine = new Line( 0, 0, 1, 0, { stroke: KeplersLawsColors.foregroundProperty, lineWidth: 1.5, lineCap: 'round' } );

    // Dynamically size the fraction line.
    Multilink.multilink( [ numeratorNode.boundsProperty, denominatorNode.boundsProperty ],
      ( numeratorBounds, denominatorBounds ) => {
        fractionLine.setLine( 0, 0, Math.max( numeratorBounds.width, denominatorBounds.width ) + FRACTION_LINE_MARGIN, 0 );
      } );

    const options = combineOptions<VBoxOptions>( {
      spacing: 5,
      children: [
        numeratorNode,
        fractionLine,
        denominatorNode
      ]
    }, providedOptions );

    super( options );
  }
}

keplersLaws.register( 'FractionNode', FractionNode );