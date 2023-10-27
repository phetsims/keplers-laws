// Copyright 2023, University of Colorado Boulder
/**
 * Node that displays a fraction that grows dynamically based on the contents.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { Line, Node, NodeOptions, VBoxOptions } from '../../../../scenery/js/imports.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import Multilink from '../../../../axon/js/Multilink.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

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