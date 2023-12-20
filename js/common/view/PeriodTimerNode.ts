// Copyright 2023, University of Colorado Boulder
/**
 * PeriodTimer for the Kepler's Third Law screen.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { AlignBox, DragListener, Image, InteractiveHighlighting, KeyboardDragListener, Node, NodeOptions, Path, Rectangle, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import Grab_Sound_mp3 from '../../../../solar-system-common/sounds/Grab_Sound_mp3.js';
import Release_Sound_mp3 from '../../../../solar-system-common/sounds/Release_Sound_mp3.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

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
  public readonly grabClip: SoundClip;
  public readonly releaseClip: SoundClip;

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


    this.grabClip = new SoundClip( Grab_Sound_mp3 );
    this.releaseClip = new SoundClip( Release_Sound_mp3 );

    if ( options.soundViewNode ) {
      soundManager.addSoundGenerator( this.grabClip, {
        associatedViewNode: options.soundViewNode
      } );
      soundManager.addSoundGenerator( this.releaseClip, {
        associatedViewNode: options.soundViewNode
      } );
    }

    const start = () => {
      this.grabClip.play();
    };
    const end = () => {
      this.releaseClip.play();
    };

    periodStopwatch.positionProperty.link( position => {
      this.translation = position;
    } );

    const derivedDragBoundsProperty = new DerivedProperty( [ options.dragBoundsProperty, this.localBoundsProperty ], ( dragBounds, localBounds ) => {
      return dragBounds?.withOffsets( localBounds.left, localBounds.top, -localBounds.right, -localBounds.bottom );
    } );

    const dragListener = new DragListener( {
      targetNode: this,
      positionProperty: periodStopwatch.positionProperty,
      dragBoundsProperty: derivedDragBoundsProperty,
      start: start,
      end: end,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener( {
      positionProperty: periodStopwatch.positionProperty,
      dragBoundsProperty: derivedDragBoundsProperty,
      dragVelocity: 450,
      shiftDragVelocity: 100,
      start: start,
      end: end,
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