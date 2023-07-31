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