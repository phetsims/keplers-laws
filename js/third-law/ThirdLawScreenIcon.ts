// Copyright 2023, University of Colorado Boulder

/**
 *
 * Definition of the Third Law Screen Icon: An elliptical orbit with a Sun, the orbiting body, the semiMajor axis, and a timer
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { Shape } from '../../../kite/js/imports.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import { Node, Path, Text } from '../../../scenery/js/imports.js';
import KeplersLawsColors from '../common/KeplersLawsColors.js';
import KeplersLawsScreenIcon, { focalPoint, semiMajorAxis, semiMinorAxis } from '../common/view/KeplersLawsScreenIcon.js';
import keplersLaws from '../keplersLaws.js';

export default class ThirdLawScreenIcon extends KeplersLawsScreenIcon {
  public constructor() {
    super( ThirdLawScreenIcon.createFullNode() );
  }

  public static createFullNode(): Node {
    return new Node( {
      children: [
        KeplersLawsScreenIcon.createCommonNode(),
        ThirdLawScreenIcon.createThirdLawNode()
      ]
    } );
  }

  public static createThirdLawNode( showPlanet = true ): Node {
    return new Node( {
        children: [
          new Path(
            new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ),
            {
              stroke: KeplersLawsColors.orbitColorProperty,
              lineWidth: 1
            } ),
          new ShadedSphereNode( 8, {
            mainColor: KeplersLawsColors.sunColorProperty,
            x: -focalPoint
          } ),
          new Path(
            new Shape().moveTo( 0, 0 ).lineTo( semiMajorAxis, 0 ), {
              stroke: KeplersLawsColors.semiMajorAxisColorProperty,
              lineWidth: 1
            }
          ),
          ThirdLawScreenIcon.createPeriodTimerNode(),
          showPlanet ?
          new ShadedSphereNode( 3, {
            mainColor: KeplersLawsColors.planetColorProperty,
            x: semiMajorAxis
          } ) : new Node()
        ]
      }
    );
  }

  public static createPeriodTimerNode(): Node {
    const timerWidth = 50;
    const timerHeight = 20;
    const screenWidth = 40;
    const screenHeight = 15;
    const screenX = ( timerWidth - screenWidth ) / 2;
    const screenY = ( timerHeight - screenHeight ) / 2;

    return new Node( {
      scale: 0.5,
      y: -15,
      x: 5,
      children: [
        new Path(
          new Shape().roundRect( 0, 0, timerWidth, timerHeight, 5, 5 ), {
            fill: '#ffe75e',
            stroke: 'black'
          }
        ),
        new Path(
          new Shape().roundRect( screenX, screenY, screenWidth, screenHeight, 3, 3 ), {
            fill: 'white',
            stroke: 'black',
            lineWidth: 1
          }
        ),
        new Text( '0:00', {
          fill: 'black',
          scale: 1.2,
          centerX: timerWidth / 2,
          centerY: timerHeight / 2
        } )
      ]
    } );
  }
}

keplersLaws.register( 'ThirdLawScreenIcon', ThirdLawScreenIcon );