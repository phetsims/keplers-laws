// Copyright 2023, University of Colorado Boulder

/**
 * OrbitalDataInfoDialog is a dialog that displays info related to OrbitalDataPanel. It is relevant for the First Law.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { HBox, Image, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import infoSemiMajorAxis_png from '../../../images/infoSemiMajorAxis_png.js';
import infoSemiMinorAxis_png from '../../../images/infoSemiMinorAxis_png.js';
import focalDistance_png from '../../../images/focalDistance_png.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

// horizontal spacing between images and text
const IMAGE_TEXT_SPACING = 10;

export default class OrbitalDataInfoDialog extends Dialog {

  public constructor() {
    
    const options: DialogOptions = {
      isDisposable: false,
      titleAlign: 'center',
      title: new Text( KeplersLawsStrings.infoDialog.orbitalDataStringProperty, {
        font: new PhetFont( 32 ),
        maxWidth: 800
      } )
    };

    const richTextOptions: RichTextOptions = {
      font: new PhetFont( 18 ),
      fill: 'black',
      lineWrap: 450
    };
    
    const content = new VBox( {
      align: 'left',
      spacing: 15,
      children: [
        new HBox( {
          spacing: IMAGE_TEXT_SPACING,
          children: [
            new Image( infoSemiMajorAxis_png ),
            new RichText( KeplersLawsStrings.infoDialog.semiMajorAxisStringProperty, richTextOptions )
          ]
        } ),
        new HBox( {
          spacing: IMAGE_TEXT_SPACING,
          children: [
            new Image( infoSemiMinorAxis_png ),
            new RichText( KeplersLawsStrings.infoDialog.semiMinorAxisStringProperty, richTextOptions )
          ]
        } ),
        new HBox( {
          spacing: IMAGE_TEXT_SPACING,
          children: [
            new Image( focalDistance_png ),
            new RichText( KeplersLawsStrings.infoDialog.focalDistanceStringProperty, richTextOptions )
          ]
        } )
      ]
    } );

    super( content, options );
  }
}

keplersLaws.register( 'OrbitalDataInfoDialog', OrbitalDataInfoDialog );