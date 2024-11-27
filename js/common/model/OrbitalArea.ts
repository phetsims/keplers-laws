// Copyright 2023, University of Colorado Boulder

/**
 *
 * Class that handles the internal logic of the orbital areas.
 * It keeps track of the position of the dot in the orbital area, the start and end positions, the angles, the completionProperty, etc.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';

export default class OrbitalArea {

  public dotPositionProperty: Vector2Property; // Position of the dot in the orbital area
  public startPositionProperty: Vector2Property; // Start position of the orbital area
  public endPositionProperty: Vector2Property; // End position of the orbital area
  public startAngle = 0;
  public endAngle = 0;

  public readonly index: number; // Index of the orbital area, 0-based.

  public completionProperty: NumberProperty; // Proportional completion of the orbital area, goes up to 1
  public sweptAreaProperty: NumberProperty; // Total area the section will have when completionProperty = 1
  public insideProperty: BooleanProperty;
  public alreadyEnteredProperty: BooleanProperty; // To properly display de filling out of area, this boolean
  public activeProperty: BooleanProperty; // Whether the shown areas include this one

  public constructor( index: number, tandem: Tandem ) {
    this.index = index;

    // Tandem for the orbital area, using 1 based index for consistency with the graph
    const individualAreaTandem = tandem.createTandem( 'orbitalArea' + ( this.index + 1 ) );

    this.sweptAreaProperty = new NumberProperty( 0, {
      tandem: individualAreaTandem.createTandem( 'sweptAreaProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      units: 'AU^2'
    } );
    this.dotPositionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: individualAreaTandem.createTandem( 'dotPositionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.startPositionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: individualAreaTandem.createTandem( 'startPositionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.endPositionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: individualAreaTandem.createTandem( 'endPositionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.completionProperty = new NumberProperty( 0, {
      tandem: individualAreaTandem.createTandem( 'completionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.insideProperty = new BooleanProperty( false, {
      tandem: individualAreaTandem.createTandem( 'insideProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.alreadyEnteredProperty = new BooleanProperty( true, {
      tandem: individualAreaTandem.createTandem( 'alreadyEnteredProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.activeProperty = new BooleanProperty( false, {
      tandem: individualAreaTandem.createTandem( 'activeProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
  }

  /**
   * There are multiple ways to reset the orbital areas,
   * i.e. when the user clicks on the reset button or when the user changes the orbit.
   *
   * @param eraseAreas - determines if all the areas are going to be empty or not.
   */
  public reset( eraseAreas = false ): void {
    this.dotPositionProperty.reset();
    this.startPositionProperty.reset();
    this.endPositionProperty.reset();
    this.startAngle = 0;
    this.endAngle = 0;
    this.completionProperty.reset();
    this.sweptAreaProperty.reset();
    this.alreadyEnteredProperty.value = !eraseAreas;
    this.activeProperty.reset();
  }
}

keplersLaws.register( 'OrbitalArea', OrbitalArea );