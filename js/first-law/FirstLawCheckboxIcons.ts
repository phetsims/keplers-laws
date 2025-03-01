// Copyright 2023-2025, University of Colorado Boulder

/**
 *
 * Definition of the First Law Screen Icon: An elliptical orbit with a Sun, the orbiting body, and two foci
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Shape from '../../../kite/js/Shape.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import KeplersLawsColors from '../common/KeplersLawsColors.js';
import keplersLaws from '../keplersLaws.js';

// constants
const ICON_SCALE = 1.2;
const semiMajorAxis = 9;
const semiMinorAxis = 5;
const focalDistance = 5;
const fociRadius = 1.5;

const axisShape = new Shape().moveTo( 0, 0 ).ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 );
axisShape.moveTo( -semiMajorAxis, 0 ).lineTo( semiMajorAxis, 0 );
axisShape.moveTo( 0, -semiMinorAxis ).lineTo( 0, semiMinorAxis );

const createFociPath = () => {
  return new Path( new Shape().circle( -focalDistance, 0, fociRadius ).circle( focalDistance, 0, fociRadius ), {
    fill: KeplersLawsColors.fociColorProperty
  } );
};

export default class FirstLawCheckboxIcons {
  public constructor() {
    // no-op
  }


  public static createFociCheckboxIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path( new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ), {
            stroke: KeplersLawsColors.foregroundProperty
          }
        ),
        createFociPath()
      ]
    } );
  }

  public static createStringCheckboxIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path( new Shape().moveTo( -focalDistance, 0 ).lineTo( 0, -0.9 * semiMinorAxis ).lineTo( focalDistance, 0 ), {
          stroke: KeplersLawsColors.foregroundProperty,
          lineWidth: 1
        } ),
        new Path( new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ), {
            stroke: KeplersLawsColors.foregroundProperty
          }
        ),
        createFociPath()
      ]
    } );
  }

  public static createSemiaxesCheckboxIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path( new Shape().moveTo( semiMajorAxis, 0 ).lineTo( 0, 0 ), {
          stroke: KeplersLawsColors.semiMajorAxisColorProperty
        } ),
        new Path( new Shape().moveTo( 0, -semiMinorAxis ).lineTo( 0, 0 ), {
          stroke: KeplersLawsColors.semiMinorAxisColorProperty
        } ),
        new Path( new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ), {
            stroke: KeplersLawsColors.foregroundProperty
          }
        )
      ]
    } );
  }

  public static createSemiMajorAxisCheckboxIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path(
          axisShape, {
            stroke: KeplersLawsColors.foregroundProperty,
            lineWidth: 1
          } ),
        new Path( new Shape().moveTo( semiMajorAxis, 0 ).lineTo( 0, 0 ), {
          stroke: KeplersLawsColors.semiMajorAxisColorProperty
        } )
      ]
    } );
  }

  public static createEccentricityCheckboxIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path( new Shape().moveTo( semiMajorAxis, 0 ).lineTo( 0, 0 ), {
          stroke: KeplersLawsColors.semiMajorAxisColorProperty
        } ),
        new Path( new Shape().moveTo( -focalDistance, 0 ).lineTo( 0, 0 ), {
          stroke: KeplersLawsColors.focalDistanceColorProperty
        } ),
        new Path( new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ), {
            stroke: KeplersLawsColors.foregroundProperty
          }
        ),
        new Path( new Shape().circle( -focalDistance, 0, fociRadius ), {
          fill: KeplersLawsColors.fociColorProperty
        } )
      ]
    } );
  }

  public static createAxesCheckboxIcon(): Node {

    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path(
          axisShape, {
            stroke: KeplersLawsColors.foregroundProperty,
            lineWidth: 1
          } )
      ]
    } );
  }
}

keplersLaws.register( 'FirstLawCheckboxIcons', FirstLawCheckboxIcons );