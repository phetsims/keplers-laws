// Copyright 2023, University of Colorado Boulder
/**
 * EnumerationValue of the different types of orbits that can be selected and shown
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class TargetOrbits extends EnumerationValue {
  public static readonly NONE = new TargetOrbits( 0, 0, KeplersLawsStrings.noneStringProperty );
  public static readonly MERCURY = new TargetOrbits( 0.2056, 0.4, KeplersLawsStrings.orbit.mercuryStringProperty );
  public static readonly VENUS = new TargetOrbits( 0.0068, 0.7, KeplersLawsStrings.orbit.venusStringProperty );
  public static readonly EARTH = new TargetOrbits( 0.0167, 1.0, KeplersLawsStrings.orbit.earthStringProperty );
  public static readonly MARS = new TargetOrbits( 0.0934, 1.5, KeplersLawsStrings.orbit.marsStringProperty );
  public static readonly JUPITER = new TargetOrbits( 0.0484, 5.2, KeplersLawsStrings.orbit.jupiterStringProperty );
  public static readonly ERIS = new TargetOrbits( 0.44, 67.6, KeplersLawsStrings.orbit.erisStringProperty );
  public static readonly NEREID = new TargetOrbits( 0.75, 30.11, KeplersLawsStrings.orbit.nereidStringProperty );
  public static readonly HALLEY = new TargetOrbits( 0.967, 18.5, KeplersLawsStrings.orbit.halleyStringProperty );

  public static readonly enumeration = new Enumeration( TargetOrbits );

  public constructor(
    public readonly eccentricity: number,
    public readonly semiMajorAxis: number,
    public readonly stringProperty: TReadOnlyProperty<string> // The text that contains the name of the orbit
  ) {
    super();
  }
}

keplersLaws.register( 'TargetOrbits', TargetOrbits );