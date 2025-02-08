// Copyright 2023-2025, University of Colorado Boulder

/**
 * Shows a graph of a vs. T with the data from the orbit
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import TargetOrbit from '../model/TargetOrbit.js';
import ThirdLawTextUtils from './ThirdLawTextUtils.js';

const FOREGROUND_COLOR_PROPERTY = SolarSystemCommonColors.foregroundProperty;
const AXIS_LABEL_MAX_WIDTH = 20;

export default class ThirdLawGraph extends Node {

  public constructor( model: KeplersLawsModel, orbit: EllipticalOrbitEngine, providedOptions?: StrictOmit<NodeOptions, 'children'> ) {
    const options = optionize<NodeOptions, EmptySelfOptions>()( {
      isDisposable: false
    }, providedOptions );

    super( options );

    const axisLength = 160;

    const maxSemiMajorAxis = 2;
    const maxPeriod = model.engine.thirdLaw( maxSemiMajorAxis );

    const semiMajorAxisToViewPoint = ( semiMajorAxis: number ) => {
      const period = model.engine.thirdLaw( semiMajorAxis );
      const periodPower = model.selectedPeriodPowerProperty.value;
      const axisPower = model.selectedAxisPowerProperty.value;

      const viewPoint = new Vector2(
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
      assert && assert( viewPoint.isFinite(), `should be a finite position given axis: ${semiMajorAxis}` );
      return viewPoint;
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

    const dataPoint = new Circle( 5, {
      fill: KeplersLawsColors.planetColorProperty
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
      stroke: KeplersLawsColors.planetColorProperty,
      fill: KeplersLawsColors.planetColorProperty,
      lineWidth: 2,
      visible: false
    } );
    const targetOrbitOutOfBounds = new ArrowNode( 0, 0, 1, 0, {
      stroke: KeplersLawsColors.targetOrbitColorProperty,
      fill: KeplersLawsColors.targetOrbitColorProperty,
      lineWidth: 2,
      visible: false
    } );

    // a
    const xAxisLabelStringProperty = ThirdLawTextUtils.createPowerStringProperty(
      KeplersLawsStrings.symbol.aStringProperty,
      model.selectedAxisPowerProperty,
      new TinyProperty<boolean>( true )
    );

    // T
    const yAxisLabelStringProperty = ThirdLawTextUtils.createPowerStringProperty(
      KeplersLawsStrings.symbol.TStringProperty,
      model.selectedPeriodPowerProperty,
      new TinyProperty<boolean>( true )
    );

    // Axis labels, dynamically positioned
    const axisLabelOptions = combineOptions<RichTextOptions>( {}, KeplersLawsConstants.AXIS_LABEL_OPTIONS, {
      maxWidth: AXIS_LABEL_MAX_WIDTH
    } );
    const xAxisLabel = new AlignBox( new RichText( xAxisLabelStringProperty, axisLabelOptions ), {
      // Keeps the size effectively constant, so that ThirdLawAccordionBox does not resize as the equation change.
      // Value determined empirically. See https://github.com/phetsims/keplers-laws/issues/151
      preferredSize: new Dimension2( 25, 20 )
    } );
    xAxisLabel.boundsProperty.link( () => {
      xAxisLabel.centerX = axisLength / 2;
      xAxisLabel.top = 5;
    } );
    const yAxisLabel = new AlignBox( new RichText( yAxisLabelStringProperty, axisLabelOptions ), {
      // Keeps the size effectively constant, so that ThirdLawAccordionBox does not resize as the equation change.
      // Value determined empirically. See https://github.com/phetsims/keplers-laws/issues/151
      preferredSize: new Dimension2( 17, 20 )
    } );
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

    const minVisitedAxisProperty = new NumberProperty( 0, {
      tandem: options.tandem?.createTandem( 'minVisitedAxisProperty' ),
      phetioReadOnly: true
    } );
    const maxVisitedAxisProperty = new NumberProperty( 0, {
      tandem: options.tandem?.createTandem( 'maxVisitedAxisProperty' ),
      phetioReadOnly: true
    } );

    const orbitUpdated = () => {
      const targetOrbit = model.targetOrbitProperty.value;
      const boundsPadding = 20; // Threshold for the out-of-bounds arrow

      // If there's a selected target orbit and the star's mass is equal to 1 MSun
      if ( targetOrbit !== TargetOrbit.NONE && model.isSolarSystemProperty.value ) {
        const targetOrbitPosition = semiMajorAxisToViewPoint( targetOrbit.semiMajorAxis );

        // If the target orbit is inside the graph
        if ( targetOrbitPosition.x < axisLength ) {
          targetOrbitPoint.translation = targetOrbitPosition;
          targetOrbitPoint.visible = true;
          targetOrbitOutOfBounds.visible = false;
        }
        else {
          targetOrbitPoint.visible = false;
          const tail = semiMajorAxisToViewPoint( maxSemiMajorAxis - 0.2 );
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

      // Enlarge the target orbit marker if it's close to the current orbit
      targetOrbitPoint.radius = ( Math.abs( pointPosition.x - targetOrbitPoint.translation.x ) < 1 ) ? 8 : 5;

      const outOfBounds = pointPosition.x > axisLength - boundsPadding || pointPosition.y < -axisLength + boundsPadding;
      dataPoint.visible = !outOfBounds;
      let arrowX = maxSemiMajorAxis / 2; // X position of the out-of-bounds arrow
      let arrowPositionSet = false; // Whether the out-of-bounds arrow position has been set or is the default

      // Updates the limits of the graph line if the orbit is not out of bounds
      if ( !outOfBounds ) {
        if ( orbit.a < minVisitedAxisProperty.value ) {
          minVisitedAxisProperty.value = orbit.a;
        }

        if ( orbit.a > maxVisitedAxisProperty.value ) {
          maxVisitedAxisProperty.value = orbit.a;
        }
      }

      // Draw a line between the minimum and maximum visited axis
      if ( minVisitedAxisProperty.value !== maxVisitedAxisProperty.value ) {
        for ( let a = minVisitedAxisProperty.value; a <= maxVisitedAxisProperty.value; a += 0.01 ) {
          const pointToDraw = semiMajorAxisToViewPoint( a );

          // If the point is out of bounds and the arrow position has not been set, set it
          if ( pointToDraw.x < axisLength - boundsPadding && pointToDraw.y > -axisLength + boundsPadding ) {
            shape.lineToPoint( pointToDraw );
            if ( outOfBounds ) {
              arrowX = a;
              arrowPositionSet = true;
            }
          }
        }
      }
      shape.makeImmutable();

      linePath.shape = shape;

      if ( arrowPositionSet ) {
        const tail = semiMajorAxisToViewPoint( arrowX );
        const tip = semiMajorAxisToViewPoint( arrowX + 0.2 ).minus( tail ).setMagnitude( 20 );
        outOfBoundsArrow.translation = tail;
        outOfBoundsArrow.setTip( tip.x, tip.y );
      }
      else {
        outOfBoundsArrow.translation = new Vector2( axisLength / 2, -axisLength / 2 );
        outOfBoundsArrow.setTip( 14, -14 ); // Components for having magnitude 20
      }
      outOfBoundsArrow.visible = outOfBounds;
    };

    const resetGraph = () => {
      minVisitedAxisProperty.value = orbit.a;
      maxVisitedAxisProperty.value = orbit.a;

      // Calling the draw function again to update (delete) the line
      orbitUpdated();
    };

    resetGraph();

    Multilink.multilink(
      [
        model.selectedAxisPowerProperty,
        model.selectedPeriodPowerProperty,
        model.targetOrbitProperty,
        minVisitedAxisProperty,
        maxVisitedAxisProperty
      ], orbitUpdated );

    orbit.changedEmitter.addListener( orbitUpdated );
    orbit.resetEmitter.addListener( resetGraph );
  }
}

keplersLaws.register( 'ThirdLawGraph', ThirdLawGraph );