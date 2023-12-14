// Copyright 2023, University of Colorado Boulder
/**
 * Visual representation of the period blue track line
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { Path } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { Shape } from '../../../../kite/js/imports.js';
import PeriodTracker, { TrackingState } from '../model/PeriodTracker.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class PeriodTrackerNode extends Path {
  private readonly periodTracker: PeriodTracker;

  // Initial values for the ellipse
  public orbitScale = 1;
  public orbitCenter = Vector2.ZERO;
  public radiusX = 1;
  public radiusY = 1;

  // Circle that marks the start of the period
  public readonly startCircle: Path;

  public constructor( private readonly model: Pick<KeplersLawsModel, 'engine' | 'periodTracker'>, periodVisibleProperty: TReadOnlyProperty<boolean> ) {
    super( null, {
      isDisposable: false,
      stroke: KeplersLawsColors.timeDisplayBackgroundColorProperty,
      lineWidth: 5,
      visibleProperty: periodVisibleProperty
    } );

    this.periodTracker = model.periodTracker; // This object contains stopwatches for the timer and the fading effect

    this.periodTracker.fadingEmitter.addListener( () => {
      this.updateFade();
    } );

    this.periodTracker.periodStopwatch.isRunningProperty.lazyLink( isRunning => {
      if ( isRunning ) {
        this.periodTracker.periodTraceEndProperty.value = this.periodTracker.periodTraceStartProperty.value;
        this.updateShape();
      }
    } );

    this.model.engine.changedEmitter.addListener( () => {
      this.periodTracker.softReset();
      this.periodTracker.timerReset();
      this.updateShape();
    } );

    this.startCircle = new Path( Shape.circle( 0, 0, 6 ), {
      fill: KeplersLawsColors.timeDisplayBackgroundColorProperty,
      visible: false
    } );
    this.addChild( this.startCircle );
  }

  public update( orbitScale: number, orbitCenter: Vector2, radiusX: number, radiusY: number ): void {
    this.orbitScale = orbitScale;
    this.orbitCenter = orbitCenter;
    this.radiusX = radiusX;
    this.radiusY = radiusY;

    if ( this.periodTracker.trackingState === TrackingState.RUNNING ) {
      this.updateShape();
    }
  }

  public updateShape(): void {
    this.opacity = 1;
    const startTracePosition = this.model.engine.createPolar( -this.periodTracker.periodTraceStartProperty.value ).times( this.orbitScale ).minus( this.orbitCenter );
    const endTracePosition = this.model.engine.createPolar( -this.periodTracker.periodTraceEndProperty.value ).times( this.orbitScale ).minus( this.orbitCenter );
    const startAngle = Math.atan2( startTracePosition.y / this.radiusY, startTracePosition.x / this.radiusX );
    const endAngle = Math.atan2( endTracePosition.y / this.radiusY, endTracePosition.x / this.radiusX );

    const retrograde = this.model.engine.retrograde;
    const angleDiff = this.periodTracker.periodTraceEndProperty.value - this.periodTracker.periodTraceStartProperty.value;
    const angleThreshold = Math.PI / 10;
    if ( this.periodTracker.afterPeriodThreshold && (
      ( retrograde && angleDiff <= angleThreshold ) ||
      ( !retrograde && angleDiff >= 2 * Math.PI - angleThreshold ) ) ) {
      this.shape = new Shape().ellipse( 0, 0, this.radiusX, this.radiusY, 0 );
    }
    else {
      this.shape = new Shape().ellipticalArc( 0, 0, this.radiusX, this.radiusY, 0, startAngle, endAngle, retrograde );
    }
    this.startCircle.translation = startTracePosition;
    this.startCircle.visible = startAngle !== endAngle || this.periodTracker.periodStopwatch.isRunningProperty.value;
  }

  private updateFade(): void {
    this.shape = new Shape().ellipse( 0, 0, this.radiusX, this.radiusY, 0 );
    this.opacity = 1 - this.periodTracker.fadingStopwatch.timeProperty.value / this.periodTracker.fadingDuration;
  }
}

keplersLaws.register( 'PeriodTrackerNode', PeriodTrackerNode );
