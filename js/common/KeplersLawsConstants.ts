// Copyright 2023, University of Colorado Boulder

/**
 * Constants used throughout the Kepler's Laws Simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import keplersLaws from '../keplersLaws.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonConstants from '../../../solar-system-common/js/SolarSystemCommonConstants.js';

const DEFAULT_MAX_WIDTH = SolarSystemCommonConstants.TEXT_MAX_WIDTH;
const EQUATION_MAX_WIDTH = 100;

const KeplersLawsConstants = {
  PANELS_MIN_WIDTH: 250,

  MAX_ORBITAL_DIVISIONS: 6,
  MIN_ORBITAL_DIVISIONS: 2,

  TIMER_READOUT_OPTIONS: {
    font: new PhetFont( { size: 18 } ),
    fill: 'black'
  },

  TITLE_OPTIONS: {
    font: new PhetFont( { size: 18, weight: 'bold' } ),
    fill: SolarSystemCommonColors.foregroundProperty,
    maxWidth: DEFAULT_MAX_WIDTH
  },
  TEXT_OPTIONS: {
    font: new PhetFont( 16 ),
    fill: SolarSystemCommonColors.foregroundProperty,
    lineWidth: 0.1,
    maxWidth: DEFAULT_MAX_WIDTH
  },
  PANEL_TEXT_OPTIONS: {
    font: new PhetFont( 16 ),
    fill: SolarSystemCommonColors.foregroundProperty,
    lineWidth: 0.1,
    maxWidth: DEFAULT_MAX_WIDTH
  },
  EQUATION_TEXT_OPTIONS: {
    font: new PhetFont( 16 ),
    fill: SolarSystemCommonColors.foregroundProperty,
    lineWidth: 0.1,
    maxWidth: EQUATION_MAX_WIDTH
  },
  EQUATION_MAX_WIDTH: EQUATION_MAX_WIDTH
};

keplersLaws.register( 'KeplersLawsConstants', KeplersLawsConstants );
export default KeplersLawsConstants;