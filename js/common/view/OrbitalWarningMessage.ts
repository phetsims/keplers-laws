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
import keplersLaws from '../../keplersLaws.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

export default class OrbitalWarningMessage extends Node {

  public constructor( orbitTypeProperty: TReadOnlyProperty<OrbitTypes>,
                      allowedOrbitProperty: TReadOnlyProperty<boolean>,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {

    const center = modelViewTransformProperty.value.modelToViewPosition( new Vector2( 0, -50 ) );

    const messageProperty = new DerivedProperty(
      [
        orbitTypeProperty,
        KeplersLawsStrings.pattern.warningMessageStringProperty,
        KeplersLawsStrings.warning.theBodyWillCrashIntoTheSunStringProperty,
        KeplersLawsStrings.warning.theBodyWillEscapeTheSystemStringProperty
      ],
      ( orbitType, warningString, crashOrbitString, escapeOrbitString ) => {
        return StringUtils.fillIn( warningString, {
          message: orbitType === OrbitTypes.CRASH_ORBIT ? crashOrbitString :
                    orbitType === OrbitTypes.ESCAPE_ORBIT ? escapeOrbitString : ''
        } );
      }
    );

    const warningText = new RichText( messageProperty,
      combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TITLE_OPTIONS, {
        maxWidth: 500
      } ) );

    messageProperty.link( () => {
      warningText.center = center;
    } );

    super( {
      isDisposable: false,
      visibleProperty: DerivedProperty.not( allowedOrbitProperty ),
      center: center,
      children: [ warningText ]
    } );
  }
}

keplersLaws.register( 'OrbitalWarningMessage', OrbitalWarningMessage );