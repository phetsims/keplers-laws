// Copyright 2023, University of Colorado Boulder

/**
 * This source file implements the "client-configurable presets" feature for PhET-iO. A preset is a configuration of
 * a target orbit that is typically immutable.  This feature allows a few specific presets to be modified via PHET-iO
 * (and only via PhET-iO) so that PhET-iO clients can create presets for their products.
 *
 * See https://github.com/phetsims/keplers-laws/issues/210 for requirements, design, and history.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TargetOrbit from './TargetOrbit.js';
import keplersLaws from '../../keplersLaws.js';

type TargetOrbitInfoStateObject = {
  eccentricity: number;
  semiMajorAxis: number;
};

/**
 * TargetOrbitInfo is the subset of fields that are needed to customize a TargetOrbit.
 */
class TargetOrbitInfo {

  public readonly eccentricity: number;
  public readonly semiMajorAxis: number;

  public constructor( eccentricity: number, semiMajorAxis: number ) {
    this.eccentricity = eccentricity;
    this.semiMajorAxis = semiMajorAxis;
  }

  /**
   * Deserialization: JSON => TargetOrbitInfo
   */
  private static fromStateObject( stateObject: TargetOrbitInfoStateObject ): TargetOrbitInfo {
    return new TargetOrbitInfo( stateObject.eccentricity, stateObject.semiMajorAxis );
  }

  /**
   * TargetOrbitInfoIO implements 'Data type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Data type serialization is appropriate because TargetOrbitInfo is a data type for a Property.
   */
  public static readonly TargetOrbitInfoIO = new IOType<TargetOrbitInfo, TargetOrbitInfoStateObject>( 'TargetOrbitInfoIO', {
    valueType: TargetOrbitInfo,
    stateSchema: {
      eccentricity: NumberIO,
      semiMajorAxis: NumberIO
    },
    // toStateObject: The default works fine here.
    fromStateObject: stateObject => TargetOrbitInfo.fromStateObject( stateObject )
  } );
}

/**
 * TargetOrbitInfoProperty is a Property whose value is used to customize an associated TargetOrbit preset.
 * When the Property's value changes, the TargetOrbit is modified.
 */
export default class TargetOrbitInfoProperty extends Property<TargetOrbitInfo> {

  // TargetOrbit enumeration value that this Property will modify.
  public readonly targetOrbit: TargetOrbit;

  public constructor( targetOrbit: TargetOrbit, tandem: Tandem ) {

    super( new TargetOrbitInfo( targetOrbit.eccentricity, targetOrbit.semiMajorAxis ), {
      isValidValue: targetOrbitInfo => ( targetOrbitInfo.eccentricity >= 0 && targetOrbitInfo.eccentricity < 1 ),
      tandem: tandem,
      phetioValueType: TargetOrbitInfo.TargetOrbitInfoIO,
      phetioDocumentation: 'Client-configurable preset for Target Orbit, available only via PhET-iO',
      phetioFeatured: true
    } );

    this.targetOrbit = targetOrbit;

    this.lazyLink( targetOrbitInfo => {

      // Update the targetOrbit with the new values.
      targetOrbit.eccentricity = targetOrbitInfo.eccentricity;
      targetOrbit.semiMajorAxis = targetOrbitInfo.semiMajorAxis;
    } );
  }
}

keplersLaws.register( 'TargetOrbitInfoProperty', TargetOrbitInfoProperty );