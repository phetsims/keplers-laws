// Copyright 2023-2024, University of Colorado Boulder

/**
 * Constants used throughout the Kepler's Laws Simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import keplersLaws from '../keplersLaws.js';

const KeplersLawsConstants = {

  // Range and default value for periodDivisionsProperty
  PERIOD_DIVISIONS_RANGE: new RangeWithValue( 2, 6, 4 ),

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
    fill: SolarSystemCommonColors.foregroundProperty
  },

  ACCORDION_BOX_OPTIONS: {
    fill: SolarSystemCommonColors.panelFillProperty,
    stroke: SolarSystemCommonColors.panelStrokeProperty,
    cornerRadius: 5,
    margin: 5,
    padding: 5,
    titleYMargin: 10,
    buttonXMargin: 10,
    expandCollapseButtonOptions: {
      scale: 1.5
    },
    layoutOptions: {
      stretch: true
    }
  },

  // maxWidth for symbols like a, b, c, T, R
  SYMBOL_MAX_WIDTH: 20,

  // maxWidth for symbols that include absolute value, like |r|. A bit wider than SYMBOL_MAX_WIDTH.
  ABSOLUTE_SYMBOL_MAX_WIDTH: 25,

  // maxWidth for numeric values with units, like '1.50 AU'
  VALUE_MAX_WIDTH: 100,

  // horizontal spacing between images and text in Info dialogs
  INFO_DIALOG_IMAGE_TEXT_SPACING: 10,

  // options for RichText descriptions that appear in Info dialogs
  INFO_DIALOG_RICH_TEXT_OPTIONS: {
    font: new PhetFont( 18 ),
    fill: 'black',
    lineWrap: 450
  },

  INITIAL_VECTOR_OFFSCALE: -3.0, // The initial offscale value for the gravity vector arrows

  MASS_OF_OUR_SUN: 200, // x 10^28 kg
  PLANET_MASS: 50 // x 10^28 kg
};

keplersLaws.register( 'KeplersLawsConstants', KeplersLawsConstants );
export default KeplersLawsConstants;