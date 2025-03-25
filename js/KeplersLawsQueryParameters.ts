// Copyright 2023, University of Colorado Boulder

/**
 * Query parameters supported by the Kepler's Laws simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { QueryStringMachine } from '../../query-string-machine/js/QueryStringMachineModule.js';
import keplersLaws from './keplersLaws.js';

const KeplersLawsQueryParameters = QueryStringMachine.getAll( {

  // When true, displays a panel with extra information such as direction and magnitude of the velocity and position.
  moreOrbitalData: {
    type: 'boolean',
    defaultValue: false,
    public: true
  }
} );

keplersLaws.register( 'KeplersLawsQueryParameters', KeplersLawsQueryParameters );

export default KeplersLawsQueryParameters;