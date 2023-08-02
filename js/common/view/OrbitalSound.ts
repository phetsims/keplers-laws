// Copyright 2023, University of Colorado Boulder
/**
 * Object that controls the sound variations of the orbital changes.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import saturatedSineLoopTrimmed_wav from '../../../sounds/saturatedSineLoopTrimmed_wav.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import animationFrameTimer from '../../../../axon/js/animationFrameTimer.js';
import Utils from '../../../../dot/js/Utils.js';

export default class OrbitalSound {
  private readonly orbitalSoundClip: SoundClip;
  private internalTime = 0;

  public constructor(
    private readonly semimajorAxisProperty: TReadOnlyProperty<number>,
    private readonly eccentricityProperty: TReadOnlyProperty<number> ) {
    this.orbitalSoundClip = new SoundClip( saturatedSineLoopTrimmed_wav, {
      initialOutputLevel: 0.1,
      loop: true
    } );
    soundManager.addSoundGenerator( this.orbitalSoundClip );

    Multilink.multilink( [ this.semimajorAxisProperty ], () => {
      this.orbitalSoundClip.setPlaybackRate( Utils.clamp( Math.pow( this.semimajorAxisProperty.value, 0.5 ), 0, 4 ) );
    } );

    animationFrameTimer.addListener( () => {
      this.internalTime += 1;
      this.internalTime %= 1000;
      const e = this.eccentricityProperty.value;
      const baseLevel = 0.1;
      this.orbitalSoundClip.setOutputLevel( baseLevel + baseLevel * e * Math.sin( 1.5 * this.internalTime / 2 ) );
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