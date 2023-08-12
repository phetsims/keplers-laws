// Copyright 2023, University of Colorado Boulder

/**
 * A simple warning that appears when the user tries to make a forbidden orbit.
 *
 * @author Agustín Vallejo
 */

import { Node, RichText, TextOptions } from '../../../../scenery/js/imports.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import OrbitTypes from '../model/OrbitTypes.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import Multilink from '../../../../axon/js/Multilink.js';
import keplersLaws from '../../keplersLaws.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class OrbitalWarningMessage extends Node {

  public constructor( orbitTypeProperty: TReadOnlyProperty<OrbitTypes>,
                      allowedOrbitProperty: TReadOnlyProperty<boolean>,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {

    const center = modelViewTransformProperty.value.modelToViewPosition( new Vector2( 0, -50 ) );

    //REVIEW: Why a local variable for this?
    //REVIEW: Please create a DerivedProperty<string> for this, and then pass that to the RichText constructor 1st param
    //REVIEW: instead of the multilink that is used.
    //REVIEW: no need for `message` variable
    let message = '';
    const warningText = new RichText( message, combineOptions<TextOptions>( {
      maxWidth: 500
    }, SolarSystemCommonConstants.TITLE_OPTIONS ) );


    Multilink.multilink(
      [
        orbitTypeProperty,
        KeplersLawsStrings.warning.warningStringProperty,
        KeplersLawsStrings.warning.crashOrbitStringProperty,
        KeplersLawsStrings.warning.escapeOrbitStringProperty
      ],
      ( orbitType, warningString, crashOrbitString, escapeOrbitString ) => {
        //REVIEW: I believe i18n patterns should be used for this, instead of string concatenation with a colon
        //REVIEW: why is the colon, space, and placeholder not available in the warning.warning string?
        message = warningString + ': ';
        switch( orbitType ) {
          case OrbitTypes.CRASH_ORBIT:
            message += crashOrbitString;
            break;
          case OrbitTypes.ESCAPE_ORBIT:
            message += escapeOrbitString;
            break;
          default:
            break;
        }

        warningText.setString( message );

        //REVIEW: This would be a separate link to keep things centered
        warningText.center = center;
      }
    );

    super( {
      visibleProperty: DerivedProperty.not( allowedOrbitProperty ),
      center: center,
      children: [ warningText ]
    } );
  }
}

keplersLaws.register( 'OrbitalWarningMessage', OrbitalWarningMessage );