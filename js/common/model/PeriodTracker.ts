// Copyright 2023, University of Colorado Boulder
/**
 * Keeps track of the state of the blue line tracking the body when the PeriodTimerNode is set to run.
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
  public static readonly RUNNING = new TrackingState();
  public static readonly FADING = new TrackingState();
  public static readonly INVISIBLE = new TrackingState();

  public static readonly enumeration = new Enumeration( TrackingState, {
    phetioDocumentation: 'In what state the line of the period track is at'
  } );
}

export default class PeriodTracker {
  public beganPeriodTimerAt = 0;
  public trackingState: TrackingState;
  public afterPeriodThreshold = false; // Whether the body has passed some percentage of the period
  public readonly periodTimer: Stopwatch;
  public readonly fadingTimer: Stopwatch;

  // This emitter tells the PeriodTrackerNode when to update the fade
  public readonly fadingEmitter = new Emitter();

  public readonly fadingDuration = 3;

  public constructor( private readonly model: Pick<KeplersLawsModel, 'engine' | 'timeProperty' | 'isPlayingProperty'> ) {
    this.trackingState = TrackingState.IDLE;

    const periodRangeProperty = new Property<Range>( new Range( 0, 1 ) );
    this.model.engine.periodProperty.link( period => {
      periodRangeProperty.value.max = period;
    } );

    this.fadingTimer = new Stopwatch( {
      position: Vector2.ZERO,
      timePropertyOptions: {
        range: new Range( 0, this.fadingDuration )
      }
    } );

    this.periodTimer = new Stopwatch( {
      position: new Vector2( 500, 50 ),
      timePropertyOptions: {
        range: periodRangeProperty
      }
    } );
    this.periodTimer.isRunningProperty.link( isRunning => {
      if ( isRunning ) {
        this.trackingState = TrackingState.RUNNING;
        this.beganPeriodTimerAt = this.model.timeProperty.value;
      }
      else if ( this.trackingState !== TrackingState.FADING ) {
        // If the period track is not fading and it's stopped, softReset the period timer
        this.softReset();
        this.periodTimer.timeProperty.set( 0 );
      }
      this.model.engine.tracingPathProperty.value = isRunning;
    } );

    // Begging fading with a diff between start and end angles
    const beginFade = () => {
      this.model.engine.tracingPathProperty.value = false;
      this.trackingState = TrackingState.FADING;
      this.fadingTimer.reset();
      this.fadingTimer.isRunningProperty.value = true;
    };

    this.model.timeProperty.link( time => {
      if ( this.trackingState === TrackingState.RUNNING ) {
        if ( this.beganPeriodTimerAt > time ) {
          // Avoid negative times by softResetting the timer
          this.beganPeriodTimerAt = time;
        }
        const measuredTime = time - this.beganPeriodTimerAt;
        this.afterPeriodThreshold = measuredTime > periodRangeProperty.value.max * 0.8;
        if ( this.periodTimer.isRunningProperty.value ) {
          if ( measuredTime >= periodRangeProperty.value.max ) {
            beginFade();
          }
          this.periodTimer.setTime( measuredTime );
        }
      }
    } );
  }

  public step( dt: number ): void {
    if ( this.trackingState === TrackingState.FADING ) {
      this.fadingTimer.step( dt );
      this.fadingEmitter.emit();
      if ( !this.fadingTimer.isRunningProperty.value ) {
        this.softReset();
      }
    }
  }

  public softReset(): void {
    // Reset everything but the period timer. We want the time readout to stay most times
    this.trackingState = TrackingState.IDLE;
    this.beganPeriodTimerAt = 0;
    this.fadingTimer.reset();
    this.afterPeriodThreshold = false;
    this.model.engine.tracingPathProperty.value = false;
    this.model.engine.periodTraceStart = 0;
    this.model.engine.periodTraceEnd = 0;
  }

  public reset(): void {
    // Reset everything including the position of the period timer
    this.softReset();
    this.periodTimer.positionProperty.reset();
  }
}

keplersLaws.register( 'PeriodTracker', PeriodTracker );