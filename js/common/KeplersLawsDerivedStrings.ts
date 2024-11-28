// Copyright 2023-2024, University of Colorado Boulder

import DerivedStringProperty from '../../../axon/js/DerivedStringProperty.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import keplersLaws from '../keplersLaws.js';
import KeplersLawsStrings from '../KeplersLawsStrings.js';

/**
 * Derived strings used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const KeplersLawsDerivedStrings = {

  AU2StringProperty: new DerivedStringProperty( [ KeplersLawsStrings.units.AUStringProperty ],
    AU => `${AU}<sup>2</sup>` ),

  AU3StringProperty: new DerivedStringProperty( [ KeplersLawsStrings.units.AUStringProperty ],
    AU => `${AU}<sup>3</sup>` ),

  a2StringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.aStringProperty ],
    a => `${a}<sup>2</sup>` ),

  a3StringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.aStringProperty ],
    a => `${a}<sup>3</sup>` ),

  d1StringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.dStringProperty ],
    d => `${d}<sub>1</sub>` ),

  d2StringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.dStringProperty ],
    d => `${d}<sub>2</sub>` ),

  T2StringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.TStringProperty ],
    T => `${T}<sup>2</sup>` ),

  T3StringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.TStringProperty ],
    T => `${T}<sup>3</sup>` ),

  rMagnitudeStringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.rStringProperty ],
    r => `|${r}|` ),

  vMagnitudeStringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.vStringProperty ],
    v => `|${v}|` ),

  rAngleStringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.rStringProperty ],
    r => `${MathSymbols.THETA}<sub>${r}</sub>` ),

  vAngleStringProperty: new DerivedStringProperty( [ KeplersLawsStrings.symbol.vStringProperty ],
    v => `${MathSymbols.THETA}<sub>${v}</sub>` ),

  rvAngleStringProperty: new DerivedStringProperty(
    [ KeplersLawsStrings.symbol.rStringProperty, KeplersLawsStrings.symbol.vStringProperty ],
    ( r, v ) => `${MathSymbols.THETA}<sub>${r}${v}</sub>` )
};

keplersLaws.register( 'KeplersLawsDerivedStrings', KeplersLawsDerivedStrings );
export default KeplersLawsDerivedStrings;