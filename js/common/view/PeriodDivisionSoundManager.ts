// Copyright 2023, University of Colorado Boulder
/**
 * Handles the sound the Number Control will make when changing period divisions.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import PeriodDivisionSelection_2_mp3 from '../../../sounds/PeriodDivisionSelection_2_mp3.js';
import PeriodDivisionSelection_3_mp3 from '../../../sounds/PeriodDivisionSelection_3_mp3.js';
import PeriodDivisionSelection_4_mp3 from '../../../sounds/PeriodDivisionSelection_4_mp3.js';
import PeriodDivisionSelection_5_mp3 from '../../../sounds/PeriodDivisionSelection_5_mp3.js';
import PeriodDivisionSelection_6_mp3 from '../../../sounds/PeriodDivisionSelection_6_mp3.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';

const periodDivisionSounds = [
  PeriodDivisionSelection_2_mp3,
  PeriodDivisionSelection_3_mp3,
  PeriodDivisionSelection_4_mp3,
  PeriodDivisionSelection_5_mp3,
  PeriodDivisionSelection_6_mp3
  ];

export default class PeriodDivisionSoundManager {
  private readonly periodDivisionSoundClips: SoundClip[];
  public constructor() {
    this.periodDivisionSoundClips = periodDivisionSounds.map( sound => new SoundClip( sound, {
      initialOutputLevel: 2 * SolarSystemCommonConstants.DEFAULT_SOUND_OUTPUT_LEVEL
    } ) );

    this.periodDivisionSoundClips.forEach( sound => soundManager.addSoundGenerator( sound ) );
  }

  public playPeriodDivisionSound( periodDivision: number ): void {
    if ( periodDivision >= 2 && periodDivision <= 6 ) {
      this.periodDivisionSoundClips[ periodDivision - 2 ].play();
    }
  }
}

keplersLaws.register( 'PeriodDivisionSoundManager', PeriodDivisionSoundManager );