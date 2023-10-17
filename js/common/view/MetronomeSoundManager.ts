// Copyright 2023, University of Colorado Boulder

/**
 * Module in charge of controlling the sounds of the bodies in the simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import keplersLaws from '../../keplersLaws.js';
import Metronome_Sound_1_mp3 from '../../../../keplers-laws/sounds/Metronome_Sound_1_mp3.js';
import Metronome_Sound_2_mp3 from '../../../../keplers-laws/sounds/Metronome_Sound_2_mp3.js';
import Metronome_Sound_Reverb_1_mp3 from '../../../../keplers-laws/sounds/Metronome_Sound_Reverb_1_mp3.js';
import Metronome_Sound_Reverb_2_mp3 from '../../../../keplers-laws/sounds/Metronome_Sound_Reverb_2_mp3.js';
import Utils from '../../../../dot/js/Utils.js';
import soundConstants from '../../../../tambo/js/soundConstants.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';


const metronomeSounds = [
  Metronome_Sound_1_mp3,
  Metronome_Sound_2_mp3,
  Metronome_Sound_Reverb_1_mp3,
  Metronome_Sound_Reverb_2_mp3
];

// Other scales available to play around with!
const METRONOME = [ 7, 0, 0, 0, 0, 0 ]; // METRONOME
// const METRONOME = [ 4, 2, 0, 2, 4, 4 ]; // ADDITIONAL
// const METRONOME = [ 0, 2, 4, 5, 7, 9 ]; // SCALE
// const METRONOME = [ 0, 2, 4, 7, 9, 12 ]; // PENTATONIC_SCALE
// const METRONOME = [ 0, 3, 5, 6, 7, 10 ]; // BLUES_SCALE

export default class MetronomeSoundManager {

  // Sound for the orbital metronome
  private readonly metronomeSoundClips: SoundClip[];

  public constructor() {
    this.metronomeSoundClips = metronomeSounds.map( sound => new SoundClip( sound, {
      rateChangesAffectPlayingSounds: false
    } ) );

    this.metronomeSoundClips.forEach( sound => soundManager.addSoundGenerator( sound ) );
  }

  /**
   *  This function plays the melody described in METRONOME based on the division index.
   *  Because of how scales work, they are powers of the twelfth root of 2.
   *
   *  The amount of divisions shifts the metronome sound up or down half an octave (1 to 1.5)
   *
   *  And depending on the semi major axis, the sound is small (muted) or big (with reverb)
   */
  public playOrbitalMetronome( i: number, semiMajorAxis: number, divisions: number ): void {
    const smallSound = this.metronomeSoundClips[ 0 ];
    const bigSound = this.metronomeSoundClips[ 2 ];

    const divisionOffset = 1 + divisions / 12;

    smallSound.setPlaybackRate( Math.pow( soundConstants.TWELFTH_ROOT_OF_TWO, METRONOME[ i ] ) * divisionOffset );
    smallSound.setOutputLevel( Utils.clamp( Utils.linear( 0, 500, 1, 0, semiMajorAxis ), 0, 1 ) );
    smallSound.play();


    bigSound.setPlaybackRate( Math.pow( soundConstants.TWELFTH_ROOT_OF_TWO, METRONOME[ i ] ) * divisionOffset );
    bigSound.setOutputLevel( Utils.clamp( Utils.linear( 100, 500, 0, 1, semiMajorAxis ), 0, 1 ) );
    bigSound.play();
  }
}


keplersLaws.register( 'MetronomeSoundManager', MetronomeSoundManager );