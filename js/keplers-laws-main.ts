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
import FirstLawScreen from './first-law/FirstLawScreen.js';
import SecondLawScreen from './second-law/SecondLawScreen.js';
import ThirdLawScreen from './third-law/ThirdLawScreen.js';
import AllLawsScreen from './all-laws/AllLawsScreen.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import KeplersLawsPreferencesNode from './common/view/KeplersLawsPreferencesNode.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = KeplersLawsStrings[ 'keplers-laws' ].titleStringProperty;

  const screens = [
    new FirstLawScreen( Tandem.ROOT.createTandem( 'firstLawScreen' ) ),
    new SecondLawScreen( Tandem.ROOT.createTandem( 'secondLawScreen' ) ),
    new ThirdLawScreen( Tandem.ROOT.createTandem( 'thirdLawScreen' ) ),
    new AllLawsScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ];

  const options: SimOptions = {
    credits: {
      leadDesign: 'Diana López Tavares',
      softwareDevelopment: 'Agustín Vallejo, Jonathan Olson',
      team: 'Chris Malley (PixelZoom, Inc.), Emily B. Moore, Kathy Perkins, Ariel Paul, Amy Rouinfar',
      qualityAssurance: 'Jaron Droder, Clifford Hardin, Nancy Salpepi, Kathryn Woessner',
      graphicArts: '',
      soundDesign: 'Ashton Morris',
      thanks: ''
    },
    preferencesModel: new PreferencesModel( {
      visualOptions: {
        supportsProjectorMode: true
      },
      simulationOptions: {
        customPreferences: [
          { createContent: tandem => new KeplersLawsPreferencesNode() }
        ]
      }
    } )
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );