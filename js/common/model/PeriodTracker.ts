// Copyright 2023-2024, University of Colorado Boulder
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
import Emitter from '../../../../axon/js/Emitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import EllipticalOrbitEngine from './EllipticalOrbitEngine.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EnumerationProperty } from '../../../../axon/js/imports.js';

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
  public periodTimerStartTimeProperty: NumberProperty;
  public trackingStateProperty: EnumerationProperty<TrackingState>;
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

  public constructor( private readonly engine: EllipticalOrbitEngine,
                      private readonly timeProperty: TReadOnlyProperty<number>,
                      tandem: Tandem ) {

    this.trackingStateProperty = new EnumerationProperty( TrackingState.IDLE, {
      tandem: tandem.createTandem( 'trackingStateProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );

    this.periodTimerStartTimeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'periodTimerStartTimeProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.tracingPathProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'tracingPathProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );
    this.periodTraceStartProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'periodTraceStartProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );
    this.periodTraceEndProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'periodTraceEndProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );

    this.tracingPathProperty.lazyLink( tracing => {
      if ( tracing ) {
        // Sets the beginning of the period trace to the planet's current angular position
        this.periodTraceStartProperty.value = this.engine.nu;
      }
    } );

    const periodRangeProperty = new Property<Range>( new Range( 0, 1 ), {
      tandem: tandem.createTandem( 'periodRangeProperty' ),
      phetioValueType: Range.RangeIO,
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );

    this.engine.periodProperty.link( period => {
      periodRangeProperty.value.max = period;
    } );

    this.fadingStopwatch = new Stopwatch( {
      position: Vector2.ZERO,
      timePropertyOptions: {
        range: new Range( 0, this.fadingDuration )
      },
      tandem: tandem.createTandem( 'fadingStopwatch' ),
      phetioDocumentation: 'For internal use only.',
      phetioFeatured: false,
      phetioReadOnly: true
    } );

    this.periodStopwatch = new Stopwatch( {
      position: new Vector2( 500, 50 ),
      timePropertyOptions: {
        range: periodRangeProperty
      },
      tandem: tandem.createTandem( 'periodStopwatch' ),
      phetioDocumentation: 'For internal use only.'
    } );
    this.periodStopwatch.isRunningProperty.link( isRunning => {
      if ( isRunning ) {
        this.trackingStateProperty.value = TrackingState.RUNNING;
        this.periodTimerStartTimeProperty.value = this.timeProperty.value;
      }
      else if ( this.trackingStateProperty.value !== TrackingState.FADING ) {
        // If the period track is not fading and it's stopped, softReset the period timer
        this.softReset();
        this.periodStopwatch.timeProperty.value = 0;
      }
      this.tracingPathProperty.value = isRunning;
    } );

    // Begging fading with a diff between start and end angles
    const beginFade = () => {
      this.tracingPathProperty.value = false;
      this.trackingStateProperty.value = TrackingState.FADING;
      this.fadingStopwatch.reset();
      this.fadingStopwatch.isRunningProperty.value = true;
    };

    this.timeProperty.link( time => {
      if ( this.trackingStateProperty.value === TrackingState.RUNNING ) {
        if ( this.periodTimerStartTimeProperty.value > time ) {
          // Avoid negative times by softResetting the timer
          this.periodTimerStartTimeProperty.value = time;
        }
        const measuredTime = time - this.periodTimerStartTimeProperty.value;
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
    if ( this.trackingStateProperty.value === TrackingState.FADING ) {
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
    this.trackingStateProperty.value = TrackingState.IDLE;
    this.periodTimerStartTimeProperty.value = 0;
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