// Copyright 2023-2024, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import solarSystemCommon from '../../../solar-system-common/js/solarSystemCommon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import keplersLaws from '../keplersLaws.js';

const KeplersLawsColors = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( keplersLaws, 'foreground', {
    default: 'white',
    projector: 'black'
  } ),

  orbitColorProperty: new ProfileColorProperty( solarSystemCommon, 'orbitColor', {
    default: 'fuchsia'
  } ),

  // Color for the base fuchsia of the areas
  areaColorProperty: new ProfileColorProperty( solarSystemCommon, 'areaColor', {
    default: 'fuchsia'
  } ),

  sunColorProperty: new ProfileColorProperty( solarSystemCommon, 'sunColor', {
    default: 'yellow',
    projector: '#FFAE00'
  }, {
    tandem: Tandem.COLORS.createTandem( 'sunColorProperty' ),
    phetioFeatured: true
  } ),

  planetColorProperty: new ProfileColorProperty( solarSystemCommon, 'planetColor', {
    default: 'magenta'
  }, {
    tandem: Tandem.COLORS.createTandem( 'planetColorProperty' ),
    phetioFeatured: true
  } ),

  // Semi-major axis color
  semiMajorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semiMajorAxis', {
    default: '#FF9500'
  } ),

  // Semi-minor axis color
  semiMinorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semiMinorAxis', {
    default: '#B0EE86',
    projector: '#83B030'
  } ),

  // Focal distance color
  focalDistanceColorProperty: new ProfileColorProperty( keplersLaws, 'focalDistance', {
    default: '#E6C7FF',
    projector: '#8484D7'
  } ),

  // Period color
  periodColorProperty: new ProfileColorProperty( keplersLaws, 'period', {
    default: 'cyan'
  } ),

  distancesColorProperty: new ProfileColorProperty( keplersLaws, 'distance', {
    default: '#ccb285',
    projector: '#795f34'
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
  } ),

  timeDisplayBackgroundColorProperty: new ProfileColorProperty( keplersLaws, 'timeDisplayBackground', {
    default: '#aff'
  } ),

  // Colors used for orbital area, where index is a function of area. See KeplersLawModel getAreaColor.
  ORBITAL_AREA_COLORS: [
    '#FF92FF',
    '#FF6DFF',
    '#FF24FF',
    '#C800C8',
    '#A400A4',
    '#80007F'
  ]
};

keplersLaws.register( 'KeplersLawsColors', KeplersLawsColors );
export default KeplersLawsColors;