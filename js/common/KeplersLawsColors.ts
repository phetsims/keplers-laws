// Copyright 2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import keplersLaws from '../keplersLaws.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';

const KeplersLawsColors = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( keplersLaws, 'foreground', {
    default: 'white',
    projector: 'black'
  } ),

  velocityColorProperty: PhetColorScheme.VELOCITY,

  orbitColorProperty: SolarSystemCommonColors.orbitColorProperty,

  // Color for the base fuchsia of the areas
  areaColorProperty: SolarSystemCommonColors.orbitColorProperty,

  // Semimajor axis color
  semiMajorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semiMajorAxis', {
    default: '#FF9500'
  } ),

  // Semiminor axis color
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

  // Period color
  distancesColorProperty: new ProfileColorProperty( keplersLaws, 'distance', {
    default: '#ccb285',
    projector: '#B49C74'
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
    default: '#ADFFCD'
  } )
};

keplersLaws.register( 'KeplersLawsColors', KeplersLawsColors );
export default KeplersLawsColors;