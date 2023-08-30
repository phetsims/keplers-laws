// Copyright 2023, University of Colorado Boulder
/**
 * Contents of the Information Dialog in First Law Screen
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { HBox, Image, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import infoSemimajorAxis_png from '../../../images/infoSemimajorAxis_png.js';
import infoSemiminorAxis_png from '../../../images/infoSemiminorAxis_png.js';
import focalDistance_png from '../../../images/focalDistance_png.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

// horizontal spacing between images and text
const IMAGE_TEXT_SPACING = 10;

export default class InfoDialog extends Dialog {

  public constructor() {
    
    const options: DialogOptions = {
      isDisposable: false,
      titleAlign: 'center',
      title: new Text( KeplersLawsStrings.a11y.orbitalInformationStringProperty, {
        font: new PhetFont( 32 ),
        maxWidth: 800
      } )
    };

    const rickTextOptions: RichTextOptions = {
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
            new Image( infoSemimajorAxis_png ),
            new RichText( KeplersLawsStrings.infoDialog.semiMajorAxisStringProperty, rickTextOptions )
          ]
        } ),
        new HBox( {
          spacing: IMAGE_TEXT_SPACING,
          children: [
            new Image( infoSemiminorAxis_png ),
            new RichText( KeplersLawsStrings.infoDialog.semiMinorAxisStringProperty, rickTextOptions )
          ]
        } ),
        new HBox( {
          spacing: IMAGE_TEXT_SPACING,
          children: [
            new Image( focalDistance_png ),
            new RichText( KeplersLawsStrings.infoDialog.focalDistanceStringProperty, rickTextOptions )
          ]
        } )
      ]
    } );

    super( content, options );
  }
}

keplersLaws.register( 'InfoDialog', InfoDialog );