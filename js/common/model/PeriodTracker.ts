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
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

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
  public readonly periodStopwatch: Stopwatch;
  public readonly fadingStopwatch: Stopwatch;

  // These variables keep track of the period trace on Third Law (When the user measures period, a blue line will be traced)
  public readonly tracingPathProperty: BooleanProperty;
  public periodTraceStartProperty: NumberProperty;
  public periodTraceEndProperty: NumberProperty;

  // This emitter tells the PeriodTrackerNode when to update the fade
  public readonly fadingEmitter = new Emitter();

  public readonly fadingDuration = 3;

  public constructor( private readonly model: Pick<KeplersLawsModel, 'engine' | 'timeProperty'>, tandem: Tandem ) {

    // Setting the engine's period tracker to this object here to avoid circular dependencies
    this.model.engine.periodTracker = this;

    this.trackingState = TrackingState.IDLE;

    this.tracingPathProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'tracingPathProperty' ),
      phetioReadOnly: true
    } );
    this.periodTraceStartProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'periodTraceStartProperty' ),
      phetioReadOnly: true
    } );
    this.periodTraceEndProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'periodTraceEndProperty' ),
      phetioReadOnly: true
    } );

    this.tracingPathProperty.lazyLink( tracing => {
      if ( tracing ) {
        // Sets the beginning of the period trace to the planet's current angular position
        this.periodTraceStartProperty.value = this.model.engine.nu;
      }
    } );

    const periodRangeProperty = new Property<Range>( new Range( 0, 1 ), {
      tandem: tandem.createTandem( 'periodRangeProperty' ),
      phetioValueType: Range.RangeIO,
      phetioReadOnly: true
    } );

    this.model.engine.periodProperty.link( period => {
      periodRangeProperty.value.max = period;
    } );

    this.fadingStopwatch = new Stopwatch( {
      position: Vector2.ZERO,
      timePropertyOptions: {
        range: new Range( 0, this.fadingDuration )
      },
      tandem: tandem.createTandem( 'fadingStopwatch' )
    } );

    this.periodStopwatch = new Stopwatch( {
      position: new Vector2( 500, 50 ),
      timePropertyOptions: {
        range: periodRangeProperty
      },
      tandem: tandem.createTandem( 'periodStopwatch' )
    } );
    this.periodStopwatch.isRunningProperty.link( isRunning => {
      if ( isRunning ) {
        this.trackingState = TrackingState.RUNNING;
        this.beganPeriodTimerAt = this.model.timeProperty.value;
      }
      else if ( this.trackingState !== TrackingState.FADING ) {
        // If the period track is not fading and it's stopped, softReset the period timer
        this.softReset();
        this.periodStopwatch.timeProperty.value = 0;
      }
      this.tracingPathProperty.value = isRunning;
    } );

    // Begging fading with a diff between start and end angles
    const beginFade = () => {
      this.tracingPathProperty.value = false;
      this.trackingState = TrackingState.FADING;
      this.fadingStopwatch.reset();
      this.fadingStopwatch.isRunningProperty.value = true;
    };

    this.model.timeProperty.link( time => {
      if ( this.trackingState === TrackingState.RUNNING ) {
        if ( this.beganPeriodTimerAt > time ) {
          // Avoid negative times by softResetting the timer
          this.beganPeriodTimerAt = time;
        }
        const measuredTime = time - this.beganPeriodTimerAt;
        this.afterPeriodThreshold = measuredTime > periodRangeProperty.value.max * 0.8;
        if ( this.periodStopwatch.isRunningProperty.value ) {
          if ( measuredTime >= periodRangeProperty.value.max ) {
            beginFade();
          }
          this.periodStopwatch.setTime( measuredTime );
        }
      }
    } );
  }

  public step( dt: number ): void {
    if ( this.trackingState === TrackingState.FADING ) {
      this.fadingStopwatch.step( dt );
      this.fadingEmitter.emit();
      if ( !this.fadingStopwatch.isRunningProperty.value ) {
        this.softReset();
      }
    }
  }

  public timerReset(): void {
    // Reset the period timer but keep the period trace
    this.periodStopwatch.isRunningProperty.value = false;
    this.periodStopwatch.setTime( 0 );
  }

  public softReset(): void {
    // Reset everything but the period timer. We want the time readout to stay most times
    this.trackingState = TrackingState.IDLE;
    this.beganPeriodTimerAt = 0;
    this.fadingStopwatch.reset();
    this.afterPeriodThreshold = false;
    this.tracingPathProperty.value = false;
    this.periodTraceStartProperty.value = 0;
    this.periodTraceEndProperty.value = 0;
  }

  public reset(): void {
    // Reset everything including the position of the period timer
    this.softReset();
    this.periodStopwatch.reset();
  }
}

keplersLaws.register( 'PeriodTracker', PeriodTracker );