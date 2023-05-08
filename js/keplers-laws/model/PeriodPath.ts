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
  public static readonly RUNNING = new TrackingState();
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

  public constructor( private readonly model: KeplersLawsModel ) {
    this.trackingState = TrackingState.IDLE;

    const periodRangeProperty = new Property<Range>( new Range( 0, 1 ) );
    this.model.engine.periodProperty.link( period => {
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
        this.trackingState = TrackingState.RUNNING;
        this.beganPeriodTimerAt = this.model.timeProperty.value;
        this.model.engine.tracingPathProperty.value = true;
      }
      this.model.isPlayingProperty.value = isRunning;
    } );

    // Begging fading with a diff between start and end angles
    const begginFade = ( diff: number ) => {
      this.periodTimer.isRunningProperty.value = false;
      this.model.engine.tracingPathProperty.value = false;
      this.model.engine.periodTraceEnd = this.model.engine.periodTraceStart + 2 * Math.PI - diff;
      this.trackingState = TrackingState.FADING;
      this.fadingTimer.reset();
      this.fadingTimer.isRunningProperty.value = true;
    };

    this.model.timeProperty.link( time => {
      if ( this.beganPeriodTimerAt > time ) {
        // Avoid negative times by resetting the timer
        this.beganPeriodTimerAt = time;
      }
      const measuredTime = time - this.beganPeriodTimerAt;
      if ( this.periodTimer.isRunningProperty.value ) {
        this.periodTimer.setTime( measuredTime );
      }

      if ( this.trackingState === TrackingState.RUNNING ) {
        // Angular difference between the actual ending spot and the threshold for beggining to fade
        const diff = 0.01;
        if ( measuredTime >= periodRangeProperty.value.max - 0.01 ) {
          begginFade( diff );
        }
        if ( measuredTime > periodRangeProperty.value.max / 2 ) {
          if ( this.model.engine.retrograde ) {
            if ( this.model.engine.periodTraceEnd > this.model.engine.periodTraceStart + 2 * Math.PI - diff ) {
              begginFade( diff );
            }
          }
          else {
            if ( this.model.engine.periodTraceEnd < this.model.engine.periodTraceStart + diff ) {
              begginFade( diff );
            }
          }
        }
      }
    } );

    this.model.engine.resetEmitter.addListener( () => {
      this.reset();
    } );
  }

  public step( dt: number ): void {
    if ( this.trackingState === TrackingState.FADING ) {
      this.fadingTimer.step( dt );
      this.fadingEmitter.emit();
      if ( !this.fadingTimer.isRunningProperty.value ) {
        this.reset();
      }
    }
  }

  public reset(): void {
    this.trackingState = TrackingState.IDLE;
    this.beganPeriodTimerAt = 0;
    this.periodTimer.reset();
    this.fadingTimer.reset();
    this.model.engine.tracingPathProperty.value = false;
    this.model.engine.periodTraceStart = 0;
    this.model.engine.periodTraceEnd = 0;
  }
}

keplersLaws.register( 'PeriodPath', PeriodPath );