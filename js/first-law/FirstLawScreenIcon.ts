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
import XNode from '../../../scenery-phet/js/XNode.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import Vector2 from '../../../dot/js/Vector2.js';
import KeplersLawsScreenIcon, { semiMajorAxis, semiMinorAxis, focalPoint } from '../keplers-laws/view/KeplersLawsScreenIcon.js';

// constants
const FOCI_SCALE = 0.25;

export default class FirstLawScreenIcon extends KeplersLawsScreenIcon {
  public constructor() {
    const constructedNode = FirstLawScreenIcon.getFullNode();
    super( constructedNode );
  }

  public static getFullNode(): Node {
    return new Node( {
      children: [
        KeplersLawsScreenIcon.getCommonNode(),
        FirstLawScreenIcon.getFirstLawNode()
      ]
    } );
  }

  public static getFirstLawNode(): Node {
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
          new ShadedSphereNode( 3, {
            mainColor: SolarSystemCommonColors.secondBodyColorProperty,
            x: semiMajorAxis
          } ),
          new XNode( {
            center: new Vector2( -focalPoint, 0 ),
            scale: FOCI_SCALE,
            lineWidth: 1,
            ...KeplersLawsConstants.FOCI_COLOR_OPTIONS
          } ),
          new XNode( {
            center: new Vector2( focalPoint, 0 ),
            scale: FOCI_SCALE,
            lineWidth: 1,
            ...KeplersLawsConstants.FOCI_COLOR_OPTIONS
          } )
        ]
      }
    );
  }
}

keplersLaws.register( 'FirstLawScreenIcon', FirstLawScreenIcon );