// Copyright 2023, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import KeplersLawsQueryParameters from '../../KeplersLawsQueryParameters.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';

/**
 * KeplersLawsPreferences is the model for sim-specific preferences.  The values declared here can be updated via
 * the Preferences dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

const KeplersLawsPreferences = {

  // Toggles whether More Orbital Data panel will be shown in the screens that support it.
  moreOrbitalDataVisibleProperty: new BooleanProperty( KeplersLawsQueryParameters.moreOrbitalData, {
    tandem: Tandem.PREFERENCES.createTandem( 'moreOrbitalDataVisibleProperty' )
  } )
};

keplersLaws.register( 'KeplersLawsPreferences', KeplersLawsPreferences );
export default KeplersLawsPreferences;