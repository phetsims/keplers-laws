// Copyright 2023-2024, University of Colorado Boulder

/**
 * Box that shows the length of distances available in the sim:
 *  - d1 and d2: Focal string lengths from the sun and secondary focus to the planet
 *  - R: Distance from the sun to the planet (circular orbit)
 *  - a: Semi-major axis of the ellipse
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LineArrowNode, { LineArrowNodeOptions } from '../../../../scenery-phet/js/LineArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsDerivedStrings from '../KeplersLawsDerivedStrings.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsVisibleProperties from './KeplersLawsVisibleProperties.js';

const FONT = new PhetFont( 24 );

// Options for the 'd1' and 'd2' labels, or 'R' for circular orbits
export const DISTANCE_LABEL_OPTIONS = {
  font: FONT,
  fill: KeplersLawsColors.distancesColorProperty,
  maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
};

// Options for the 'd1' and 'd2' arrows, or 'R' for circular orbits
export const DISTANCE_ARROW_OPTIONS: DimensionalArrowNodeOptions = {
  stroke: KeplersLawsColors.distancesColorProperty,
  tailLineDash: [ 10, 2 ]
};

// Options for the 'a' labels
export const MAJOR_AXIS_LABEL_OPTIONS = {
  font: FONT,
  fill: KeplersLawsColors.semiMajorAxisColorProperty,
  maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
};

// Options for the 'a' arrows
export const MAJOR_AXIS_ARROW_OPTIONS: DimensionalArrowNodeOptions = {
  stroke: KeplersLawsColors.semiMajorAxisColorProperty
};

// Note: lineWidth is not supported by LineArrowNode, but it is supported by Path.
// This is a workaround to use the same arrow options in the butts to make it
// look like a DimensionalArrowNode (which is not yet implemented in common code)

export default class DistancesDisplayNode extends VBox {
  public readonly orbit: EllipticalOrbitEngine;

  public constructor(
    model: KeplersLawsModel,
    visibleProperties: KeplersLawsVisibleProperties,
    public modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>
  ) {
    super( {
      isDisposable: false,
      spacing: 10,
      visibleProperty: DerivedProperty.and( [ visibleProperties.stringVisibleProperty, model.engine.allowedOrbitProperty ] )
    } );

    this.orbit = model.engine;

    //   d1    d2
    // |----><-----|
    const d1StringProperty = new DerivedProperty( [
      this.orbit.isCircularProperty,
      KeplersLawsStrings.symbol.RStringProperty,
      KeplersLawsDerivedStrings.d1StringProperty
    ], ( orbitIsCircular, radiusString, distance1String ) =>
      orbitIsCircular ? radiusString : distance1String );
    const d2StringProperty = new DerivedProperty( [
      this.orbit.isCircularProperty,
      KeplersLawsStrings.symbol.RStringProperty,
      KeplersLawsDerivedStrings.d2StringProperty
    ], ( orbitIsCircular, radiusString, distance2String ) =>
      orbitIsCircular ? radiusString : distance2String );
    const d1LabelNode = new RichText( d1StringProperty, DISTANCE_LABEL_OPTIONS );
    const d2LabelNode = new RichText( d2StringProperty, DISTANCE_LABEL_OPTIONS );
    const d1ArrowNode = new DimensionalArrowNode( 0, 0, 1, 0, DISTANCE_ARROW_OPTIONS );
    const d2ArrowNode = new DimensionalArrowNode( 0, 0, 1, 0, DISTANCE_ARROW_OPTIONS );
    const distanceArrowsNode = new HBox( {
      children: [ d1ArrowNode, d2ArrowNode ]
    } );
    const distanceDisplayNode = new Node( {
      children: [ distanceArrowsNode, d1LabelNode, d2LabelNode ]
    } );
    Multilink.multilink( [ d1LabelNode.boundsProperty, d1ArrowNode.boundsProperty ], () => {
      d1LabelNode.centerX = d1ArrowNode.centerX;
      d1LabelNode.bottom = d1ArrowNode.top - 1;
    } );
    Multilink.multilink( [ d2LabelNode.boundsProperty, d2ArrowNode.boundsProperty ], () => {
      d2LabelNode.centerX = d2ArrowNode.centerX;
      d2LabelNode.bottom = d2ArrowNode.top - 1;
    } );

    // |----><-----|
    //    a    a
    const a1LabelNode = new RichText( KeplersLawsStrings.symbol.aStringProperty, MAJOR_AXIS_LABEL_OPTIONS );
    const a2LabelNode = new RichText( KeplersLawsStrings.symbol.aStringProperty, MAJOR_AXIS_LABEL_OPTIONS );
    const a1ArrowNode = new DimensionalArrowNode( 0, 0, 1, 0, MAJOR_AXIS_ARROW_OPTIONS );
    const a2ArrowNode = new DimensionalArrowNode( 0, 0, 1, 0, MAJOR_AXIS_ARROW_OPTIONS );
    const majorAxisArrowsNode = new HBox( {
      visibleProperty: visibleProperties.stringVisibleProperty,
      children: [ a1ArrowNode, a2ArrowNode ]
    } );
    const majorAxisDisplayNode = new Node( {
      children: [ majorAxisArrowsNode, a1LabelNode, a2LabelNode ],
      visibleProperty: visibleProperties.semiaxesVisibleProperty
    } );
    Multilink.multilink( [ a1LabelNode.boundsProperty, a1ArrowNode.boundsProperty ], () => {
      a1LabelNode.centerX = a1ArrowNode.centerX;
      a1LabelNode.top = a1ArrowNode.bottom + 1;
    } );
    Multilink.multilink( [ a2LabelNode.boundsProperty, a2ArrowNode.boundsProperty ], () => {
      a2LabelNode.centerX = a2ArrowNode.centerX;
      a2LabelNode.top = a2ArrowNode.bottom + 1;
    } );

    this.children = [
      distanceDisplayNode,
      majorAxisDisplayNode
    ];

    const updateDisplay = () => {

      // Compute the arrow lengths
      const scale = this.modelViewTransformProperty.value.modelToViewDeltaX( 1 );
      const d1Length = this.orbit.d1 * scale;
      const d2Length = this.orbit.d2 * scale;
      const aLength = this.orbit.a * scale;

      // Update the arrows
      const dx = 3; // reducing the arrow length a bit to get the proper measurable length in screen
      d1ArrowNode.setTailAndTip( 0, 0, d1Length - dx, 0 );
      d2ArrowNode.setTailAndTip( 0, 0, -d2Length + dx, 0 );
      a1ArrowNode.setTailAndTip( 0, 0, aLength - dx, 0 );
      a2ArrowNode.setTailAndTip( 0, 0, -aLength + dx, 0 );
    };

    Multilink.multilink( [
      KeplersLawsStrings.symbol.RStringProperty,
      KeplersLawsDerivedStrings.d1StringProperty,
      KeplersLawsDerivedStrings.d2StringProperty,
      model.zoomScaleProperty
    ], updateDisplay );

    this.orbit.ranEmitter.addListener( updateDisplay );
  }
}

/**
 * DimensionalArrowNode does not yet exist in common code. So as a workaround, we add a vertical line to the
 * origin of a LineArrowNode.
 */

type DimensionalArrowNodeSelfOptions = {
  verticalLineWidth?: number; // lineWidth of the vertical line at the end of the dimensional arrow
  verticalLineHeight?: number; // height of the vertical line at the end of the dimensional arrow
};
type DimensionalArrowNodeOptions = DimensionalArrowNodeSelfOptions &
  PickOptional<LineArrowNodeOptions, 'tailLineDash'> &
  PickRequired<LineArrowNodeOptions, 'stroke'>;

class DimensionalArrowNode extends LineArrowNode {
  public constructor( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: DimensionalArrowNodeOptions ) {

    const options = optionize<DimensionalArrowNodeOptions, DimensionalArrowNodeSelfOptions, LineArrowNodeOptions>()( {

      // DimensionalArrowNodeSelfOptions
      verticalLineWidth: 3,
      verticalLineHeight: 10,

      // LineArrowNodeOptions
      headHeight: 10,
      headWidth: 10,
      headLineWidth: 3,
      tailLineWidth: 3
    }, providedOptions );

    super( tailX, tailY, tipX, tipY, options );

    // Add a vertical line at the origin. The LineArrowNode will grow to the left or right of the origin.
    const verticalLine = new Line( 0, -options.verticalLineHeight / 2, 0, options.verticalLineHeight / 2, {
      lineWidth: options.verticalLineWidth,
      stroke: options.stroke
    } );
    this.addChild( verticalLine );
  }
}

keplersLaws.register( 'DistancesDisplayNode', DistancesDisplayNode );