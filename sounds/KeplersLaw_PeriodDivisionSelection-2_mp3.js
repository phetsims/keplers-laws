/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;