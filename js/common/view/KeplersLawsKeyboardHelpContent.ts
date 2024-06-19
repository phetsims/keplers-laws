// Copyright 2023-2024, University of Colorado Boulder

/**
 * Keyboard help content for Kepler's Laws.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import keplersLaws from '../../keplersLaws.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimingControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimingControlsKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

export default class KeplersLawsKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor( hasComboBoxHelp: boolean ) {
    const draggableHelpSection = new MoveDraggableItemsKeyboardHelpSection();
    const sliderHelpSection = new SliderControlsKeyboardHelpSection();
    const timeControlsHelpSection = new TimingControlsKeyboardHelpSection();
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    // optional 'Choose a Target Orbit' for combo box
    const comboBoxHelpSection = hasComboBoxHelp ? new ComboBoxKeyboardHelpSection( {
      headingString: KeplersLawsStrings.keyboardHelpDialog.chooseATargetOribitStringProperty,
      thingAsLowerCaseSingular: KeplersLawsStrings.keyboardHelpDialog.targetOrbitStringProperty,
      thingAsLowerCasePlural: KeplersLawsStrings.keyboardHelpDialog.targetOrbitsStringProperty
    } ) : null;

    const leftSection = comboBoxHelpSection ?
      [ draggableHelpSection, sliderHelpSection, comboBoxHelpSection ] :
      [ draggableHelpSection, sliderHelpSection ];
    const rightSection = [ timeControlsHelpSection, basicActionsHelpSection ];

    super( leftSection, rightSection );
  }
}

keplersLaws.register( 'KeplersLawsKeyboardHelpContent', KeplersLawsKeyboardHelpContent );