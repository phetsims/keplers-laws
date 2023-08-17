// Copyright 2023, University of Colorado Boulder

/**
 * KeplersLawsPreferences is the model for sim-specific preferences.  The values declared here can be updated via
 * the Preferences dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import keplersLaws from '../../keplersLaws.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

const KeplersLawsPreferences = {

  // Toggles wether the First Law panel will show extra information:
  // Velocity magnitude and direction, as well as planet's position magnitude and direction.
  // Those values might be useful for angular momentum calculations.
  moreOrbitalDataEnabledProperty: new BooleanProperty( false )
};

keplersLaws.register( 'KeplersLawsPreferences', KeplersLawsPreferences );
export default KeplersLawsPreferences;