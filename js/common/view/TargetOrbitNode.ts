// Copyright 2023-2024, University of Colorado Boulder
/**
 * The elliptical shape for the target orbit
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import TargetOrbit from '../model/TargetOrbit.js';

type SelfOptions = EmptySelfOptions;

type TargetOrbitNodeOptions = SelfOptions & PathOptions;

export default class TargetOrbitNode extends Path {
  public constructor(
    private readonly targetOrbitProperty: TReadOnlyProperty<TargetOrbit>,
    private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: TargetOrbitNodeOptions
  ) {
    const options = optionize<TargetOrbitNodeOptions, SelfOptions, PathOptions>()( {
      isDisposable: false,
      stroke: KeplersLawsColors.targetOrbitColorProperty,
      lineWidth: 3
      // lineDash: [ 5, 5 ]
    }, providedOptions );

    super( null, options );

    Multilink.multilink( [ this.targetOrbitProperty, this.modelViewTransformProperty ], () => this.updateShape() );
  }

  private updateShape(): void {
    const targetOrbit = this.targetOrbitProperty.value;
    if ( targetOrbit === TargetOrbit.NONE ) {
      this.shape = null;
    }
    else {
      this.translation = this.modelViewTransformProperty.value.modelToViewPosition( Vector2.ZERO );
      const scale = this.modelViewTransformProperty.value.modelToViewDeltaX( 1 );
      const a = scale * this.targetOrbitProperty.value.semiMajorAxis;
      const e = this.targetOrbitProperty.value.eccentricity;
      const b = a * Math.sqrt( 1 - e * e );
      this.shape = new Shape().ellipse( new Vector2( -a * e, 0 ), a, b, 0 );
    }
  }
}

keplersLaws.register( 'TargetOrbitNode', TargetOrbitNode );