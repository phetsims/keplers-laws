// Copyright 2023, University of Colorado Boulder

/**
 * KeplersLawsPreferences is the model for sim-specific preferences.  The values declared here can be updated via
 * the Preferences dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import keplersLaws from '../../keplersLaws.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import KeplersLawsQueryParameters from '../../KeplersLawsQueryParameters.js';

const KeplersLawsPreferences = {

  // Toggles whether the First Law panel will additional orbital data:
  // Velocity magnitude and direction, as well as planet's position magnitude and direction.
  // Those values might be useful for angular momentum calculations.
  moreOrbitalDataVisibleProperty: new BooleanProperty( KeplersLawsQueryParameters.moreOrbitalData, {
    tandem: Tandem.PREFERENCES.createTandem( 'moreOrbitalDataVisibleProperty' )
  } )
};

keplersLaws.register( 'KeplersLawsPreferences', KeplersLawsPreferences );
export default KeplersLawsPreferences;