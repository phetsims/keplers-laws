// Copyright 2023, University of Colorado Boulder

/**
 * Slider that controls the main body mass for the Third Law.
 *
 * @author Agustín Vallejo
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
const NUM_TICKS = 4;
const WIDTH = 150;
const SPACING = ( WIDTH - NUM_TICKS ) / ( NUM_TICKS - 1 );

export default class StarMassPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const colorProperty = SolarSystemCommonColors.firstBodyColorProperty;
    const defaultLabelValue = model.sun.massProperty.value;
    const massRange = new RangeWithValue( defaultLabelValue / 2, 2 * defaultLabelValue, defaultLabelValue );
    const slider = new SolarSystemCommonNumberControl(
      model.sun.massProperty,
      massRange, {
        sliderOptions: {
          constrainValue: ( mass: number ) => Math.abs( mass - defaultLabelValue ) / defaultLabelValue < SNAP_TOLERANCE ? defaultLabelValue : mass,

          trackSize: new Dimension2( WIDTH, 1 ),
          thumbSize: THUMB_SIZE,
          thumbTouchAreaXDilation: THUMB_SIZE.width,
          thumbTouchAreaYDilation: THUMB_SIZE.height,
          trackStroke: SolarSystemCommonColors.foregroundProperty,

          // ticks
          tickLabelSpacing: 3,
          majorTickLength: 13,
          majorTickStroke: SolarSystemCommonColors.foregroundProperty,

          // custom thumb
          thumbFill: colorProperty,
          thumbFillHighlighted: new DerivedProperty( [ colorProperty ], color => color.colorUtilsBrighter( 0.7 ) )
        },

        // snap to default value if close
        startCallback: () => { model.sun.userControlledMassProperty.value = true; },
        endCallback: () => {
          model.sun.userControlledMassProperty.value = false;
        }
        // tandem: tandem
      }
    );
    super( new VBox( {
      spacing: 10,
      children: [
        new Text( KeplersLawsStrings.starMassStringProperty, KeplersLawsConstants.TITLE_OPTIONS ),
        slider
      ]
    } ), {
      isDisposable: false,
      fill: SolarSystemCommonColors.controlPanelFillProperty,
      stroke: null
    } );

    // add ticks and labels
    // const defaultLabel = new Text( valueLabel, {
    const defaultLabel = new Text( KeplersLawsStrings.ourSunStringProperty, {
      top: 10,
      centerX: SPACING,
      font: new PhetFont( 13 ),
      fill: SolarSystemCommonColors.foregroundProperty,
      maxWidth: 80
    } );

    // create a label for the default value
    // @param - string for the label text
    const createNumberLabel = ( value: string ) => new Text( value, {
      font: new PhetFont( 13 ),
      fill: SolarSystemCommonColors.foregroundProperty,
      maxWidth: 110
    } );

    const labels = [ createNumberLabel( '0.5' ), defaultLabel, createNumberLabel( '1.5' ), createNumberLabel( '2.0' ) ];
    for ( let i = 0; i < labels.length; i++ ) {
      const tickValue = ( i + 1 ) / labels.length * massRange.max;
      slider.slider.addMajorTick( tickValue, labels[ i ] );
    }
  }
}

keplersLaws.register( 'StarMassPanel', StarMassPanel );