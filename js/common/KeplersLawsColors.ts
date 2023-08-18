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
  semiMajorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semiMajorAxis', {
    default: 'orange'
  } ),

  // Semiminor axis color
  semiMinorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semiMinorAxis', {
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

  periapsisColorProperty: new ProfileColorProperty( keplersLaws, 'periapsis', {
    default: 'gold'
  } ),

  apoapsisColorProperty: new ProfileColorProperty( keplersLaws, 'apoapsis', {
    default: 'cyan'
  } ),

  targetOrbitColorProperty: new ProfileColorProperty( keplersLaws, 'targetOrbit', {
    default: 'gray'
  } )
};

keplersLaws.register( 'KeplersLawsColors', KeplersLawsColors );
export default KeplersLawsColors;