// Copyright 2023-2025, University of Colorado Boulder

/**
 * Object that controls the sound variations of the orbital changes.
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import AmplitudeModulator from '../../../../tambo/js/AmplitudeModulator.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import OrbitEccentricity_loop_wav from '../../../sounds/OrbitEccentricity_loop_wav.js';
import keplersLaws from '../../keplersLaws.js';

export default class OrbitalSound extends SoundGenerator {
  private readonly orbitalSoundClip: SoundClip;

  public readonly amplitudeModulator: AmplitudeModulator;

  // Internal time to control the sound variations, increases during the animation stage
  private internalTime = 0;

  public constructor(
    private readonly semiMajorAxisProperty: TReadOnlyProperty<number>,
    private readonly eccentricityProperty: TReadOnlyProperty<number> ) {

    super();

    // Create the amplitude modulator.
    this.amplitudeModulator = new AmplitudeModulator();
    this.amplitudeModulator.connect( this.soundSourceDestination );
    this.amplitudeModulator.frequencyProperty.value = 7;

    this.orbitalSoundClip = new SoundClip( OrbitEccentricity_loop_wav, {
      initialOutputLevel: 0.2,
      loop: true
    } );

    // Hooking the loop to the amplitude modulator
    this.orbitalSoundClip.connect( this.amplitudeModulator.getConnectionPoint() );

    const maxPlaybackRate = 4;
    const minPlaybackRate = 0.1;

    Multilink.multilink( [ this.semiMajorAxisProperty, this.eccentricityProperty ], ( semiMajorAxis, eccentricity ) => {
      const mapping = Utils.clamp(
        Utils.linear(
          minPlaybackRate, maxPlaybackRate * 0.7,
          maxPlaybackRate, minPlaybackRate, Math.pow( semiMajorAxis, 0.5 ) ),
        minPlaybackRate, maxPlaybackRate
      );
      this.orbitalSoundClip.setPlaybackRate( mapping );
      this.amplitudeModulator.depthProperty.value = eccentricity;
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