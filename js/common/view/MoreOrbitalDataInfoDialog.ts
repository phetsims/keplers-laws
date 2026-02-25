// Copyright 2023-2025, University of Colorado Boulder

/**
 * MoreOrbitalDataInfoDialog is a dialog that displays info related to MoreOrbitalDataPanel. It is relevant for the First Law.
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
import planetPosition_png from '../../../images/planetPosition_png.js';
import planetVelocity_png from '../../../images/planetVelocity_png.js';
import rvAngle_png from '../../../images/rvAngle_png.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';

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
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataVisibleProperty,
          children: [
            new Image( planetPosition_png, { scale: 0.315 } ),
            new RichText( KeplersLawsStrings.infoDialog.planetsPositionVectorStringProperty, KeplersLawsConstants.INFO_DIALOG_RICH_TEXT_OPTIONS )
          ]
        } ),

        // Planet's velocity vector ...
        new HBox( {
          spacing: KeplersLawsConstants.INFO_DIALOG_IMAGE_TEXT_SPACING,
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataVisibleProperty,
          children: [
            new Image( planetVelocity_png, { scale: 1 } ),
            new RichText( KeplersLawsStrings.infoDialog.planetsVelocityVectorStringProperty, KeplersLawsConstants.INFO_DIALOG_RICH_TEXT_OPTIONS )
          ]
        } ),

        // Angle between vectors ...
        new HBox( {
          spacing: KeplersLawsConstants.INFO_DIALOG_IMAGE_TEXT_SPACING,
          visibleProperty: KeplersLawsPreferences.moreOrbitalDataVisibleProperty,
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