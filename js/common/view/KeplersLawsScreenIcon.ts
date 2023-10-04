// Copyright 2023, University of Colorado Boulder

/**
 *
 * Generator for all screen icons, each child will validate what components to use
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import keplersLaws from '../../keplersLaws.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';

// constants
// Ellipse parameters
export const semiMajorAxis = 20;
export const semiMinorAxis = 17;

// calculate focal point
export const focalPoint = Math.sqrt( semiMajorAxis * semiMajorAxis - semiMinorAxis * semiMinorAxis );

export default class KeplersLawsScreenIcon extends ScreenIcon {

  public constructor( contents: Node ) {
    super(
      contents,
      {
        fill: SolarSystemCommonColors.backgroundProperty,
        isDisposable: false
      }
    );
  }

  public static createCommonNode(): Node {
    return new Node( {
      children: [
        // All icon elements
        new Path(
          new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ),
          {
            stroke: KeplersLawsColors.orbitColorProperty,
            lineWidth: 1
          } ),
        new ShadedSphereNode( 8, {
          mainColor: SolarSystemCommonColors.body1ColorProperty,
          x: -focalPoint
        } )
      ]
    } );
  }
}

keplersLaws.register( 'KeplersLawsScreenIcon', KeplersLawsScreenIcon );