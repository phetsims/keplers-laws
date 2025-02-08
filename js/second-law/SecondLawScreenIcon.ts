// Copyright 2023-2025, University of Colorado Boulder

/**
 *
 * Second Law Screen Icon: multiple elliptical segments that represent area filling
 *
 * @author Agustín Vallejo
 */

import Shape from '../../../kite/js/Shape.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import KeplersLawsColors from '../common/KeplersLawsColors.js';
import EllipticalOrbitEngine from '../common/model/EllipticalOrbitEngine.js';
import KeplersLawsScreenIcon, { focalPoint, semiMajorAxis, semiMinorAxis } from '../common/view/KeplersLawsScreenIcon.js';
import keplersLaws from '../keplersLaws.js';

export default class SecondLawScreenIcon extends KeplersLawsScreenIcon {
  public constructor() {
    super( SecondLawScreenIcon.createFullNode() );
  }

  public static createFullNode(): Node {

    const eccentricity = focalPoint / semiMajorAxis;

    const divisionAngles = [
      2.807,
      1.877,
      0,
      -1.877,
      3.475
    ];
    const areas = [];

    const bodyPosition = EllipticalOrbitEngine.staticCreatePolar( semiMajorAxis, eccentricity, divisionAngles[ divisionAngles.length - 2 ] * 0.98 );

    for ( let i = 1; i < divisionAngles.length; i++ ) {
      let startAngle = divisionAngles[ i ];
      let endAngle = i + 1 === divisionAngles.length ? divisionAngles[ 0 ] : divisionAngles[ i + 1 ];

      startAngle = Math.PI - startAngle;
      endAngle = Math.PI - endAngle;

      areas.push(
        new Path(
        new Shape().moveTo( -focalPoint, 0 ).ellipticalArc(
          0, 0, semiMajorAxis, semiMinorAxis, 0, startAngle, endAngle, false
        ).close(),
          {
            fill: KeplersLawsColors.planetColorProperty,
            opacity: ( divisionAngles.length - i + 1 ) / ( divisionAngles.length + 1 )
          }
        )
      );
    }

    return new Node( {
      children: [
        ...areas,
        KeplersLawsScreenIcon.createCommonNode(),
        new ShadedSphereNode( 3, {
          mainColor: KeplersLawsColors.planetColorProperty,
          x: bodyPosition.x + focalPoint,
          y: -bodyPosition.y
        } )
      ]
    } );
  }
}

keplersLaws.register( 'SecondLawScreenIcon', SecondLawScreenIcon );