// Copyright 2023, University of Colorado Boulder

/**
 * FirstLawGraph graphs the Eccentricity of the orbit, compared to other orbits of the Solar System.
 *
 * @author Agustín Vallejo
 */

import { AlignBox, AlignBoxOptions, HBox, Node, Path, Text, TextOptions } from '../../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import Range from '../../../../dot/js/Range.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import { Shape } from '../../../../kite/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import TargetOrbits from '../model/TargetOrbits.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const FOREGROUND_COLOR_PROPERTY = SolarSystemCommonColors.foregroundProperty;

const MODEL_Y_RANGE = new Range( 0, 1 );
const Y_AXIS_LENGTH = 180;

export default class FirstLawGraph extends AlignBox {

  public constructor( eccentricityProperty: TReadOnlyProperty<number> ) {

    const options: AlignBoxOptions = {
      layoutOptions: {
        align: 'center'
      }
    };

    const yAxis = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, Y_AXIS_LENGTH ), {
      fill: FOREGROUND_COLOR_PROPERTY,
      stroke: FOREGROUND_COLOR_PROPERTY
    } );

    const orbitAndValues: HBox[] = [];

    const shownEccentricities = [
      TargetOrbits.MERCURY,
      TargetOrbits.EARTH,
      TargetOrbits.ERIS,
      TargetOrbits.NEREID,
      TargetOrbits.HALLEY
    ];

    shownEccentricities.forEach( ( exampleOrbit: TargetOrbits ) => {
      const orbitNameProperty = exampleOrbit.stringProperty;
      const eccentricity = exampleOrbit.eccentricity;
      const orbitNameText = new Text( orbitNameProperty, combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        maxWidth: 120
      } ) );
      const content = new HBox( {
        centerY: Y_AXIS_LENGTH * eccentricity,
        spacing: 5,
        children: [
          orbitNameText,
          new ArrowNode( 0, 0, 20, 0, { stroke: FOREGROUND_COLOR_PROPERTY, fill: FOREGROUND_COLOR_PROPERTY, tailWidth: 1 } )
        ]
      } );
      orbitAndValues.push( content );

      orbitNameText.boundsProperty.link( () => {
        content.x = -orbitNameText.width - 30;
      } );
    } );

    const currentEccentricityNode = new HBox( {
      x: 10,
      children: [
        new ArrowNode( 0, 0, -20, 0, { stroke: 'fuchsia', fill: 'fuchsia', tailWidth: 1 } ),
        new NumberDisplay( eccentricityProperty, MODEL_Y_RANGE, {
          decimalPlaces: 2,
          textOptions: combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
            fill: 'fuchsia'
          } ),
          backgroundFill: null,
          backgroundStroke: null
        } )
      ]
    } );

    const currentEccentricityContainer = new Node( {
      children: [ currentEccentricityNode ],
      localBounds: new Bounds2( currentEccentricityNode.left, 0, currentEccentricityNode.right, Y_AXIS_LENGTH )
    } );

    eccentricityProperty.link( ( eccentricity: number ) => {
      currentEccentricityNode.centerY = Y_AXIS_LENGTH * eccentricity;
    } );

    const chartTransform = new ChartTransform( {
      viewHeight: Y_AXIS_LENGTH,
      modelYRange: MODEL_Y_RANGE
    } );

    // y tick marks
    const YSpacing = 0.1;
    const YTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, YSpacing, {
      edge: 'min',
      stroke: SolarSystemCommonColors.foregroundProperty
    } );

    const content = new Node( {
      isDisposable: false,
      children: [
        ...orbitAndValues,
        yAxis,
        YTickMarkSet,
        currentEccentricityContainer
      ]
    } );

    super( content, options );
  }
}

keplersLaws.register( 'FirstLawGraph', FirstLawGraph );