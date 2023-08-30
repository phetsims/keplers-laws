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

const KeplersLawsConstants = {

  MAX_ORBITAL_DIVISIONS: 6,
  MIN_ORBITAL_DIVISIONS: 2,

  TIMER_READOUT_OPTIONS: {
    font: new PhetFont( { size: 18 } ),
    fill: 'black'
  },

  TITLE_OPTIONS: {
    font: new PhetFont( { size: 18, weight: 'bold' } ),
    fill: SolarSystemCommonColors.foregroundProperty
  },

  AXIS_LABEL_OPTIONS: {
    font: new PhetFont( { size: 16, weight: 'bold' } ),
    fill: SolarSystemCommonColors.foregroundProperty,
    maxWidth: 150
  },

  TEXT_OPTIONS: {
    font: new PhetFont( 16 ),
    fill: SolarSystemCommonColors.foregroundProperty,
    lineWidth: 0.1,
    maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
  },

  // options for Checkbox labels
  CHECKBOX_TEXT_OPTIONS: {
    font: new PhetFont( 16 ),
    fill: SolarSystemCommonColors.foregroundProperty,
    maxWidth: 150
  },

  // maxWidth for symbols like a, b, c, T, R
  SYMBOL_MAX_WIDTH: 20,

  // maxWidth for symbols that include absolute value, like |r|. A bit wider than SYMBOL_MAX_WIDTH.
  ABSOLUTE_SYMBOL_MAX_WIDTH: 25,

  // maxWidth for numeric values with units, like '1.50 AU'
  VALUE_MAX_WIDTH: 100
};

keplersLaws.register( 'KeplersLawsConstants', KeplersLawsConstants );
export default KeplersLawsConstants;