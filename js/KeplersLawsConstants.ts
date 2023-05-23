// Copyright 2023, University of Colorado Boulder

/**
 * Constants used throughout the Kepler's Laws Simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import keplersLaws from './keplersLaws.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import SolarSystemCommonColors from '../../solar-system-common/js/SolarSystemCommonColors.js';
import { Color } from '../../scenery/js/imports.js';

const KeplersLawsConstants = {
  PANELS_MIN_WIDTH: 250,

  MAX_ORBITAL_DIVISIONS: 6,
  MIN_ORBITAL_DIVISIONS: 2,

  TIMER_READOUT_OPTIONS: {
    font: new PhetFont( { size: 18 } ),
    fill: 'black'
  },

  AREA_COLOR: SolarSystemCommonColors.orbitColorProperty,
  FOCI_COLOR_OPTIONS: {
    fill: '#29ABE2',
    stroke: 'black'
  },
  DISTANCE_LABEL_COLOR: new Color( '#ccb285' )
};

keplersLaws.register( 'KeplersLawsConstants', KeplersLawsConstants );
export default KeplersLawsConstants;