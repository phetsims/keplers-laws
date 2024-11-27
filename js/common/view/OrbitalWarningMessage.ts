// Copyright 2023, University of Colorado Boulder

/**
 * A simple warning that appears when the user tries to make a forbidden orbit.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import OrbitTypes from '../model/OrbitTypes.js';

const WARNING_TEXT_OPTIONS = {
  font: new PhetFont( { size: 18, weight: 'bold' } ),
  fill: SolarSystemCommonColors.foregroundProperty,
  maxWidth: 410
};

export default class OrbitalWarningMessage extends Node {

  public constructor( orbitTypeProperty: TReadOnlyProperty<OrbitTypes>,
                      allowedOrbitProperty: TReadOnlyProperty<boolean>,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {

    const center = modelViewTransformProperty.value.modelToViewPosition( new Vector2( 0, -0.5 ) );

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

    const warningText = new RichText( messageProperty, WARNING_TEXT_OPTIONS );

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