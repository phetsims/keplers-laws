// Copyright 2023, University of Colorado Boulder

/**
 * Box that shows the length of distances available in the sim:
 *  - d1 and d2: Focal strings' lengths from the sun and secondary focus to the planet
 *  - R: Distance from the sun to the planet (circular orbit)
 *  - a: Semimajor axis of the ellipse
 *
 * @author Agustín Vallejo
 */

import { HBox, Node, Path, RichText, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import LineArrowNode from '../../../../scenery-phet/js/LineArrowNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import keplersLaws from '../../keplersLaws.js';
import Multilink from '../../../../axon/js/Multilink.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsColors from '../KeplersLawsColors.js';

// Initial length of display arrows
const INITIAL_ARROW_LENGTH = 5;
const SYMBOL_MAX_WIDTH = 20;

// Options for the 'd1' and 'd2' labels
export const DISTANCE_LABEL_OPTIONS = combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
  scale: 1.5,
  stroke: KeplersLawsColors.distancesColorProperty,
  fill: KeplersLawsColors.distancesColorProperty,
  maxWidth: SYMBOL_MAX_WIDTH
} );

// Options for the 'd1' and 'd2' arrows
export const DISTANCE_ARROW_OPTIONS = {
  stroke: '#ccb285',
  headHeight: 10,
  headWidth: 10,
  headLineWidth: 3,
  tailLineWidth: 3,
  tailLineDash: [ 10, 2 ],
  lineWidth: 3 // See note below
};

// Options for the 'a' labels
export const MAJOR_AXIS_LABEL_OPTIONS = combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
  scale: 1.5,
  stroke: KeplersLawsColors.semiMajorAxisColorProperty,
  fill: KeplersLawsColors.semiMajorAxisColorProperty,
  maxWidth: SYMBOL_MAX_WIDTH
} );

// Options for the 'a' arrows
export const MAJOR_AXIS_ARROW_OPTIONS = {
  stroke: KeplersLawsColors.semiMajorAxisColorProperty,
  fill: KeplersLawsColors.semiMajorAxisColorProperty,
  headHeight: 10,
  headWidth: 10,
  headLineWidth: 3,
  tailLineWidth: 3,
  lineWidth: 3 // See note below
};

// Note: lineWidth is not supported by LineArrowNode, but it is supported by Path.
// This is a workaround to use the same arrow options in the butts to make it
// look like a DimensionalArrowNode (which is not yet implemented in common code)

export default class DistancesDisplayNode extends VBox {
  public orbit: EllipticalOrbitEngine;

  public constructor(
    model: Pick<KeplersLawsModel, 'engine' | 'stringsVisibleProperty' | 'semiaxisVisibleProperty' | 'zoomProperty'>,
    public modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>
  ) {
    super( {
      isDisposable: false,
      spacing: 10,
      visibleProperty: DerivedProperty.and( [ model.stringsVisibleProperty, model.engine.allowedOrbitProperty ] )
    } );

    this.orbit = model.engine;

    //   d1    d2
    // |----><-----|
    const d1LabelNode = new RichText( '', DISTANCE_LABEL_OPTIONS );
    const d2LabelNode = new RichText( '', DISTANCE_LABEL_OPTIONS );
    const d1ArrowNode = new LineArrowNode( 0, 0, 1, 0, DISTANCE_ARROW_OPTIONS );
    const d2ArrowNode = new LineArrowNode( 0, 0, 1, 0, DISTANCE_ARROW_OPTIONS );
    d1ArrowNode.addChild( new Path( new Shape().moveTo( 0, -INITIAL_ARROW_LENGTH ).lineTo( 0, INITIAL_ARROW_LENGTH ), DISTANCE_ARROW_OPTIONS ) );
    d2ArrowNode.addChild( new Path( new Shape().moveTo( 0, -INITIAL_ARROW_LENGTH ).lineTo( 0, INITIAL_ARROW_LENGTH ), DISTANCE_ARROW_OPTIONS ) );
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
    const a1LabelNode = new RichText( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, MAJOR_AXIS_LABEL_OPTIONS );
    const a2LabelNode = new RichText( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, MAJOR_AXIS_LABEL_OPTIONS );
    const a1ArrowNode = new LineArrowNode( 0, 0, 1, 0, MAJOR_AXIS_ARROW_OPTIONS );
    const a2ArrowNode = new LineArrowNode( 0, 0, 1, 0, MAJOR_AXIS_ARROW_OPTIONS );
    a1ArrowNode.addChild( new Path( new Shape().moveTo( 0, -INITIAL_ARROW_LENGTH ).lineTo( 0, INITIAL_ARROW_LENGTH ), MAJOR_AXIS_ARROW_OPTIONS ) );
    a2ArrowNode.addChild( new Path( new Shape().moveTo( 0, -INITIAL_ARROW_LENGTH ).lineTo( 0, INITIAL_ARROW_LENGTH ), MAJOR_AXIS_ARROW_OPTIONS ) );
    const majorAxisArrowsNode = new HBox( {
      visibleProperty: model.stringsVisibleProperty,
      children: [ a1ArrowNode, a2ArrowNode ]
    } );
    const majorAxisDisplayNode = new Node( {
      children: [ majorAxisArrowsNode, a1LabelNode, a2LabelNode ],
      visibleProperty: model.semiaxisVisibleProperty
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

    const updateArrowNodes = () => {
      const scale = this.modelViewTransformProperty.value.modelToViewDeltaX( 1 );
      const aLength = this.orbit.a * scale;
      const d1Length = this.orbit.d1 * scale;
      const d2Length = this.orbit.d2 * scale;

      const rString = KeplersLawsStrings.symbols.radiusStringProperty.value;
      const d1String = KeplersLawsStrings.symbols.distance1StringProperty.value;
      const d2String = KeplersLawsStrings.symbols.distance2StringProperty.value;

      d1LabelNode.setString( this.orbit.isCircularProperty.value ? rString : d1String );
      d2LabelNode.setString( this.orbit.isCircularProperty.value ? rString : d2String );

      d1LabelNode.x = -d2Length / 2;
      d2LabelNode.x = d1Length / 2;

      const dx = 3; // reducing the arrow length a bit to get the proper measurable length in screen

      d1ArrowNode.setTailAndTip( 0, 0, d1Length - dx, 0 );
      d2ArrowNode.setTailAndTip( 0, 0, -d2Length + dx, 0 );

      a1ArrowNode.setTailAndTip( 0, 0, aLength - dx, 0 );
      a2ArrowNode.setTailAndTip( 0, 0, -aLength + dx, 0 );
    };

    Multilink.multilink( [
      KeplersLawsStrings.symbols.radiusStringProperty,
      KeplersLawsStrings.symbols.distance1StringProperty,
      KeplersLawsStrings.symbols.distance2StringProperty,
      model.zoomProperty
    ], updateArrowNodes );

    this.orbit.ranEmitter.addListener( updateArrowNodes );
  }
}

keplersLaws.register( 'DistancesDisplayNode', DistancesDisplayNode );