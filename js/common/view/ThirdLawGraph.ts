// Copyright 2023, University of Colorado Boulder

/**
 * Shows a graph of a vs. T with the data from the orbit
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import { Circle, Node, NodeOptions, Path, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import keplersLaws from '../../keplersLaws.js';
import ThirdLawTextUtils from './ThirdLawTextUtils.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import TargetOrbits from '../model/TargetOrbits.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

const FOREGROUND_COLOR_PROPERTY = SolarSystemCommonColors.foregroundProperty;
const AXIS_LABEL_MAX_WIDTH = 20;

export default class ThirdLawGraph extends Node {

  public constructor( model: KeplersLawsModel, orbit: EllipticalOrbitEngine, providedOptions?: StrictOmit<NodeOptions, 'children'> ) {
    const options = optionize<NodeOptions, EmptySelfOptions>()( {
      isDisposable: false
    }, providedOptions );

    super( options );

    const axisLength = 160;

    const semiMajorAxisToViewPoint = ( semiMajorAxis: number ) => {
      const period = model.engine.thirdLaw( semiMajorAxis );
      const periodPower = model.selectedPeriodPowerProperty.value;
      const axisPower = model.selectedAxisPowerProperty.value;

      return new Vector2(
        axisLength * Math.pow( Utils.linear(
                     0, maxSemiMajorAxis,
                     0, 1,
                     semiMajorAxis ), axisPower ),
        -axisLength * Math.pow( Utils.linear(
                      0, maxPeriod,
                      0, 1,
                      period
                    ), periodPower )
      );
    };

    const xAxis = new ArrowNode( 0, 0, axisLength, 0, {
      fill: FOREGROUND_COLOR_PROPERTY,
      stroke: FOREGROUND_COLOR_PROPERTY,
      tailWidth: 1
    } );
    const yAxis = new ArrowNode( 0, 0, 0, -axisLength, {
      fill: FOREGROUND_COLOR_PROPERTY,
      stroke: FOREGROUND_COLOR_PROPERTY,
      tailWidth: 1
    } );

    const maxSemiMajorAxis = 200;
    const maxPeriod = model.engine.thirdLaw( maxSemiMajorAxis );

    const dataPoint = new Circle( 5, {
      fill: SolarSystemCommonColors.secondBodyColorProperty
    } );
    const targetOrbitPoint = new Circle( 5, {
      fill: KeplersLawsColors.targetOrbitColorProperty,
      x: undefined,
      y: undefined
    } );

    const linePath = new Path( null, {
      stroke: SolarSystemCommonColors.foregroundProperty,
      lineWidth: 2
    } );
    const outOfBoundsArrow = new ArrowNode( 0, 0, 1, 0, {
      stroke: SolarSystemCommonColors.secondBodyColorProperty,
      fill: SolarSystemCommonColors.secondBodyColorProperty,
      lineWidth: 2,
      boundsMethod: 'none',
      visible: false
    } );
    const targetOrbitOutOfBounds = new ArrowNode( 0, 0, 1, 0, {
      stroke: KeplersLawsColors.targetOrbitColorProperty,
      fill: KeplersLawsColors.targetOrbitColorProperty,
      lineWidth: 2,
      boundsMethod: 'none',
      visible: false
    } );

    // a
    const xAxisLabelStringProperty = ThirdLawTextUtils.createPowerStringProperty(
      KeplersLawsStrings.symbols.aStringProperty,
      model.selectedAxisPowerProperty,
      new TinyProperty<boolean>( true )
    );

    // T
    const yAxisLabelStringProperty = ThirdLawTextUtils.createPowerStringProperty(
      KeplersLawsStrings.symbols.TStringProperty,
      model.selectedPeriodPowerProperty,
      new TinyProperty<boolean>( true )
    );

    // Axis labels, dynamically positioned
    const axisLabelOptions = combineOptions<RichTextOptions>( {}, KeplersLawsConstants.AXIS_LABEL_OPTIONS, {
      maxWidth: AXIS_LABEL_MAX_WIDTH
    } );
    const xAxisLabel = new RichText( xAxisLabelStringProperty, axisLabelOptions );
    xAxisLabel.boundsProperty.link( () => {
      xAxisLabel.centerX = axisLength / 2;
      xAxisLabel.top = 5;
    } );
    const yAxisLabel = new RichText( yAxisLabelStringProperty, axisLabelOptions );
    yAxisLabel.boundsProperty.link( () => {
      yAxisLabel.right = -8;
      yAxisLabel.centerY = -axisLength / 2;
    } );

    this.children = [
      xAxis,
      yAxis,
      xAxisLabel,
      yAxisLabel,
      targetOrbitOutOfBounds,
      new Node( {
        children: [ linePath, targetOrbitPoint, dataPoint ],
        clipArea: Shape.bounds( new Bounds2( -50, -axisLength, axisLength, 50 ) )
      } ),
      outOfBoundsArrow
    ];

    let minVisitedAxis: number;
    let maxVisitedAxis: number;

    const orbitUpdated = () => {
      const targetOrbit = model.targetOrbitProperty.value;

      // If there's a selected target orbit and the star's mass is equal to 1 MSun
      if ( targetOrbit !== TargetOrbits.NONE && model.isSolarSystemProperty.value ) {
        const targetOrbitPosition = semiMajorAxisToViewPoint( targetOrbit.semiMajorAxis * 100 );

        // If the target orbit is inside the graph
        if ( targetOrbitPosition.x < axisLength ) {
          targetOrbitPoint.translation = targetOrbitPosition;
          targetOrbitPoint.visible = true;
          targetOrbitOutOfBounds.visible = false;
        }
        else {
          targetOrbitPoint.visible = false;
          const tail = semiMajorAxisToViewPoint( maxSemiMajorAxis - 15 );
          const tip = semiMajorAxisToViewPoint( maxSemiMajorAxis ).minus( tail ).setMagnitude( 20 );
          targetOrbitOutOfBounds.translation = tail;
          targetOrbitOutOfBounds.setTip( tip.x, tip.y );
          targetOrbitOutOfBounds.visible = true;
        }
      }
      else {
        targetOrbitPoint.visible = false;
        targetOrbitOutOfBounds.visible = false;
      }

      const shape = new Shape();

      const pointPosition = semiMajorAxisToViewPoint( orbit.a );
      dataPoint.translation = pointPosition;
      dataPoint.visible = orbit.a < maxSemiMajorAxis;

      const outOfBounds = pointPosition.x > axisLength || pointPosition.y < -axisLength;
      const dx = 5; // Threshold for being out of bounds
      let arrowX = maxSemiMajorAxis / 2; // X position of the out of bounds arrow
      let arrowPositionSet = false; // Whether the out of bounds arrow position has been set or is the default

      if ( !outOfBounds ) {
        if ( !model.sun.userControlledMassProperty.value || minVisitedAxis !== maxVisitedAxis ) {
          if ( orbit.a < minVisitedAxis ) {
            minVisitedAxis = orbit.a;
          }

          if ( orbit.a > maxVisitedAxis ) {
            maxVisitedAxis = orbit.a;
          }
        }
        else {
          minVisitedAxis = orbit.a;
          maxVisitedAxis = orbit.a;
        }
      }

      // a is the semiMajor axis
      for ( let a = minVisitedAxis; a <= maxVisitedAxis; a += 1 ) {
        const pointToDraw = semiMajorAxisToViewPoint( a );
        shape.lineToPoint( pointToDraw );

        if ( minVisitedAxis < maxSemiMajorAxis - dx && !arrowPositionSet ) {
          if ( !arrowPositionSet && outOfBounds && pointToDraw.y < -axisLength + dx ) {
            arrowX = a;
            arrowPositionSet = true;
          }
          else if ( !arrowPositionSet && outOfBounds && pointToDraw.x > axisLength - dx ) {
            arrowX = a;
            arrowPositionSet = true;
          }
        }
      }
      shape.makeImmutable();

      linePath.shape = shape;

      if ( arrowPositionSet ) {
        const tail = semiMajorAxisToViewPoint( arrowX );
        const tip = semiMajorAxisToViewPoint( arrowX + 15 ).minus( tail ).setMagnitude( 20 );
        outOfBoundsArrow.translation = tail;
        outOfBoundsArrow.setTip( tip.x, tip.y );
      }
      else {
        outOfBoundsArrow.translation = new Vector2( axisLength / 2, -axisLength / 2 );
        outOfBoundsArrow.setTip( 14, -14 ); // Components for having magnitude 20
      }
      outOfBoundsArrow.visible = outOfBounds;
    };

    const resetAxisBoundaries = () => {
      minVisitedAxis = orbit.a;
      maxVisitedAxis = orbit.a;

      // Calling the draw function again to update (delete) the line
      orbitUpdated();
    };

    resetAxisBoundaries();

    Multilink.multilink(
      [
        model.selectedAxisPowerProperty,
        model.selectedPeriodPowerProperty,
        model.targetOrbitProperty
      ], orbitUpdated );

    orbit.changedEmitter.addListener( orbitUpdated );
    orbit.resetEmitter.addListener( resetAxisBoundaries );
  }
}

keplersLaws.register( 'ThirdLawGraph', ThirdLawGraph );