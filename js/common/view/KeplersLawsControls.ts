// Copyright 2023, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, HSeparator, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsOrbitalInformationBox from './KeplersLawsOrbitalInformationBox.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../../KeplersLawsConstants.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';

class KeplersLawsControls extends Panel {
  public constructor( model: KeplersLawsModel, tandem: Tandem ) {

    const stopwatchIcon = new StopwatchNode( new Stopwatch( {
      isVisible: true,
      tandem: Tandem.OPT_OUT
    } ), {
      numberDisplayOptions: {
        textOptions: {
          maxWidth: 100
        }
      },
      tandem: Tandem.OPT_OUT
    } ).rasterized( {
      resolution: 5,
      imageOptions: {
        cursor: 'pointer',
        tandem: tandem.createTandem( 'timerIcon' )
      }
    } );

    stopwatchIcon.setScaleMagnitude( 0.3 );

    super( new VBox( {
      children: [
        new KeplersLawsOrbitalInformationBox( model, {
          tandem: tandem
        } ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        new SolarSystemCommonCheckbox(
          model.alwaysCircularProperty,
          new Text( KeplersLawsStrings.circularOrbitStringProperty, KeplersLawsConstants.TEXT_OPTIONS ),
          {
            accessibleName: KeplersLawsStrings.circularOrbitStringProperty
          } ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, tandem ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, tandem, false ),
        new SolarSystemCommonCheckbox(
          model.stopwatchVisibleProperty,
          new HBox( {
            children: [
              new Text( KeplersLawsStrings.stopwatchStringProperty, KeplersLawsConstants.TEXT_OPTIONS ),
              stopwatchIcon
            ]
          } ),
          {
            accessibleName: KeplersLawsStrings.stopwatchStringProperty
          } )
      ],
      spacing: 5,
      align: 'left',
      stretch: true,
      maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
    } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );
  }
}

keplersLaws.register( 'KeplersLawsControls', KeplersLawsControls );
export default KeplersLawsControls;