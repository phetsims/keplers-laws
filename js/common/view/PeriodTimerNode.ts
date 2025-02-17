// Copyright 2023-2025, University of Colorado Boulder

/**
 * PeriodTimer for the Kepler's Third Law screen.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import periodTimerBackground_png from '../../../images/periodTimerBackground_png.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

const secondsPatternString = SolarSystemCommonStrings.pattern.labelUnits;
const FONT = new PhetFont( { size: 16, weight: 'bold' } );
const READOUT_TEXT_OPTIONS: TextOptions = {
  font: new PhetFont( { size: 18 } ),
  fill: 'black',
  maxWidth: 100
};

type SelfOptions = {
  iconColor?: string;
  buttonBaseColor?: string;
  dragBoundsProperty?: Property<Bounds2>;

  numberDisplayOptions?: NumberDisplayOptions;

  // If a soundViewNode is provided, we'll hook up a soundClip to it and play sounds when it is visible
  soundViewNode?: Node | null;

  // accessible names for the play/pause button
  measureAccessibleName?: TReadOnlyProperty<string> | string;
  restartAccessibleName?: TReadOnlyProperty<string> | string;
};

type PeriodTimerNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class PeriodTimerNode extends InteractiveHighlighting( Node ) {
  public constructor(
    periodStopwatch: Stopwatch,
    layoutBounds: Bounds2,
    providedOptions: PeriodTimerNodeOptions
  ) {

    const options = optionize<PeriodTimerNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false,
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',
      cursor: 'pointer',

      dragBoundsProperty: new Property( layoutBounds ),

      numberDisplayOptions: {
        useRichText: true,
        textOptions: {
          font: FONT
        },
        align: 'right',
        cornerRadius: 4,
        xMargin: 4,
        yMargin: 2,
        pickable: false // allow dragging by the number display
      },

      measureAccessibleName: KeplersLawsStrings.a11y.measurePeriodStringProperty,
      restartAccessibleName: KeplersLawsStrings.a11y.restartMeasurementStringProperty,

      soundViewNode: null,
      focusable: true,
      tagName: 'div',

      // The group focus highlight makes it clear the timer is highlighted even if the children are focused
      groupFocusHighlight: true
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
    const uArrowPath = new Path( uArrowShape, {
      fill: options.iconColor,
      center: Vector2.ZERO,
      pickable: false
    } );
    const playPath = new Path( playShape, {
      pickable: false,
      stroke: options.iconColor,
      fill: '#eef',
      lineWidth: halfPlayStroke * 2,
      center: Vector2.ZERO
    } );
    const playPauseButton = new BooleanRectangularToggleButton( periodStopwatch.isRunningProperty, uArrowPath, playPath, {
      baseColor: options.buttonBaseColor,
      minWidth: 40,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      tandem: options.tandem.createTandem( 'playPauseButton' ),
      phetioVisiblePropertyInstrumented: false,
      phetioEnabledPropertyInstrumented: false
    } );
    playPauseButton.touchArea = playPauseButton.localBounds.dilated( 5 );

    const isRunningListener = ( isRunning: boolean ) => {
      // pdom - accessible name for the button
      playPauseButton.innerContent = isRunning ? options.restartAccessibleName : options.measureAccessibleName;
    };
    periodStopwatch.isRunningProperty.link( isRunningListener );


    // Creates time text inside period timer tool.
    const readoutText = new Text( new DerivedProperty(
      [ periodStopwatch.timeProperty, KeplersLawsStrings.units.yearsStringProperty ],
      ( time, units ) => {
        return StringUtils.fillIn( secondsPatternString, {
          value: Utils.toFixed( time, 2 ),
          units: KeplersLawsStrings.units.yearsStringProperty
        } );
      } ), READOUT_TEXT_OPTIONS );
    readoutText.boundsProperty.link( bounds => {
      readoutText.center = new Vector2( 0, 0 );
    } );

    // Creates white background behind the time readout text in period timer tool.
    const textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 18, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)'
    } );

    // Creates the title, time readout, and period timer pendulum selector as one box in period timer tool.
    const vBox = new VBox( {
      spacing: 5,
      align: 'center',
      children: [
        new Text( KeplersLawsStrings.periodStringProperty, {
          font: FONT,
          pickable: false,
          maxWidth: playPauseButton.width
        } ),
        new Node( {
          children: [ textBackground, readoutText ],
          pickable: false
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

    periodStopwatch.positionProperty.link( position => {
      this.translation = position;
    } );

    const derivedDragBoundsProperty = new DerivedProperty( [ options.dragBoundsProperty, this.localBoundsProperty ], ( dragBounds, localBounds ) => {
      return dragBounds?.withOffsets( localBounds.left, localBounds.top, -localBounds.right, -localBounds.bottom );
    } );

    const dragListener = new SoundDragListener( {
      targetNode: this,
      positionProperty: periodStopwatch.positionProperty,
      dragBoundsProperty: derivedDragBoundsProperty,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new SoundKeyboardDragListener( {
      positionProperty: periodStopwatch.positionProperty,
      dragBoundsProperty: derivedDragBoundsProperty,
      dragSpeed: 450,
      shiftDragSpeed: 100,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );

    // Move to front on pointer down, anywhere on this Node, including interactive subcomponents.
    this.addInputListener( {
      down: () => this.moveToFront(),
      focus: () => this.moveToFront()
    } );
  }
}

keplersLaws.register( 'PeriodTimerNode', PeriodTimerNode );