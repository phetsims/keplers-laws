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
import planetPosition_png from '../../../images/planetPosition_png.js';
import planetVelocity_png from '../../../images/planetVelocity_png.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';

export default class InfoDialog extends Dialog {

  public constructor() {

    const infoDialogTextOptions: RichTextOptions = {
      font: new PhetFont( 18 ),
      fill: 'black',
      lineWrap: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 2
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
        } ),
        new HBox( {
          spacing: spacing,
          visibleProperty: KeplersLawsPreferences.extraOrbitalDataEnabledProperty,
          children: [
            new Image( planetPosition_png, { scale: 0.315 } ),
            new RichText( KeplersLawsStrings.infoDialog.planetPositionStringProperty, infoDialogTextOptions )
          ]
        } ),
        new HBox( {
          spacing: spacing,
          visibleProperty: KeplersLawsPreferences.extraOrbitalDataEnabledProperty,
          children: [
            new Image( planetVelocity_png, { scale: 0.325 } ),
            new RichText( KeplersLawsStrings.infoDialog.planetVelocityStringProperty, infoDialogTextOptions )
          ]
        } )
      ]
    } ), {
      isDisposable: false,
      titleAlign: 'center',
      title: new Text( 'Info', { font: new PhetFont( 32 ) } )
    } );
  }
}

keplersLaws.register( 'InfoDialog', InfoDialog );