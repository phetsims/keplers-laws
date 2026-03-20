// Copyright 2023-2025, University of Colorado Boulder

/**
 * Query parameters supported by the Kepler's Laws simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { QueryStringMachine } from '../../query-string-machine/js/QueryStringMachineModule.js';

const KeplersLawsQueryParameters = QueryStringMachine.getAll( {

  // When true, displays a panel with extra information such as direction and magnitude of the velocity and position.
  moreOrbitalData: {
    type: 'boolean',
    defaultValue: false,
    public: true
  }
} );

export default KeplersLawsQueryParameters;
