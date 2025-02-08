// Copyright 2023-2025, University of Colorado Boulder
/**
 * Node that displays a fraction that grows dynamically based on the contents.
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsColors from '../KeplersLawsColors.js';

const FRACTION_LINE_MARGIN = 5;

type SelfOptions = EmptySelfOptions;

type FractionNodeOptions = SelfOptions & StrictOmit<VBoxOptions, 'children'>;

export default class FractionNode extends Node {
  public constructor( numeratorNode: Node, denominatorNode: Node, providedOptions?: FractionNodeOptions ) {

    const fractionLine = new Line( 0, 0, 1, 0, { stroke: KeplersLawsColors.foregroundProperty, lineWidth: 1.5, lineCap: 'round' } );

    const options = optionize<FractionNodeOptions, SelfOptions, NodeOptions>()( {
      children: [
        numeratorNode,
        fractionLine,
        denominatorNode
      ]
    }, providedOptions );

    super( options );

    // Dynamically size the fraction line.
    Multilink.multilink( [ numeratorNode.boundsProperty, denominatorNode.boundsProperty ],
      ( numeratorBounds, denominatorBounds ) => {
        fractionLine.setLine( 0, 0, Math.max( numeratorBounds.width, denominatorBounds.width ) + FRACTION_LINE_MARGIN, 0 );
        numeratorNode.centerBottom = fractionLine.centerTop.minusXY( 0, 5 );
        denominatorNode.centerTop = fractionLine.centerBottom.plusXY( 0, 5 );
      } );
  }
}

keplersLaws.register( 'FractionNode', FractionNode );