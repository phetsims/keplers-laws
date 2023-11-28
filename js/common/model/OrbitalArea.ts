// Copyright 2023, University of Colorado Boulder

/**
 *
 * Class that handles the internal logic of the orbital areas.
 * It keeps track of the position of the dot in the orbital area, the start and end positions, the angles, the completionProperty, etc.
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import keplersLaws from '../../keplersLaws.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

export default class OrbitalArea {

  public dotPosition = Vector2.ZERO; // Position of the dot in the orbital area
  public startPosition = Vector2.ZERO; // Start position of the orbital area
  public endPosition = Vector2.ZERO; // End position of the orbital area
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

    const individualAreaTandem = tandem.createTandem( 'orbitalArea' + this.index );

    this.completionProperty = new NumberProperty( 0, {
      tandem: individualAreaTandem.createTandem( 'completionProperty' ),
      phetioReadOnly: true
    } );
    this.sweptAreaProperty = new NumberProperty( 0, {
      tandem: individualAreaTandem.createTandem( 'sweptAreaProperty' ),
      phetioReadOnly: true
    } );
    this.insideProperty = new BooleanProperty( false, {
      tandem: individualAreaTandem.createTandem( 'insideProperty' ),
      phetioReadOnly: true
    } );
    this.alreadyEnteredProperty = new BooleanProperty( true, {
      tandem: individualAreaTandem.createTandem( 'alreadyEnteredProperty' ),
      phetioReadOnly: true
    } );
    this.activeProperty = new BooleanProperty( false, {
      tandem: individualAreaTandem.createTandem( 'activeProperty' ),
      phetioReadOnly: true
    } );
  }

  /**
   * There are multiple ways to reset the orbital areas,
   * i.e. when the user clicks on the reset button or when the user changes the orbit.
   *
   * @param eraseAreas - determines if all the areas are going to be empty or not.
   */
  public reset( eraseAreas = false ): void {
    this.dotPosition = Vector2.ZERO;
    this.startPosition = Vector2.ZERO;
    this.endPosition = Vector2.ZERO;
    this.startAngle = 0;
    this.endAngle = 0;
    this.completionProperty.reset();
    this.sweptAreaProperty.reset();
    this.alreadyEnteredProperty.value = !eraseAreas;
    this.activeProperty.reset();
  }
}

keplersLaws.register( 'OrbitalArea', OrbitalArea );