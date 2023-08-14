// Copyright 2023, University of Colorado Boulder
/**
 * Visual representation of the period blue track line
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { Path } from '../../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { Shape } from '../../../../kite/js/imports.js';
import PeriodTracker, { TrackingState } from '../model/PeriodTracker.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class PeriodTrackerNode extends Path {
  private periodTracker: PeriodTracker;

  // Initial values for the ellipse
  public orbitScale = 1;
  public orbitCenter = Vector2.ZERO;
  public radiusX = 1;
  public radiusY = 1;

  public startCircle: Path;

  public constructor( private readonly model: KeplersLawsModel ) {
    super( null, {
      stroke: SolarSystemCommonColors.thirdBodyColorProperty,
      lineWidth: 5,
      visibleProperty: model.periodVisibleProperty
    } );

    this.periodTracker = model.periodTracker;

    this.periodTracker.fadingEmitter.addListener( () => {
      this.updateFade();
    } );

    this.periodTracker.periodTimer.isRunningProperty.lazyLink( isRunning => {
      if ( isRunning ) {
        this.model.engine.periodTraceEnd = this.model.engine.periodTraceStart;
        this.updateShape();
      }
    } );

    this.model.engine.changedEmitter.addListener( () => {
      this.periodTracker.reset();
      this.periodTracker.periodTimer.timeProperty.set( 0 );
      this.periodTracker.periodTimer.isRunningProperty.value = false;
      this.updateShape();
    } );

    this.startCircle = new Path( Shape.circle( 0, 0, 10 ), {
      fill: SolarSystemCommonColors.thirdBodyColorProperty
    } );
    this.addChild( this.startCircle ); // TODO: Are we keeping this?
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
    const startTracePosition = this.model.engine.createPolar( -this.model.engine.periodTraceStart ).times( this.orbitScale ).minus( this.orbitCenter );
    const endTracePosition = this.model.engine.createPolar( -this.model.engine.periodTraceEnd ).times( this.orbitScale ).minus( this.orbitCenter );
    const startAngle = Math.atan2( startTracePosition.y / this.radiusY, startTracePosition.x / this.radiusX );
    const endAngle = Math.atan2( endTracePosition.y / this.radiusY, endTracePosition.x / this.radiusX );

    const retrograde = this.model.engine.retrograde;
    const angleDiff = this.model.engine.periodTraceEnd - this.model.engine.periodTraceStart;
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
    this.startCircle.visible = startAngle !== endAngle || this.periodTracker.periodTimer.isRunningProperty.value;
  }

  public updateFade(): void {
    this.shape = new Shape().ellipse( 0, 0, this.radiusX, this.radiusY, 0 );
    this.opacity = 1 - this.periodTracker.fadingTimer.timeProperty.value / this.periodTracker.fadingDuration;
  }
}

keplersLaws.register( 'PeriodTrackerNode', PeriodTrackerNode );
