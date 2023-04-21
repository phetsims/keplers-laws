// Copyright 2023, University of Colorado Boulder

/**
 * Box that shows the length of distances available in the sim:
 *  - d1 and d2: Focal strings' lengths from the sun and secondary focus to the planet
 *  - R: Distance from the sun to the planet (circular orbit)
 *  - a: Semi-major axis of the ellipse
 *
 * @author Agustín Vallejo
 */

import { HBox, Path, RichText, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import LineArrowNode from '../../../../scenery-phet/js/LineArrowNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsStrings from '../../../../keplers-laws/js/KeplersLawsStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import keplersLaws from '../../keplersLaws.js';
import Multilink from '../../../../axon/js/Multilink.js';

export const DISTANCE_LABEL_OPTIONS = combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TEXT_OPTIONS, {
  scale: 1.5,
  stroke: '#ccb285',
  fill: '#ccb285'
} );

export const AXIS_LABEL_OPTIONS = combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TEXT_OPTIONS, {
  scale: 1.5,
  stroke: 'orange',
  fill: 'orange'
} );

export const STRING_ARROW_OPTIONS = {
  stroke: '#ccb285',
  headHeight: 10,
  headWidth: 10,
  headLineWidth: 3,
  tailLineWidth: 3,
  tailLineDash: [ 10, 2 ],
  lineWidth: 3 // See note below
};

export const MAJOR_AXIS_ARROW_OPTIONS = {
  stroke: 'orange',
  fill: 'orange',
  headHeight: 10,
  headWidth: 10,
  headLineWidth: 3,
  tailLineWidth: 3,
  lineWidth: 3 // See note below
};

// Note: lineWidth is not supported by LineArrowNode but it is supported by Path.
// This is a workaround to use the same arrow options in the butts to make it
// Look like a DimensionalArrowNode (which is not yet implemented in common code)

export default class DistancesDisplayNode extends VBox {
  public orbit: EllipticalOrbitEngine;

  public constructor(
    model: KeplersLawsModel,
    public modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>
  ) {
    super( {
      spacing: 10,
      visibleProperty: DerivedProperty.and( [ model.stringsVisibleProperty, model.engine.allowedOrbitProperty ] )
    } );

    this.orbit = model.engine;

    const stringLabelNode1 = new RichText( '', DISTANCE_LABEL_OPTIONS );
    const stringLabelNode2 = new RichText( '', DISTANCE_LABEL_OPTIONS );

    const d1lineArrowNode = new LineArrowNode( 0, 0, 0, 1, STRING_ARROW_OPTIONS );
    const d2lineArrowNode = new LineArrowNode( 0, 0, 0, 1, STRING_ARROW_OPTIONS );
    d1lineArrowNode.addChild( new Path( new Shape().moveTo( 0, -5 ).lineTo( 0, 5 ), STRING_ARROW_OPTIONS ) );
    d2lineArrowNode.addChild( new Path( new Shape().moveTo( 0, -5 ).lineTo( 0, 5 ), STRING_ARROW_OPTIONS ) );

    const aLineArrowNode1 = new LineArrowNode( 0, 0, 0, 1, MAJOR_AXIS_ARROW_OPTIONS );
    const aLineArrowNode2 = new LineArrowNode( 0, 0, 0, 1, MAJOR_AXIS_ARROW_OPTIONS );
    aLineArrowNode1.addChild( new Path( new Shape().moveTo( 0, -5 ).lineTo( 0, 5 ), MAJOR_AXIS_ARROW_OPTIONS ) );
    aLineArrowNode2.addChild( new Path( new Shape().moveTo( 0, -5 ).lineTo( 0, 5 ), MAJOR_AXIS_ARROW_OPTIONS ) );


    const focalStringsBox = new HBox( {
      children: [
        new VBox( {
          children: [
            stringLabelNode1,
            d1lineArrowNode
          ]
        } ),
        new VBox( {
          children: [
            stringLabelNode2,
            d2lineArrowNode
          ]
        } )
      ]
    } );

    const majorAxisBox = new HBox( {
      children: [
        new VBox( {
          children: [
            aLineArrowNode1,
            new RichText( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, AXIS_LABEL_OPTIONS )
          ]
        } ),
        new VBox( {
          children: [
            aLineArrowNode2,
            new RichText( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, AXIS_LABEL_OPTIONS )
          ]
        } )
      ]
    } );

    this.children = [
      focalStringsBox,
      majorAxisBox
    ];

    const updateDistances = () => {
      const scale = this.modelViewTransformProperty.value.modelToViewDeltaX( 1 );
      const aLength = this.orbit.a * scale;
      const d1Length = this.orbit.d1 * scale;
      const d2Length = this.orbit.d2 * scale;

      const rString = KeplersLawsStrings.symbols.radiusStringProperty.value;
      const d1String = KeplersLawsStrings.symbols.distance1StringProperty.value;
      const d2String = KeplersLawsStrings.symbols.distance2StringProperty.value;

      stringLabelNode1.setString( this.orbit.isCircularProperty.value ? rString : d1String );
      stringLabelNode2.setString( this.orbit.isCircularProperty.value ? rString : d2String );

      stringLabelNode1.x = -d2Length / 2;
      stringLabelNode2.x = d1Length / 2;

      const dx = 3; // reducing the arrow length a bit to get the proper measurable length in screen

      d1lineArrowNode.setTailAndTip( 0, 0, d1Length - dx, 0 );
      d2lineArrowNode.setTailAndTip( 0, 0, -d2Length + dx, 0 );

      aLineArrowNode1.setTailAndTip( 0, 0, aLength - dx, 0 );
      aLineArrowNode2.setTailAndTip( 0, 0, -aLength + dx, 0 );
    };

    Multilink.multilink( [
      KeplersLawsStrings.symbols.radiusStringProperty,
      KeplersLawsStrings.symbols.distance1StringProperty,
      KeplersLawsStrings.symbols.distance2StringProperty
    ], updateDistances );

    this.orbit.changedEmitter.addListener( updateDistances );
  }
}

keplersLaws.register( 'DistancesDisplayNode', DistancesDisplayNode );