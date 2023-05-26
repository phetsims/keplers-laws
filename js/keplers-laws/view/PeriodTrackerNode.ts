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
  private periodPath: PeriodTracker;

  // Initial values for the ellipse
  public orbitScale = 1;
  public orbitCenter = Vector2.ZERO;
  public radiusX = 1;
  public radiusY = 1;

  public constructor( private readonly model: KeplersLawsModel ) {
    super( null, {
      stroke: SolarSystemCommonColors.thirdBodyColorProperty,
      lineWidth: 5,
      visibleProperty: model.periodVisibleProperty
    } );

    this.periodPath = model.periodPath;

    this.periodPath.fadingEmitter.addListener( () => {
      this.updateFade();
    } );

    this.model.engine.changedEmitter.addListener( () => {
      this.periodPath.reset();
      this.periodPath.periodTimer.timeProperty.set( 0 );
      this.updateShape();
    } );
  }

  public update( orbitScale: number, orbitCenter: Vector2, radiusX: number, radiusY: number ): void {
    this.orbitScale = orbitScale;
    this.orbitCenter = orbitCenter;
    this.radiusX = radiusX;
    this.radiusY = radiusY;

    if ( this.periodPath.trackingState === TrackingState.RUNNING ) {
      this.updateShape();
    }
  }

  public updateShape(): void {
    const retrograde = this.model.engine.retrograde;
    this.opacity = 1;
    const startTracePosition = this.model.engine.createPolar( this.model.engine.periodTraceStart ).times( this.orbitScale ).minus( this.orbitCenter );
    const endTracePosition = this.model.engine.createPolar( this.model.engine.periodTraceEnd ).times( this.orbitScale ).minus( this.orbitCenter );
    const startAngle = -Math.atan2( startTracePosition.y / this.radiusY, startTracePosition.x / this.radiusX );
    const endAngle = -Math.atan2( endTracePosition.y / this.radiusY, endTracePosition.x / this.radiusX );

    if ( this.periodPath.afterPeriodThreshold && (
      ( retrograde && this.model.engine.periodTraceEnd - this.model.engine.periodTraceStart <= Math.PI / 10 ) ||
      ( !retrograde && this.model.engine.periodTraceEnd - this.model.engine.periodTraceStart >= Math.PI / 10 ) ) ) {
      console.log( this.periodPath.afterPeriodThreshold, retrograde, this.model.engine.periodTraceEnd - this.model.engine.periodTraceStart );
      this.shape = new Shape().ellipse( 0, 0, this.radiusX, this.radiusY, 0 );
    }
    else {
      this.shape = new Shape().ellipticalArc( 0, 0, this.radiusX, this.radiusY, 0, startAngle, endAngle, retrograde );
    }
  }

  public updateFade(): void {
    this.opacity = 1 - this.periodPath.fadingTimer.timeProperty.value / this.periodPath.fadingLifetime;
  }
}

keplersLaws.register( 'PeriodTrackerNode', PeriodTrackerNode );
