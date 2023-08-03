// Copyright 2023, University of Colorado Boulder

/**
 * Keyboard help content for Kepler's Laws.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import keplersLaws from '../../keplersLaws.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimeControlKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';

export default class KeplersLawsKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    const draggableHelpSection = new MoveDraggableItemsKeyboardHelpSection();
    const sliderHelpSection = new SliderControlsKeyboardHelpSection();
    const timeControlsHelpSection = new TimeControlKeyboardHelpSection();
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    super( [ draggableHelpSection, sliderHelpSection ], [ timeControlsHelpSection, basicActionsHelpSection ] );
  }
}

keplersLaws.register( 'KeplersLawsKeyboardHelpContent', KeplersLawsKeyboardHelpContent );