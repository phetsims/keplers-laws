// Copyright 2023-2026, University of Colorado Boulder

/**
 * EnumerationValue to keep track of the Law that's currently selected
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export default class OrbitTypes extends EnumerationValue {
  public static readonly STABLE_ORBIT = new OrbitTypes();
  public static readonly ESCAPE_ORBIT = new OrbitTypes();
  public static readonly CRASH_ORBIT = new OrbitTypes();

  public static readonly enumeration = new Enumeration( OrbitTypes );
}
