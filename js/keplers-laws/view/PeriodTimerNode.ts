// Copyright 2023, University of Colorado Boulder
/**
 * PeriodTimer for the Kepler's Third Law screen.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { AlignBox, DragListener, Image, Node, NodeOptions, Path, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Utils from '../../../../dot/js/Utils.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import Property from '../../../../axon/js/Property.js';
import periodTimerBackground_png from '../../../images/periodTimerBackground_png.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import KeplersLawsConstants from '../../KeplersLawsConstants.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const secondsPatternString = SolarSystemCommonStrings.pattern.labelUnits;

type SelfOptions = {
  iconColor?: string;
  buttonBaseColor?: string;
  dragBoundsProperty?: Property<Bounds2>;

  numberDisplayOptions?: NumberDisplayOptions;
};

type PeriodTimerNodeOptions = SelfOptions & NodeOptions;

export default class PeriodTimerNode extends Node {
  public constructor(
    periodTimer: Stopwatch,
    transformProperty: TReadOnlyProperty<ModelViewTransform2>,
    layoutBounds: Bounds2,
    providedOptions: PeriodTimerNodeOptions
  ) {

    const options = optionize<PeriodTimerNodeOptions, SelfOptions, NodeOptions>()( {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',
      cursor: 'pointer',

      dragBoundsProperty: new Property( layoutBounds ),

      numberDisplayOptions: {
        useRichText: true,
        textOptions: {
          font: SolarSystemCommonConstants.TITLE_FONT
        },
        align: 'right',
        cornerRadius: 4,
        xMargin: 4,
        yMargin: 2,
        pickable: false // allow dragging by the number display
      }
    }, providedOptions );

    super( options );

    // creates Uturn arrow on the period timer tool
    const uArrowShape = new UTurnArrowShape( 10 );

    // creates triangle shape on play button by creating three lines at x,y coordinates.
    const playPauseSize = uArrowShape.bounds.height;
    const halfPlayStroke = 0.05 * playPauseSize;
    const playOffset = 0.15 * playPauseSize;
    const playShape = new Shape().moveTo( playPauseSize - halfPlayStroke * 0.5 - playOffset, 0 )
      .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseSize / 2 - halfPlayStroke - playOffset )
      .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseSize / 2 + halfPlayStroke + playOffset )
      .close()
      .getOffsetShape( -playOffset );

    // creates playPauseButton
    const playPauseButton = new BooleanRectangularToggleButton( periodTimer.isRunningProperty, new Path( uArrowShape, {
      fill: options.iconColor,
      center: Vector2.ZERO,
      pickable: false
    } ), new Path( playShape, {
      pickable: false,
      stroke: options.iconColor,
      fill: '#eef',
      lineWidth: halfPlayStroke * 2,
      center: Vector2.ZERO
    } ), {
      baseColor: options.buttonBaseColor,
      minWidth: 40
    } );
    playPauseButton.touchArea = playPauseButton.localBounds.dilated( 5 );


    // Creates time text inside period timer tool.
    const readoutText = new Text( '', KeplersLawsConstants.TIMER_READOUT_OPTIONS );
    // present for the lifetime of the sim
    periodTimer.timeProperty.link( value => {
      readoutText.string = StringUtils.fillIn( secondsPatternString, {
        value: Utils.toFixed( value, 2 ),
        units: SolarSystemCommonStrings.units.yearsStringProperty
      } );
    } );

    // Creates white background behind the time readout text in period timer tool.
    const textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 20, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)'
    } );

    // Creates the title, time readout, and period timer pendulum selector as one box in period timer tool.
    const vBox = new VBox( {
      spacing: 5,
      align: 'center',
      children: [
        new Text( KeplersLawsStrings.periodStringProperty, {
          font: SolarSystemCommonConstants.TITLE_FONT,
          pickable: false,
          maxWidth: playPauseButton.width
        } ),
        new Node( {
          children: [ textBackground, readoutText ],
          pickable: false,
          maxWidth: playPauseButton.width * 2.5
        } ),
        playPauseButton
      ]
    } );

    // background image
    const background = new Image( periodTimerBackground_png, {
      scale: 0.6,
      center: vBox.center
    } );
    this.addChild( background );

    // adds period timer contents on top of yellow background.
    this.addChild( new AlignBox( vBox, {
      alignBounds: background.bounds
    } ) );

    const dragListener = new DragListener( {
      positionProperty: periodTimer.positionProperty,
      useParentOffset: true,
      dragBoundsProperty: new Property( layoutBounds.erodedXY( this.width / 2, this.height / 2 ) ),
      allowTouchSnag: false
    } );
    // add drag and drop events
    this.addInputListener( dragListener );

    // add update of node position
    periodTimer.positionProperty.link( position => {
      // Because position is initialized to be null
      if ( position ) {
        this.center = transformProperty.value.modelToViewPosition( position );
      }
    } );
  }
}

keplersLaws.register( 'PeriodTimerNode', PeriodTimerNode );