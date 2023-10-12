// Copyright 2023, University of Colorado Boulder

/**
 * MoreOrbitalDataInfoDialog is a dialog that displays info related to MoreOrbitalDataPanel. It is relevant for the First Law.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { HBox, Image, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import planetPosition_png from '../../../images/planetPosition_png.js';
import planetVelocity_png from '../../../images/planetVelocity_png.js';
import rvAngle_png from '../../../images/rvAngle_png.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class MoreOrbitalDataInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const options: DialogOptions = {
      isDisposable: false,
      titleAlign: 'center',
      title: new Text( KeplersLawsStrings.infoDialog.moreOrbitalDataStringProperty, {
        font: new PhetFont( 32 ),
        maxWidth: 600
      } ),
      tandem: tandem
    };

    const content = new VBox( {
      align: 'left',
      spacing: 15,
      children: [

        // Planet's position vector ...
        new HBox( {
          spacing: KeplersLawsConstants.INFO_DIALOG_IMAGE_TEXT_SPACING,
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
          children: [
            new Image( planetPosition_png, { scale: 0.315 } ),
            new RichText( KeplersLawsStrings.infoDialog.planetsPositionVectorStringProperty, KeplersLawsConstants.INFO_DIALOG_RICH_TEXT_OPTIONS )
          ]
        } ),

        // Planet's velocity vector ...
        new HBox( {
          spacing: KeplersLawsConstants.INFO_DIALOG_IMAGE_TEXT_SPACING,
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
          children: [
            new Image( planetVelocity_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.planetsVelocityVectorStringProperty, KeplersLawsConstants.INFO_DIALOG_RICH_TEXT_OPTIONS )
          ]
        } ),

        // Angle between vectors ...
        new HBox( {
          spacing: KeplersLawsConstants.INFO_DIALOG_IMAGE_TEXT_SPACING,
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
          children: [
            new Image( rvAngle_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.angleBetweenVectorsStringProperty, KeplersLawsConstants.INFO_DIALOG_RICH_TEXT_OPTIONS )
          ]
        } )
      ]
    } );

    super( content, options );
  }
}

keplersLaws.register( 'MoreOrbitalDataInfoDialog', MoreOrbitalDataInfoDialog );