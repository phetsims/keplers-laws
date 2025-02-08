// Copyright 2023-2025, University of Colorado Boulder
/**
 * KeplersLawsPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So KeplersLawsPreferencesNode must
 * implement dispose, and all elements of KeplersLawsPreferencesNode that have tandems must be disposed.
 *
 * @author Agustín Vallejo
 */

import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';

export default class KeplersLawsPreferencesNode extends VBox {
  public constructor( tandem: Tandem ) {

    const moreOrbitalDataControl = new MoreOrbitalDataControl( tandem.createTandem( 'moreOrbitalDataControl' ) );

    super( {
      children: [ moreOrbitalDataControl ],
      spacing: 20,
      tandem: tandem
    } );
  }
}

class MoreOrbitalDataControl extends PreferencesControl {
  public constructor( tandem: Tandem ) {
    super( {
      isDisposable: false,
      labelNode: new Text( KeplersLawsStrings.preferences.moreOrbitalData.titleStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( KeplersLawsStrings.preferences.moreOrbitalData.descriptionStringProperty,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: new ToggleSwitch( KeplersLawsPreferences.moreOrbitalDataVisibleProperty, false, true, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS ),
      tandem: tandem
    } );
  }
}

keplersLaws.register( 'KeplersLawsPreferencesNode', KeplersLawsPreferencesNode );