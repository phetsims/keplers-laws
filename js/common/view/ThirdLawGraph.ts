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
import KeplersLawsConstants from '../../KeplersLawsConstants.js';
import TargetOrbits from '../model/TargetOrbits.js';

const FOREGROUND_COLOR_PROPERTY = SolarSystemCommonColors.foregroundProperty;

export default class ThirdLawGraph extends Node {
  public constructor( model: KeplersLawsModel, orbit: EllipticalOrbitEngine, providedOptions?: NodeOptions ) {
    const options = optionize<NodeOptions, EmptySelfOptions>()( {}, providedOptions );

    super( options );

    const axisLength = 120;

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

    const maxSemiMajorAxis = 500;
    const maxPeriod = model.engine.thirdLaw( maxSemiMajorAxis );

    const dataPoint = new Circle( 5, {
      fill: SolarSystemCommonColors.secondBodyColorProperty
    } );
    const targetOrbitPoint = new Circle( 5, {
      fill: 'gray'
    } );

    const linePath = new Path( null, {
      stroke: SolarSystemCommonColors.foregroundProperty,
      lineWidth: 2
    } );
    const outOfBoundsArrow = new ArrowNode( 0, 0, 1, 0, {
      stroke: SolarSystemCommonColors.secondBodyColorProperty,
      fill: SolarSystemCommonColors.secondBodyColorProperty,
      lineWidth: 2,
      boundsMethod: 'none'
    } );
    const targetOrbitOutOfBounds = new ArrowNode( 0, 0, 1, 0, {
      stroke: 'gray',
      fill: 'gray',
      lineWidth: 2,
      boundsMethod: 'none'
    } );

    const xAxisLabelStringProperty = ThirdLawTextUtils.createPowerStringProperty(
      KeplersLawsStrings.symbols.semiMajorAxisStringProperty,
      model.selectedAxisPowerProperty,
      new TinyProperty<boolean>( true )
    );

    const yAxisLabelStringProperty = ThirdLawTextUtils.createPowerStringProperty(
      KeplersLawsStrings.symbols.periodStringProperty,
      model.selectedPeriodPowerProperty,
      new TinyProperty<boolean>( true )
    );

    const xAxisLabel = new RichText(
      xAxisLabelStringProperty,
      combineOptions<RichTextOptions>( {
        x: axisLength * 0.4, y: 25
      }, KeplersLawsConstants.TITLE_OPTIONS ) );
    const yAxisLabel = new RichText(
      yAxisLabelStringProperty,
      combineOptions<RichTextOptions>( {
        x: -25, y: -axisLength * 0.4
      }, KeplersLawsConstants.TITLE_OPTIONS ) );

    this.children = [
      xAxis,
      yAxis,
      xAxisLabel,
      yAxisLabel,
      targetOrbitOutOfBounds,
      new Node( {
        children: [ linePath, dataPoint, targetOrbitPoint ],
        clipArea: Shape.bounds( new Bounds2( -50, -axisLength, axisLength, 50 ) )
      } ),
      outOfBoundsArrow
    ];

    let minVisitedAxis: number;
    let maxVisitedAxis: number;

    const orbitUpdated = () => {
      const pointPosition = semiMajorAxisToViewPoint( orbit.a );
      dataPoint.translation = pointPosition;
      dataPoint.visible = orbit.a < maxSemiMajorAxis;

      const targetOrbit = model.targetOrbitProperty.value;
      if ( targetOrbit !== TargetOrbits.NONE ) {
        const targetOrbitPosition = semiMajorAxisToViewPoint( targetOrbit.semiMajorAxis * 100 );
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
      }

      if ( !model.bodies[ 0 ].userControlledMassProperty.value || minVisitedAxis !== maxVisitedAxis ) {
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

      const shape = new Shape();

      const outOfBounds = pointPosition.x > axisLength || pointPosition.y < -axisLength;
      let arrowX = null;
      const dx = 5;

      // a is the semimajor axis
      for ( let a = minVisitedAxis; a <= maxVisitedAxis; a += 5 ) {
        const pointToDraw = semiMajorAxisToViewPoint( a );
        shape.lineToPoint( pointToDraw );

        if ( !arrowX && outOfBounds && pointToDraw.y < -axisLength + dx ) {
          arrowX = a;
        }
        else if ( !arrowX && outOfBounds && pointToDraw.x > axisLength - dx ) {
          arrowX = a;
        }
      }
      shape.makeImmutable();

      linePath.shape = shape;

      if ( outOfBounds && arrowX ) {
        const tail = semiMajorAxisToViewPoint( arrowX );
        const tip = semiMajorAxisToViewPoint( arrowX + 15 ).minus( tail ).setMagnitude( 20 );
        outOfBoundsArrow.translation = tail;
        outOfBoundsArrow.setTip( tip.x, tip.y );
        outOfBoundsArrow.visible = true;
      }
      else {
        outOfBoundsArrow.visible = false;
      }
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