// Copyright 2023, University of Colorado Boulder

/**
 * OrbitalDataInfoDialog is a dialog that displays info related to OrbitalDataPanel. It is relevant for the First Law.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { HBox, Image, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import infoSemiMajorAxis_png from '../../../images/infoSemiMajorAxis_png.js';
import infoSemiMinorAxis_png from '../../../images/infoSemiMinorAxis_png.js';
import focalDistance_png from '../../../images/focalDistance_png.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';

export default class OrbitalDataInfoDialog extends Dialog {

  public constructor() {

    const options: DialogOptions = {
      isDisposable: false,
      titleAlign: 'center',
      title: new Text( KeplersLawsStrings.infoDialog.orbitalDataStringProperty, {
        font: new PhetFont( 32 ),
        maxWidth: 600
      } )
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