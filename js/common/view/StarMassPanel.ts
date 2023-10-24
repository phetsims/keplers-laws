// Copyright 2023, University of Colorado Boulder

/**
 * StarMassPanel contains a slider that controls the main body mass for the Third Law.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import SolarSystemCommonNumberControl from '../../../../solar-system-common/js/view/SolarSystemCommonNumberControl.js';
import Range from '../../../../dot/js/Range.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';

// constants
const SNAP_TOLERANCE = 0.05;
const THUMB_SIZE = new Dimension2( 14, 24 );

export default class StarMassPanel extends Panel {
  public constructor( model: KeplersLawsModel, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      isDisposable: false,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );

    const titleText = new Text( KeplersLawsStrings.starMassStringProperty,
      combineOptions<TextOptions>( {}, KeplersLawsConstants.TITLE_OPTIONS, {
        maxWidth: 200
      } ) );

    const thumbFillProperty = SolarSystemCommonColors.body1ColorProperty;

    // Range of the star mass slider, relative to the mass of our sun
    const massRange = new Range( 0.5 * KeplersLawsConstants.MASS_OF_OUR_SUN, 2 * KeplersLawsConstants.MASS_OF_OUR_SUN );

    const massNumberControl = new SolarSystemCommonNumberControl( model.sun.massProperty, massRange, {
      sliderOptions: {

        // Snap to 'Our Sun' tick mark
        constrainValue: mass => ( Math.abs( mass - KeplersLawsConstants.MASS_OF_OUR_SUN ) / KeplersLawsConstants.MASS_OF_OUR_SUN ) < SNAP_TOLERANCE ?
                                KeplersLawsConstants.MASS_OF_OUR_SUN : mass,

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
      startCallback: () => { model.sun.userIsControllingMassProperty.value = true; },
      endCallback: () => {
        model.sun.userIsControllingMassProperty.value = false;
      },
      tandem: tandem.createTandem( 'massNumberControl' )
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
      massNumberControl.slider.addMajorTick( tickValue, tickLabels[ i ] );
    }

    const content = new VBox( {
      spacing: 10,
      children: [
        titleText,
        massNumberControl
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