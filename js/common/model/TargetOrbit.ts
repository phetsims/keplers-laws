// Copyright 2023-2024, University of Colorado Boulder

/**
 * EnumerationValue of the different types of orbits that can be selected and shown
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

export default class TargetOrbit extends EnumerationValue {

  // Presets that appear in TargetOrbitComboBox by default
  public static readonly NONE = new TargetOrbit( 0, 0, KeplersLawsStrings.noneStringProperty, 'noneOrbitItem' );
  public static readonly MERCURY = new TargetOrbit( 0.2056, 0.4, KeplersLawsStrings.orbit.mercuryStringProperty, 'mercuryOrbitItem' );
  public static readonly VENUS = new TargetOrbit( 0.0068, 0.7, KeplersLawsStrings.orbit.venusStringProperty, 'venusOrbitItem' );
  public static readonly EARTH = new TargetOrbit( 0.0167, 1.0, KeplersLawsStrings.orbit.earthStringProperty, 'earthOrbitItem' );
  public static readonly MARS = new TargetOrbit( 0.0934, 1.5, KeplersLawsStrings.orbit.marsStringProperty, 'marsOrbitItem' );
  public static readonly JUPITER = new TargetOrbit( 0.0484, 5.2, KeplersLawsStrings.orbit.jupiterStringProperty, 'jupiterOrbitItem' );

  // Not used for TargetOrbitComboBox or targetOrbitProperty, used for EccentricityPanel
  public static readonly ERIS = new TargetOrbit( 0.44, 67.6, KeplersLawsStrings.orbit.erisStringProperty, 'erisOrbitItem' );
  public static readonly NEREID = new TargetOrbit( 0.75, 30.11, KeplersLawsStrings.orbit.nereidStringProperty, 'nereidOrbitItem' );
  public static readonly HALLEY = new TargetOrbit( 0.967, 18.5, KeplersLawsStrings.orbit.halleyStringProperty, 'halleyOrbitItem' );

  // PhET-iO client-configurable presets, which can be viewed and customized only via PhET-iO
  public static readonly TARGET_ORBIT_1 = new TargetOrbit( 0.0, 1.0, KeplersLawsStrings.orbit.targetOrbit1StringProperty, 'targetOrbit1Item', true );
  public static readonly TARGET_ORBIT_2 = new TargetOrbit( 0.0, 1.0, KeplersLawsStrings.orbit.targetOrbit2StringProperty, 'targetOrbit2Item', true );
  public static readonly TARGET_ORBIT_3 = new TargetOrbit( 0.0, 1.0, KeplersLawsStrings.orbit.targetOrbit3StringProperty, 'targetOrbit3Item', true );
  public static readonly TARGET_ORBIT_4 = new TargetOrbit( 0.0, 1.0, KeplersLawsStrings.orbit.targetOrbit4StringProperty, 'targetOrbit4Item', true );

  public static readonly enumeration = new Enumeration( TargetOrbit );

  public constructor(
    public eccentricity: number,
    public semiMajorAxis: number,
    public readonly nameProperty: TReadOnlyProperty<string>, // The text that contains the name of the orbit
    public readonly tandemName: string,
    public readonly isPhetioConfigurable = false
  ) {
    super();
  }
}

keplersLaws.register( 'TargetOrbit', TargetOrbit );