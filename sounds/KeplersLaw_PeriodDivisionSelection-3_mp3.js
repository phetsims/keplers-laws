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