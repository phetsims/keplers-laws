// Copyright 2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import keplersLaws from '../keplersLaws.js';

const KeplersLawsColors = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( keplersLaws, 'foreground', {
    default: 'white',
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'foregroundColorProperty' )
  } ),

  // Semimajor axis color
  semimajorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semimajorAxis', {
    default: 'orange'
  }, {
    tandem: Tandem.COLORS.createTandem( 'semimajorAxisColorProperty' )
  } ),

  // Semiminor axis color
  semiminorAxisColorProperty: new ProfileColorProperty( keplersLaws, 'semiminorAxis', {
    default: '#C4F566'
  }, {
    tandem: Tandem.COLORS.createTandem( 'semiminorAxisColorProperty' )
  } ),

  // Focal distance color
  focalDistanceColorProperty: new ProfileColorProperty( keplersLaws, 'focalDistance', {
    default: '#AFAFDA'
  }, {
    tandem: Tandem.COLORS.createTandem( 'focalDistanceColorProperty' )
  } ),

  // Period color
  periodColorProperty: new ProfileColorProperty( keplersLaws, 'period', {
    default: 'cyan'
  }, {
    tandem: Tandem.COLORS.createTandem( 'periodColorProperty' )
  } ),

  // Period color
  distancesColorProperty: new ProfileColorProperty( keplersLaws, 'distance', {
    default: '#ccb285'
  }, {
    tandem: Tandem.COLORS.createTandem( 'distancesColorProperty' )
  } )
};

keplersLaws.register( 'KeplersLawsColors', KeplersLawsColors );
export default KeplersLawsColors;