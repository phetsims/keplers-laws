// Copyright 2023, University of Colorado Boulder

/**
 * Controls time in KeplersLaws
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import TimeControlNode, { TimeControlNodeOptions } from '../../../../scenery-phet/js/TimeControlNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { HBox, Path, Rectangle } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 34;
const STEP_BUTTON_RADIUS = 23;
const PUSH_BUTTON_SPACING = 8;


// Restart Icon ---------------------------------------------------------------------------
// constants
const SCALE = 0.75;
const V_SCALE = 1.15;
const BAR_WIDTH = 4 * SCALE;
const BAR_HEIGHT = 19 * SCALE * V_SCALE;
const TRIANGLE_WIDTH = 15 * SCALE;
const TRIANGLE_HEIGHT = 19 * SCALE * V_SCALE;

const barPath = new Rectangle( 0, 0, BAR_WIDTH, BAR_HEIGHT, { fill: 'black' } );
const trianglePath = new Path( new Shape().moveTo( 0, TRIANGLE_HEIGHT / 2 ).lineTo( -TRIANGLE_WIDTH, 0 ).lineTo( 0, -TRIANGLE_HEIGHT / 2 ).close(), {
  fill: 'black'
} );
const trianglePath2 = new Path( new Shape().moveTo( 0, TRIANGLE_HEIGHT / 2 ).lineTo( -TRIANGLE_WIDTH, 0 ).lineTo( 0, -TRIANGLE_HEIGHT / 2 ).close(), {
  fill: 'black'
} );
const restartIcon = new HBox( { children: [ barPath, trianglePath, trianglePath2 ], spacing: -1 } );

type SelfOptions = {
  restartListener: () => void;
  stepForwardListener: () => void;
};

export type KeplersLawsTimeControlNodeOptions = SelfOptions & TimeControlNodeOptions & PickRequired<TimeControlNodeOptions, 'tandem'>;

export default class KeplersLawsTimeControlNode extends TimeControlNode {
  public constructor(
    model: KeplersLawsModel,
    providedOptions: KeplersLawsTimeControlNodeOptions
  ) {

    const options = optionize<KeplersLawsTimeControlNodeOptions, SelfOptions, TimeControlNodeOptions>()( {
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: [ TimeSpeed.FAST, TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      scale: 0.9,
      playPauseStepButtonOptions: {
        playPauseStepXSpacing: PUSH_BUTTON_SPACING,
        playPauseButtonOptions: {
          radius: PLAY_PAUSE_BUTTON_RADIUS
        },
        stepForwardButtonOptions: {
          radius: STEP_BUTTON_RADIUS,
          listener: providedOptions.stepForwardListener,
          touchAreaDilation: 2
        }
      },
      buttonGroupXSpacing: 20,
      speedRadioButtonGroupOnLeft: false,
      speedRadioButtonGroupOptions: {
        labelOptions: KeplersLawsConstants.TEXT_OPTIONS,
        touchAreaXDilation: 10
      },

      isDisposable: false
    }, providedOptions );

    super( model.isPlayingProperty, options );

    const restartButton = new RoundPushButton( {
      content: restartIcon,
      enabledProperty: model.hasPlayedProperty,
      radius: STEP_BUTTON_RADIUS,
      touchAreaDilation: 2,
      xMargin: 9.5,
      yMargin: 9.5,
      listener: () => model.restart(),
      center: this.getPlayPauseButtonCenter().minusXY( PLAY_PAUSE_BUTTON_RADIUS + STEP_BUTTON_RADIUS + PUSH_BUTTON_SPACING, 0 ),
      tandem: providedOptions.tandem.createTandem( 'restartButton' ),
      layoutOptions: {
        xMargin: SolarSystemCommonConstants.MARGIN / 2
      },
      innerContent: SolarSystemCommonStrings.a11y.restartStringProperty
    } );

    this.addChild( restartButton );
    this.playPauseStepButtons.pdomOrder = [ restartButton, ...( this.playPauseStepButtons.pdomOrder ? this.playPauseStepButtons.pdomOrder : [] ) ];


    this.speedRadioButtonGroupParent!.center = this.getPlayPauseButtonCenter().plusXY(
      2 * PLAY_PAUSE_BUTTON_RADIUS + 2 * STEP_BUTTON_RADIUS + 4 * PUSH_BUTTON_SPACING,
      0
    );
  }
}

keplersLaws.register( 'KeplersLawsTimeControlNode', KeplersLawsTimeControlNode );