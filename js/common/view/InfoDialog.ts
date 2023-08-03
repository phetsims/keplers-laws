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
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

export default class InfoDialog extends Dialog {

  public constructor() {

    const infoDialogTextOptions: RichTextOptions = {
      font: new PhetFont( 18 ),
      fill: 'black',
      lineWrap: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 1.6
    };

    const spacing = 10;

    super( new VBox( {
      spacing: 10,
      align: 'left',
      children: [
        new HBox( {
          spacing: spacing,
          children: [
            new Image( infoSemimajorAxis_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.semimajorAxisStringProperty, infoDialogTextOptions )
            ]
        } ),
        new HBox( {
          spacing: spacing,
          children: [
            new Image( infoSemiminorAxis_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.semiminorAxisStringProperty, infoDialogTextOptions )
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
      titleAlign: 'center',
      title: new Text( 'Info', { font: new PhetFont( 32 ) } )
    } );
  }
}

keplersLaws.register( 'InfoDialog', InfoDialog );