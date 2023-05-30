// Copyright 2023, University of Colorado Boulder

/**
 *
 * Definition of the First Law Screen Icon: An elliptical orbit with a Sun, the orbiting body, and two foci
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import keplersLaws from '../keplersLaws.js';
import { Path, Node } from '../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import { Shape } from '../../../kite/js/imports.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';

// constants
const ICON_SCALE = 1.2;
const semiMajorAxis = 9;
const semiMinorAxis = 5;
const focalDistance = 5;
const fociRadius = 1.5;

export default class FirstLawCheckboxIcons {
  public constructor() {
    // no-op
  }

  public static getFociIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path( new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ), {
            stroke: SolarSystemCommonColors.foregroundProperty
          }
        ),
        new Path( new Shape().circle( -focalDistance, 0, fociRadius ).circle( focalDistance, 0, fociRadius ), {
          fill: KeplersLawsConstants.FOCI_COLOR_OPTIONS.fill
        } )
      ]
    } );
  }

  public static getStringsIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path( new Shape().moveTo( -focalDistance, 0 ).lineTo( 0, -0.9 * semiMinorAxis ).lineTo( focalDistance, 0 ), {
          stroke: SolarSystemCommonColors.foregroundProperty,
          lineWidth: 1
        } ),
        new Path( new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ), {
            stroke: SolarSystemCommonColors.foregroundProperty
          }
        ),
        new Path( new Shape().circle( -focalDistance, 0, fociRadius ).circle( focalDistance, 0, fociRadius ), {
          fill: KeplersLawsConstants.FOCI_COLOR_OPTIONS.fill
        } )
      ]
    } );
  }

  public static getSemiaxesIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path( new Shape().moveTo( 0, -semiMinorAxis ).lineTo( 0, 0 ).lineTo( semiMajorAxis, 0 ), {
          stroke: KeplersLawsConstants.AXES_COLOR
        } ),
        new Path( new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ), {
            stroke: SolarSystemCommonColors.foregroundProperty
          }
        )
      ]
    } );
  }

  public static getEccentricityIcon(): Node {
    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path( new Shape().moveTo( semiMajorAxis, 0 ).lineTo( 0, 0 ), {
          stroke: KeplersLawsConstants.AXES_COLOR
        } ),
        new Path( new Shape().moveTo( -focalDistance, 0 ).lineTo( 0, 0 ), {
          stroke: SolarSystemCommonColors.thirdBodyColorProperty
        } ),
        new Path( new Shape().ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 ), {
            stroke: SolarSystemCommonColors.foregroundProperty
          }
        ),
        new Path( new Shape().circle( -focalDistance, 0, fociRadius ), {
          fill: KeplersLawsConstants.FOCI_COLOR_OPTIONS.fill
        } )
      ]
    } );
  }

  public static getAxisIcon(): Node {
    const axisShape = new Shape().moveTo( 0, 0 ).ellipse( 0, 0, semiMajorAxis, semiMinorAxis, 0 );
    axisShape.moveTo( -semiMajorAxis, 0 ).lineTo( semiMajorAxis, 0 );
    axisShape.moveTo( 0, -semiMinorAxis ).lineTo( 0, semiMinorAxis );

    return new Node( {
      scale: ICON_SCALE,
      children: [
        new Path(
          axisShape, {
            stroke: SolarSystemCommonColors.foregroundProperty,
            lineWidth: 1
          } )
      ]
    } );
  }
}

keplersLaws.register( 'FirstLawCheckboxIcons', FirstLawCheckboxIcons );