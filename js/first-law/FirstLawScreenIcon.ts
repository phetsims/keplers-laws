// Copyright 2022-2023, University of Colorado Boulder

/**
 *
 * Definition of the First Law Screen Icon: An elliptical orbit with a Sun, the orbiting body, and two foci
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import keplersLaws from '../keplersLaws.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import { Path, Node } from '../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import { Shape } from '../../../kite/js/imports.js';
import XNode from '../../../scenery-phet/js/XNode.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import Vector2 from '../../../dot/js/Vector2.js';

// constants
const FOCI_SCALE = 0.25;

export default class FirstLawScreenIcon extends ScreenIcon {
  public constructor( scale = 1 ) {

    // Ellipses parameters
    // Big ellipse
    const ellipseSemiMajorAxis = 20;
    const ellipseSemiMinorAxis = 17;

    // calculate focal point
    const bigEllipseFocalPoint = Math.sqrt( ellipseSemiMajorAxis * ellipseSemiMajorAxis - ellipseSemiMinorAxis * ellipseSemiMinorAxis );

    super(
      new Node( {
        scale: scale,
        children: [
          new Path(
            new Shape().ellipse( 0, 0, ellipseSemiMajorAxis, ellipseSemiMinorAxis, 0 ),
            {
              stroke: SolarSystemCommonColors.orbitColorProperty,
              lineWidth: 1
            } ),
          new ShadedSphereNode( 8, {
            mainColor: SolarSystemCommonColors.firstBodyColorProperty,
            x: -bigEllipseFocalPoint
          } ),
          new ShadedSphereNode( 3, {
            mainColor: SolarSystemCommonColors.secondBodyColorProperty,
            x: ellipseSemiMajorAxis
          } ),
          new XNode( {
            center: new Vector2( -bigEllipseFocalPoint, 0 ),
            scale: FOCI_SCALE,
            lineWidth: 1,
            ...KeplersLawsConstants.FOCI_COLOR_OPTIONS
          } ),
          new XNode( {
            center: new Vector2( bigEllipseFocalPoint, 0 ),
            scale: FOCI_SCALE,
            lineWidth: 1,
            ...KeplersLawsConstants.FOCI_COLOR_OPTIONS
          } )
        ]
      } ),
      { fill: SolarSystemCommonColors.backgroundProperty }
    );
  }
}

keplersLaws.register( 'FirstLawScreenIcon', FirstLawScreenIcon );