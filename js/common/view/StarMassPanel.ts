// Copyright 2023, University of Colorado Boulder

/**
 * StarMassPanel contains a slider that controls the main body mass for the Third Law.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Panel from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import SolarSystemCommonNumberControl from '../../../../solar-system-common/js/view/SolarSystemCommonNumberControl.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';

// constants
const SNAP_TOLERANCE = 0.05;
const THUMB_SIZE = new Dimension2( 14, 24 );

export default class StarMassPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {

    const options = {
      isDisposable: false,
      fill: SolarSystemCommonColors.controlPanelFillProperty,
      stroke: null
    };

    const titleText = new Text( KeplersLawsStrings.starMassStringProperty, KeplersLawsConstants.TITLE_OPTIONS );

    const thumbFillProperty = SolarSystemCommonColors.firstBodyColorProperty;
    const ourSunTickLabelValue = model.sun.massProperty.value;
    const massRange = new RangeWithValue( ourSunTickLabelValue / 2, 2 * ourSunTickLabelValue, ourSunTickLabelValue );

    const numberControl = new SolarSystemCommonNumberControl( model.sun.massProperty, massRange, {
      sliderOptions: {
        constrainValue: ( mass: number ) => Math.abs( mass - ourSunTickLabelValue ) / ourSunTickLabelValue < SNAP_TOLERANCE ? ourSunTickLabelValue : mass,

        trackSize: new Dimension2( 150, 1 ),
        thumbSize: THUMB_SIZE,
        thumbTouchAreaXDilation: THUMB_SIZE.width,
        thumbTouchAreaYDilation: THUMB_SIZE.height,
        trackStroke: SolarSystemCommonColors.foregroundProperty,

        // ticks
        tickLabelSpacing: 3,
        majorTickLength: 13,
        majorTickStroke: SolarSystemCommonColors.foregroundProperty,

        // custom thumb
        thumbFill: thumbFillProperty,
        thumbFillHighlighted: new DerivedProperty( [ thumbFillProperty ], color => color.colorUtilsBrighter( 0.7 ) )
      },

      // snap to default value if close
      startCallback: () => { model.sun.userControlledMassProperty.value = true; },
      endCallback: () => {
        model.sun.userControlledMassProperty.value = false;
      }
    } );

    // 'Our Sun' tick label
    const ourSunTickLabel = new Text( KeplersLawsStrings.ourSunStringProperty, {
      font: new PhetFont( 13 ),
      fill: SolarSystemCommonColors.foregroundProperty,
      maxWidth: 60
    } );

    // Add tick marks and labels
    const tickLabels = [ createTickLabel( '0.5' ), ourSunTickLabel, createTickLabel( '1.5' ), createTickLabel( '2.0' ) ];
    for ( let i = 0; i < tickLabels.length; i++ ) {
      const tickValue = ( i + 1 ) / tickLabels.length * massRange.max;
      numberControl.slider.addMajorTick( tickValue, tickLabels[ i ] );
    }

    const content = new VBox( {
      spacing: 10,
      children: [
        titleText,
        numberControl
      ]
    } );

    super( content, options );
  }
}

/**
 * Creates a tick label.
 */
const createTickLabel = ( value: string ) => new Text( value, {
  font: new PhetFont( 13 ),
  fill: SolarSystemCommonColors.foregroundProperty,
  maxWidth: 110
} );

keplersLaws.register( 'StarMassPanel', StarMassPanel );