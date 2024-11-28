// Copyright 2023-2024, University of Colorado Boulder

/**
 * KeplersLawsPreferences is the model for sim-specific preferences.  The values declared here can be updated via
 * the Preferences dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsQueryParameters from '../../KeplersLawsQueryParameters.js';

const KeplersLawsPreferences = {

  // Toggles whether More Orbital Data panel will be shown in the screens that support it.
  moreOrbitalDataVisibleProperty: new BooleanProperty( KeplersLawsQueryParameters.moreOrbitalData, {
    tandem: Tandem.PREFERENCES.createTandem( 'moreOrbitalDataVisibleProperty' ),
    phetioFeatured: true
  } )
};

keplersLaws.register( 'KeplersLawsPreferences', KeplersLawsPreferences );
export default KeplersLawsPreferences;