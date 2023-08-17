// Copyright 2023, University of Colorado Boulder
/**
 * Object that controls the sound variations of the orbital changes.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
// import saturatedSineLoopTrimmed_wav from '../../../sounds/saturatedSineLoopTrimmed_wav.js';
// import charges_wav from '../../../sounds/charges_wav.js';
import OrbitEccentricity_loop_v2_wav from '../../../sounds/OrbitEccentricity_loop_v2_wav.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import animationFrameTimer from '../../../../axon/js/animationFrameTimer.js';
import Utils from '../../../../dot/js/Utils.js';

export default class OrbitalSound {
  private readonly orbitalSoundClip: SoundClip;
  private internalTime = 0; //REVIEW document

  public constructor(
    private readonly semimajorAxisProperty: TReadOnlyProperty<number>,
    private readonly eccentricityProperty: TReadOnlyProperty<number> ) {
    this.orbitalSoundClip = new SoundClip( OrbitEccentricity_loop_v2_wav, {
      initialOutputLevel: 0.5,
      loop: true
    } );
    soundManager.addSoundGenerator( this.orbitalSoundClip );

    const maxPlaybackRate = 4;
    const minPlaybackRate = 0.1;

    Multilink.multilink( [ this.semimajorAxisProperty ], () => {
      const mapping = Utils.clamp(
        Utils.linear(
          minPlaybackRate, maxPlaybackRate * 0.7,
          maxPlaybackRate, minPlaybackRate, Math.pow( this.semimajorAxisProperty.value, 0.5 ) ),
        minPlaybackRate, maxPlaybackRate
      );
      this.orbitalSoundClip.setPlaybackRate( mapping );
    } );

    animationFrameTimer.addListener( () => {
      this.internalTime += 1;
      this.internalTime %= 1000;
      const e = this.eccentricityProperty.value;
      const baseLevel = 0.1;
      this.orbitalSoundClip.setOutputLevel( baseLevel + 1.5 * baseLevel * e * Math.sin( 1.5 * this.internalTime / 2 ) );
    } );
  }

  public playOrbitalSound(): void {
    this.orbitalSoundClip.play();
  }

  public stopOrbitalSound(): void {
    this.orbitalSoundClip.stop();
  }
}

keplersLaws.register( 'OrbitalSound', OrbitalSound );