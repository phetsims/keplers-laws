// Copyright 2023, University of Colorado Boulder

/**
 * A combination of a Rich Text node and a Number Display node.
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import keplersLaws from '../../keplersLaws.js';

export default class ThirdLawTextUtils {
  public static createPowerStringProperty( unitStringProperty: TReadOnlyProperty<string>, powerStringProperty: TReadOnlyProperty<number> ): TReadOnlyProperty<string> {
    return new DerivedProperty( [ unitStringProperty, powerStringProperty, SolarSystemCommonStrings.pattern.unitsPowerStringProperty ], ( string, power, pattern ) => {
      if ( power === 1 ) {
        return string;
      }
      else {
        return StringUtils.fillIn( pattern, {
          units: string,
          power: power
        } );
      }
    } );
  }
}

keplersLaws.register( 'ThirdLawTextUtils', ThirdLawTextUtils );