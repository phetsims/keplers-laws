// Copyright 2023, University of Colorado Boulder

/**
 * Class for handling special text cases in the Third Law.
 * i.e. for placing the correct powers on symbols and units, depending on the value of the power.
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import keplersLaws from '../../keplersLaws.js';

export default class ThirdLawTextUtils {
  public static createPowerStringProperty( unitStringProperty: TReadOnlyProperty<string>, powerStringProperty: TReadOnlyProperty<number>, conditionalProperty: TReadOnlyProperty<boolean> ): TReadOnlyProperty<string> {
    return new DerivedProperty( [ unitStringProperty, powerStringProperty, SolarSystemCommonStrings.pattern.unitsPowerStringProperty, conditionalProperty ], ( string, power, pattern, conditional ) => {
      if ( !conditional ) {
        return '';
      }
      else {
        if ( power === 1 ) {
          return string;
        }
        else {
          return StringUtils.fillIn( pattern, {
            units: string,
            power: power
          } );
        }
      }
    } );
  }
}

keplersLaws.register( 'ThirdLawTextUtils', ThirdLawTextUtils );