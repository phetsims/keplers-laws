// Copyright 2023-2025, University of Colorado Boulder

/**
 * OrbitalDataInfoDialog is a dialog that displays info related to OrbitalDataPanel. It is relevant for the First Law.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import focalDistance_png from '../../../images/focalDistance_png.js';
import infoSemiMajorAxis_png from '../../../images/infoSemiMajorAxis_png.js';
import infoSemiMinorAxis_png from '../../../images/infoSemiMinorAxis_png.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';

export default class OrbitalDataInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const options: DialogOptions = {
      isDisposable: false,
      titleAlign: 'center',
      title: new Text( KeplersLawsStrings.infoDialog.orbitalDataStringProperty, {
        font: new PhetFont( 32 ),
        maxWidth: 600
      } ),
      tandem: tandem
    };

    const content = new VBox( {
      align: 'left',
      spacing: 15,
      children: [

        // Semi-major axis ...
        new HBox( {
          spacing: KeplersLawsConstants.INFO_DIALOG_IMAGE_TEXT_SPACING,
          children: [
            new Image( infoSemiMajorAxis_png ),
            new RichText( KeplersLawsStrings.infoDialog.semiMajorAxisStringProperty, KeplersLawsConstants.INFO_DIALOG_RICH_TEXT_OPTIONS )
          ]
        } ),

        // Semi-minor axis ...
        new HBox( {
          spacing: KeplersLawsConstants.INFO_DIALOG_IMAGE_TEXT_SPACING,
          children: [
            new Image( infoSemiMinorAxis_png ),
            new RichText( KeplersLawsStrings.infoDialog.semiMinorAxisStringProperty, KeplersLawsConstants.INFO_DIALOG_RICH_TEXT_OPTIONS )
          ]
        } ),

        // Focal distance ...
        new HBox( {
          spacing: KeplersLawsConstants.INFO_DIALOG_IMAGE_TEXT_SPACING,
          children: [
            new Image( focalDistance_png ),
            new RichText( KeplersLawsStrings.infoDialog.focalDistanceStringProperty, KeplersLawsConstants.INFO_DIALOG_RICH_TEXT_OPTIONS )
          ]
        } )
      ]
    } );

    super( content, options );
  }
}

keplersLaws.register( 'OrbitalDataInfoDialog', OrbitalDataInfoDialog );