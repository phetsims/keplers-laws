// Copyright 2023, University of Colorado Boulder

/**
 * Shows a graph of a vs. T with the data from the orbit
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { Circle, Node, NodeOptions, Path, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SolarSystemCommonTextNumberDisplay from '../../../../solar-system-common/js/view/SolarSystemCommonTextNumberDisplay.js';
import MySolarSystemStrings from '../../../../my-solar-system/js/MySolarSystemStrings.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import keplersLaws from '../../keplersLaws.js';

const FOREGROUND_COLOR_PROPERTY = SolarSystemCommonColors.foregroundProperty;

export default class ThirdLawGraph extends Node {
  public constructor( model: KeplersLawsModel, orbit: EllipticalOrbitEngine, providedOptions?: NodeOptions ) {
    super( providedOptions );

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
      fill: 'fuchsia'
    } );

    const linePath = new Path( null, {
      stroke: FOREGROUND_COLOR_PROPERTY
    } );

    const xAxisLabelStringProperty = SolarSystemCommonTextNumberDisplay.combinePowerString(
      MySolarSystemStrings.symbols.semiMajorAxisStringProperty,
      model.selectedAxisPowerProperty
    );

    const yAxisLabelStringProperty = SolarSystemCommonTextNumberDisplay.combinePowerString(
      MySolarSystemStrings.symbols.periodStringProperty,
      model.selectedPeriodPowerProperty
    );

    const xAxisLabel = new RichText(
      xAxisLabelStringProperty,
      combineOptions<RichTextOptions>( {
        x: axisLength * 0.4, y: 25
      }, SolarSystemCommonConstants.TITLE_OPTIONS ) );
    const yAxisLabel = new RichText(
      yAxisLabelStringProperty,
      combineOptions<RichTextOptions>( {
        x: -25, y: -axisLength * 0.4
      }, SolarSystemCommonConstants.TITLE_OPTIONS ) );

    this.children = [
      xAxis,
      yAxis,
      xAxisLabel,
      yAxisLabel,
      new Node( {
        children: [ linePath, dataPoint ],
        clipArea: Shape.bounds( new Bounds2( 0, -axisLength, axisLength, 0 ) )
      } )
    ];

    const orbitUpdated = () => {
      dataPoint.translation = semiMajorAxisToViewPoint( orbit.a );
      dataPoint.visible = orbit.a < maxSemiMajorAxis;
    };

    Multilink.multilink(
      [
        model.selectedAxisPowerProperty,
        model.selectedPeriodPowerProperty,
        model.engine.sunMassProperty
      ], () => {
      orbitUpdated();

      const shape = new Shape().moveTo( 0, 0 );
      for ( let axis = 0; axis <= maxSemiMajorAxis; axis += maxSemiMajorAxis / 100 ) {
        shape.lineToPoint( semiMajorAxisToViewPoint( axis ) );
      }
      shape.makeImmutable();

      linePath.shape = shape;
    } );

    orbit.changedEmitter.addListener( orbitUpdated );
  }
}

keplersLaws.register( 'ThirdLawGraph', ThirdLawGraph );