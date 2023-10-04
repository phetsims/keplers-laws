// Copyright 2023, University of Colorado Boulder

/**
 *
 * Class that handles the internal logic of the orbital areas.
 * It keeps track of the position of the dot in the orbital area, the start and end positions, the angles, the completion, etc.
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import keplersLaws from '../../keplersLaws.js';

export default class OrbitalArea {

  public dotPosition = Vector2.ZERO; // Position of the dot in the orbital area
  public startPosition = Vector2.ZERO; // Start position of the orbital area
  public endPosition = Vector2.ZERO; // End position of the orbital area
  public startAngle = 0;
  public endAngle = 0;
  public completion = 0; // Proportional completion of the orbital area, goes up to 1
  public sweptArea = 0; // Total area the section will have when completion = 1
  public insideProperty = new BooleanProperty( false );
  public alreadyEntered = true; // To properly display de filling out of area, this boolean
  public active = false; // Whether the shown areas include this one
  public readonly index: number; // Index of the orbital area

  public constructor( index: number ) {
    this.index = index;
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
    this.completion = 0;
    this.sweptArea = 0;
    this.alreadyEntered = !eraseAreas;
    this.active = false;
  }
}

keplersLaws.register( 'OrbitalArea', OrbitalArea );