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
import planetPosition_png from '../../../images/planetPosition_png.js';
import planetVelocity_png from '../../../images/planetVelocity_png.js';
import rvAngle_png from '../../../images/rvAngle_png.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';

export default class InfoDialogMoreData extends Dialog {
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
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
          children: [
            new Image( planetPosition_png, { scale: 0.315 } ),
            new RichText( KeplersLawsStrings.infoDialog.planetPositionStringProperty, infoDialogTextOptions )
          ]
        } ),
        new HBox( {
          spacing: spacing,
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
          children: [
            new Image( planetVelocity_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.planetVelocityStringProperty, infoDialogTextOptions )
          ]
        } ),
        new HBox( {
          spacing: spacing,
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
          children: [
            new Image( rvAngle_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.rvAngleStringProperty, infoDialogTextOptions )
          ]
        } )
      ]
    } ), {
      isDisposable: false,
      titleAlign: 'center',
      title: new Text( KeplersLawsStrings.a11y.extraOrbitalInformationStringProperty, { font: new PhetFont( 32 ) } )
    } );
  }
}

keplersLaws.register( 'InfoDialogMoreData', InfoDialogMoreData );