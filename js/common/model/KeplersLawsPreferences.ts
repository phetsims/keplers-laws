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

  //TODO https://github.com/phetsims/keplers-laws/issues/105 rename to moreOrbitalDataEnabledProperty, document
  extraOrbitalDataEnabledProperty: new BooleanProperty( false )
};

keplersLaws.register( 'KeplersLawsPreferences', KeplersLawsPreferences );
export default KeplersLawsPreferences;