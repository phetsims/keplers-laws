// Copyright 2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Agustín Vallejo
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import KeplersLawsStrings from './KeplersLawsStrings.js';
import KeplersLawsScreen from './keplers-laws/KeplersLawsScreen.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = KeplersLawsStrings[ 'keplers-laws' ].titleStringProperty;

  const screens = [
    new KeplersLawsScreen( Tandem.ROOT.createTandem( 'keplersLawsScreen' ) )
  ];

  const options: SimOptions = {
    credits: {
      leadDesign: 'Diana López Tavares',
      softwareDevelopment: 'Agustín Vallejo, Jonathan Olson',
      team: 'Emily B. Moore, Sola Olateju, Kathy Perkins, Ariel Paul, Amy Rouinfar',
      qualityAssurance: 'Jaron Droder, Clifford Hardin, Emily Miller, Nancy Salpepi, Kathryn Woessner',
      graphicArts: '',
      soundDesign: 'Ashton Morris',
      thanks: ''
    }
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );