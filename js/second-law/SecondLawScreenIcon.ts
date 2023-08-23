// Copyright 2023, University of Colorado Boulder

/**
 *
 * Second Law Screen Icon: multiple elliptical segments that represent area filling
 *
 * @author Agustín Vallejo
 */

import { Node, Path } from '../../../scenery/js/imports.js';
import { Shape } from '../../../kite/js/imports.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import keplersLaws from '../keplersLaws.js';
import KeplersLawsScreenIcon, { semiMajorAxis, semiMinorAxis, focalPoint } from '../common/view/KeplersLawsScreenIcon.js';
import EllipticalOrbitEngine from '../common/model/EllipticalOrbitEngine.js';

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
            fill: SolarSystemCommonColors.secondBodyColorProperty,
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
          mainColor: SolarSystemCommonColors.secondBodyColorProperty,
          x: bodyPosition.x + focalPoint,
          y: -bodyPosition.y
        } )
      ]
    } );
  }
}

keplersLaws.register( 'SecondLawScreenIcon', SecondLawScreenIcon );