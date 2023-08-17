// Copyright 2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import keplersLaws from '../keplersLaws.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';

const KeplersLawsColors = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( keplersLaws, 'foreground', {
    default: 'white',
    projector: 'black'
  } ),

  // Color for the base fuchsia of the areas
  areaColorProperty: SolarSystemCommonColors.orbitColorProperty,

  // Semimajor axis color
  semimajorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semimajorAxis', {
    default: 'orange'
  } ),

  // Semiminor axis color
  semiminorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semiminorAxis', {
    default: '#C4F566'
  } ),

  // Focal distance color
  focalDistanceColorProperty: new ProfileColorProperty( keplersLaws, 'focalDistance', {
    default: '#AFAFDA'
  } ),

  // Period color
  periodColorProperty: new ProfileColorProperty( keplersLaws, 'period', {
    default: 'cyan'
  } ),

  // Period color
  distancesColorProperty: new ProfileColorProperty( keplersLaws, 'distance', {
    default: '#ccb285'
  } ),

  fociColorProperty: new ProfileColorProperty( keplersLaws, 'foci', {
    default: '#29ABE2'
  } ),

  axesColorProperty: new ProfileColorProperty( keplersLaws, 'axes', {
    default: 'orange'
  } )
};

keplersLaws.register( 'KeplersLawsColors', KeplersLawsColors );
export default KeplersLawsColors;