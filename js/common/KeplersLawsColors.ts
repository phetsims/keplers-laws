// Copyright 2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import keplersLaws from '../keplersLaws.js';

const KeplersLawsColors = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( keplersLaws, 'foreground', {
    default: 'white',
    projector: 'black'
  } ),

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
  } )
};

keplersLaws.register( 'KeplersLawsColors', KeplersLawsColors );
export default KeplersLawsColors;