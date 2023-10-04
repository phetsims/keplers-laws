// Copyright 2023, University of Colorado Boulder

/**
 *
 * Definition of the First Law Screen Icon: An elliptical orbit with a Sun, the orbiting body, and two foci
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import keplersLaws from '../keplersLaws.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import { Node } from '../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import XNode from '../../../scenery-phet/js/XNode.js';
import Vector2 from '../../../dot/js/Vector2.js';
import KeplersLawsScreenIcon, { focalPoint, semiMajorAxis } from '../common/view/KeplersLawsScreenIcon.js';
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

  public static createFirstLawNode( showPlanet = true ): Node {
    return new Node( {
        children: [
          new ShadedSphereNode( 8, {
            mainColor: SolarSystemCommonColors.body1ColorProperty,
            x: -focalPoint
          } ),
          new XNode( {
            center: new Vector2( -focalPoint, 0 ),
            scale: FOCI_SCALE,
            lineWidth: 1,
            fill: KeplersLawsColors.fociColorProperty,
            stroke: 'black'
          } ),
          new XNode( {
            center: new Vector2( focalPoint, 0 ),
            scale: FOCI_SCALE,
            lineWidth: 1,
            fill: KeplersLawsColors.fociColorProperty,
            stroke: 'black'
          } ),
          showPlanet ?
          new ShadedSphereNode( 3, {
            mainColor: SolarSystemCommonColors.body2ColorProperty,
            x: semiMajorAxis
          } ) : new Node()
        ]
      }
    );
  }
}

keplersLaws.register( 'FirstLawScreenIcon', FirstLawScreenIcon );