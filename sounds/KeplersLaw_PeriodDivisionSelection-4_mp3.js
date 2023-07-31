/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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G90NDIouMt3dFUpdLA2fDXXE3TlSMZUZSCpJZha76mKEZCJj1EFZgPGMYKAgnRdScXO4hGIBWSL/+0LEewAGYDcxRYXmcKwHJaiQpJY1SxdhpDKqVi6WhUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+0LEnQAExCslQoRDMKOFYmgRiDZVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+0DExoBDXEkBoIxBeOKIkaGcJYlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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