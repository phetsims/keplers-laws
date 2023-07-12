// Copyright 2023, University of Colorado Boulder
/**
 * The elliptical shape for the target orbit
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import TargetOrbits from '../model/TargetOrbits.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class TargetOrbitNode extends Path {
  public constructor(
    private readonly targetOrbitProperty: TReadOnlyProperty<TargetOrbits>,
    private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>
    ) {
    const options = {
      stroke: 'white',
      lineWidth: 3
      // lineDash: [ 5, 5 ]
    };

    super( null, options );

    Multilink.multilink( [ this.targetOrbitProperty, this.modelViewTransformProperty ], () => this.updateShape() );
  }

  private updateShape(): void {
    const targetOrbit = this.targetOrbitProperty.value;
    if ( targetOrbit === TargetOrbits.NONE ) {
      this.shape = null;
    }
    else {
      this.stroke = targetOrbit.color;
      this.translation = this.modelViewTransformProperty.value.modelToViewPosition( Vector2.ZERO );
      const scale = this.modelViewTransformProperty.value.modelToViewDeltaX( 1 );
      const a = 100 * scale * this.targetOrbitProperty.value.semiMajorAxis;
      const e = this.targetOrbitProperty.value.eccentricity;
      const b = a * Math.sqrt( 1 - e * e );
      this.shape = new Shape().ellipse( new Vector2( -a * e, 0 ), a, b, 0 );
    }
  }
}

keplersLaws.register( 'TargetOrbitNode', TargetOrbitNode );