// Copyright 2023, University of Colorado Boulder
/**
 * Contents of the Information Dialog in First Law Screen
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { HBox, Image, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Dialog from '../../../../sun/js/Dialog.js';
import infoSemimajorAxis_png from '../../../images/infoSemimajorAxis_png.js';
import infoSemiminorAxis_png from '../../../images/infoSemiminorAxis_png.js';
import focalDistance_png from '../../../images/focalDistance_png.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

export default class InfoDialog extends Dialog {

  public constructor() {

    const infoDialogTextOptions: RichTextOptions = {
      font: new PhetFont( 18 ),
      fill: 'black',
      lineWrap: 450
    };

    const spacing = 10;

    super( new VBox( {
      align: 'left',
      spacing: 15,
      children: [
        new HBox( {
          spacing: spacing,
          children: [
            new Image( infoSemimajorAxis_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.semiMajorAxisStringProperty, infoDialogTextOptions )
            ]
        } ),
        new HBox( {
          spacing: spacing,
          children: [
            new Image( infoSemiminorAxis_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.semiMinorAxisStringProperty, infoDialogTextOptions )
          ]
        } ),
        new HBox( {
          spacing: spacing,
          children: [
            new Image( focalDistance_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.focalDistanceStringProperty, infoDialogTextOptions )
          ]
        } )
      ]
    } ), {
      isDisposable: false,
      titleAlign: 'center',
      title: new Text( KeplersLawsStrings.a11y.orbitalInformationStringProperty, {
        font: new PhetFont( 32 ),
        maxWidth: 800
      } )
    } );
  }
}

keplersLaws.register( 'InfoDialog', InfoDialog );