// Copyright 2023, University of Colorado Boulder
/**
 * Model for the Third Law Screen. Keeps track of the state of the blue line tracking the body
 * when the PeriodTimerNode is set to run.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KeplersLawsModel from './KeplersLawsModel.js';
import Emitter from '../../../../axon/js/Emitter.js';

export class TrackingState extends EnumerationValue {
  public static readonly IDLE = new TrackingState();
  public static readonly STARTED = new TrackingState();
  public static readonly FADING = new TrackingState();
  public static readonly INVISIBLE = new TrackingState();

  public static readonly enumeration = new Enumeration( TrackingState, {
    phetioDocumentation: 'In what state the line of the period track is at'
  } );
}

export default class PeriodPath {
  public beganPeriodTimerAt = 0;
  public trackingState: TrackingState;
  public readonly periodTimer: Stopwatch;
  public readonly fadingTimer: Stopwatch;
  public readonly fadingEmitter = new Emitter();

  // Fraction of the period that the line will be fading
  public readonly fadingLifetime = 1.5;

  public constructor( model: KeplersLawsModel ) {
    this.trackingState = TrackingState.IDLE;

    const periodRangeProperty = new Property<Range>( new Range( 0, 1 ) );
    model.engine.periodProperty.link( period => {
      periodRangeProperty.value.max = period;
    } );

    this.fadingTimer = new Stopwatch( {
      position: Vector2.ZERO,
      timePropertyOptions: {
        range: new Range( 0, this.fadingLifetime )
      }
    } );

    this.periodTimer = new Stopwatch( {
      position: new Vector2( -50, -250 ),
      timePropertyOptions: {
        range: periodRangeProperty
      }
    } );
    this.periodTimer.isRunningProperty.link( isRunning => {
      if ( isRunning ) {
        this.trackingState = TrackingState.STARTED;
        this.beganPeriodTimerAt = model.timeProperty.value;
        model.engine.tracingPathProperty.value = true;
      }
      model.isPlayingProperty.value = isRunning;
    } );

    model.timeProperty.link( time => {
      if ( this.beganPeriodTimerAt > time ) {
        // Avoid negative times by resetting the timer
        this.beganPeriodTimerAt = time;
      }
      const measuredTime = time - this.beganPeriodTimerAt;
      if ( this.periodTimer.isRunningProperty.value ) {
        this.periodTimer.setTime( measuredTime );
      }
      if ( this.trackingState !== TrackingState.FADING && measuredTime >= periodRangeProperty.value.max - 0.01 ) {
        model.engine.tracingPathProperty.value = false;
        const diff = model.engine.retrograde ? 0.01 : -0.01;
        model.engine.periodTraceEnd = model.engine.periodTraceStart + 2 * Math.PI - diff;
        this.trackingState = TrackingState.FADING;
        this.fadingTimer.reset();
        this.fadingTimer.isRunningProperty.value = true;
      }
    } );
  }

  public step( dt: number ): void {
    if ( this.trackingState === TrackingState.FADING ) {
      this.fadingTimer.step( dt );
      this.fadingEmitter.emit();
      if ( !this.fadingTimer.isRunningProperty.value ) {
        this.trackingState = TrackingState.IDLE;
      }
    }
  }

  public reset(): void {
    this.periodTimer.reset();
    this.fadingTimer.reset();
    this.trackingState = TrackingState.IDLE;
  }
}

keplersLaws.register( 'PeriodPath', PeriodPath );