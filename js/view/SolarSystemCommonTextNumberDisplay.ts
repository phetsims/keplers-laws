// Copyright 2023, University of Colorado Boulder

/**
 * A combination of a Rich Text node and a Number Display node.
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize3 } from '../../../phet-core/js/optionize.js';
import Range from '../../../dot/js/Range.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../scenery-phet/js/NumberDisplay.js';
import SolarSystemCommonConstants from '../SolarSystemCommonConstants.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import SolarSystemCommonStrings from '../../../solar-system-common/js/SolarSystemCommonStrings.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import solarSystemCommon from '../solarSystemCommon.js';

export default class SolarSystemCommonTextNumberDisplay extends NumberDisplay {
  //REVIEW: Ummm... I don't see this constructor ever getting used. Can we remove it, and not extend NumberDisplay?
  //REVIEW: Perhaps we can just move combinePowerString to somewhere else common, and remove this file?
  public constructor( numberProperty: TReadOnlyProperty<number | null>, displayRange: Range, providedOptions?: NumberDisplayOptions ) {
    super(
      numberProperty,
      displayRange,
      optionize3<NumberDisplayOptions, EmptySelfOptions, NumberDisplayOptions>()( {}, {
        backgroundFill: null,
        backgroundStroke: null,
        textOptions: SolarSystemCommonConstants.TEXT_OPTIONS,
        decimalPlaces: 1,
        useRichText: true,

        //REVIEW: layoutOptions like this should be provided at the client usage. It's not great to hardcode client uses
        //REVIEW: in the type itself. Let's move this to the client!
        layoutOptions: {
          align: 'left'
        }
      }, providedOptions )
    );
  }

  public static combinePowerString( unitStringProperty: TReadOnlyProperty<string>, powerStringProperty: TReadOnlyProperty<number> ): TReadOnlyProperty<string> {
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

solarSystemCommon.register( 'SolarSystemCommonTextNumberDisplay', SolarSystemCommonTextNumberDisplay );