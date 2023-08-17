// Copyright 2023, University of Colorado Boulder

/**
 *
 * Definition of the First Law Screen Icon: An elliptical orbit with a Sun, the orbiting body, and two foci
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import keplersLaws from '../keplersLaws.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import { Node, Path } from '../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import { Shape } from '../../../kite/js/imports.js';
import XNode, { XNodeOptions } from '../../../scenery-phet/js/XNode.js';
import Vector2 from '../../../dot/js/Vector2.js';
import KeplersLawsScreenIcon, { focalPoint, semiMajorAxis, semiMinorAxis } from '../common/view/KeplersLawsScreenIcon.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import KeplersLawsColors from '../common/KeplersLawsColors.js';

// constants
const FOCI_SCALE = 0.25;

export default class FirstLawScreenIcon extends KeplersLawsScreenIcon {
  public constructor() {
    super( FirstLawScreenIcon.createFullNode() );
  }

  public static createFullNode(): Node {
    return new Node( {
      children: [
        KeplersLawsScreenIcon.createCommonNode(),
        FirstLawScreenIcon.createFirstLawNode()
      ]
    } );
  }

  //REVIEW planet is a lousy parameter name for a boolean. How about hasPlanet or showPlanet?
  public static createFirstLawNode( planet = true ): Node {
    return new Node( {
        children: [
          new Path(
            new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ),
            {
              stroke: SolarSystemCommonColors.orbitColorProperty,
              lineWidth: 1
            } ),
          new ShadedSphereNode( 8, {
            mainColor: SolarSystemCommonColors.firstBodyColorProperty,
            x: -focalPoint
          } ),
          new XNode( combineOptions<XNodeOptions>( {
            center: new Vector2( -focalPoint, 0 ),
            scale: FOCI_SCALE,
            lineWidth: 1
          }, KeplersLawsColors.fociColorProperty ) ),
          new XNode( combineOptions<XNodeOptions>( {
            center: new Vector2( focalPoint, 0 ),
            scale: FOCI_SCALE,
            lineWidth: 1
          }, KeplersLawsColors.fociColorProperty ) ),
          planet ?
          new ShadedSphereNode( 3, {
            mainColor: SolarSystemCommonColors.secondBodyColorProperty,
            x: semiMajorAxis
          } ) : new Node()
        ]
      }
    );
  }
}

keplersLaws.register( 'FirstLawScreenIcon', FirstLawScreenIcon );