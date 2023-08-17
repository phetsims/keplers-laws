// Copyright 2023, University of Colorado Boulder
/**
 * KeplersLawsPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So KeplersLawsPreferencesNode must
 * implement dispose, and all elements of KeplersLawsPreferencesNode that have tandems must be disposed.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { RichText, Text } from '../../../../scenery/js/imports.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';

export default class KeplersLawsPreferencesNode extends PreferencesControl {
  public constructor() {
    super( {
      isDisposable: false,
      labelNode: new Text( 'More Orbital Data', PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( 'Display information about the planet\'s position and velocity vectors in the First Law Screen',
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: new ToggleSwitch( KeplersLawsPreferences.moreOrbitalDataEnabledProperty, false, true, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS )
    } );
  }
}

keplersLaws.register( 'KeplersLawsPreferencesNode', KeplersLawsPreferencesNode );