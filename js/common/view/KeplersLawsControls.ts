// Copyright 2023, University of Colorado Boulder

/**
 * KeplersLawsControls is the collection of panels that appears in the upper-right corner of all screens.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, HSeparator, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsOrbitalInformationBox from './KeplersLawsOrbitalInformationBox.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import TargetOrbitsPanel from './TargetOrbitsPanel.js';
import GravityScaleSlider from '../../../../solar-system-common/js/view/GravityScaleSlider.js';

export default class KeplersLawsControls extends VBox {
  public constructor( model: KeplersLawsModel, topLayer: Node, tandem: Tandem ) {

    // Panel that contains the combo box for selecting a target orbit
    const targetOrbitsPanel = new TargetOrbitsPanel( model, topLayer );

    // Panel that contains checkboxes related to Foci, Axes, and Eccentricity
    const orbitalInformationPanel = new Panel( new KeplersLawsOrbitalInformationBox( model, {
      tandem: Tandem.OPT_OUT
    } ), combineOptions<PanelOptions>( {
      // minWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) );

    // A bunch of unrelated controls, so we named the panel based on its position in the layout.
    const bottomPanel = new Panel( new VBox( {
      spacing: 5,
      align: 'left',
      stretch: true,
      children: [

        // 'Always circular' checkbox
        new SolarSystemCommonCheckbox(
          model.alwaysCircularProperty,
          new Text( KeplersLawsStrings.circularOrbitStringProperty, KeplersLawsConstants.TEXT_OPTIONS ),
          {
            accessibleName: KeplersLawsStrings.circularOrbitStringProperty
          } ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Speed', 'Velocity', and 'Gravity Force' checkboxes
        ...createArrowsVisibilityCheckboxes( model, Tandem.OPT_OUT ),

        // Gravity slider
        new GravityScaleSlider( model.forceScaleProperty, model.gravityVisibleProperty ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Grid' and 'Measuring Tape' checkboxes
        ...createVisibilityInformationCheckboxes( model, Tandem.OPT_OUT, false ),

        // 'Stopwatch' checkbox
        new SolarSystemCommonCheckbox(
          model.stopwatchVisibleProperty,
          new HBox( {
            children: [
              new Text( KeplersLawsStrings.stopwatchStringProperty, KeplersLawsConstants.TEXT_OPTIONS ),
              createStopwatchIcon()
            ]
          } ),
          {
            accessibleName: KeplersLawsStrings.stopwatchStringProperty
          } )
      ]
    } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );

    super( {
      isDisposable: false,
      spacing: 7,
      children: [
        targetOrbitsPanel,
        orbitalInformationPanel,
        bottomPanel
      ]
    } );
  }
}

/**
 * Creates the icon for the stopwatch checkbox.
 */
function createStopwatchIcon(): Node {
  const stopwatchIcon = new StopwatchNode( new Stopwatch( {
    isVisible: true
  } ), {
    numberDisplayOptions: {
      textOptions: {
        maxWidth: 100
      }
    }
  } ).rasterized( {
    resolution: 5,
    imageOptions: {
      cursor: 'pointer'
    }
  } );
  stopwatchIcon.setScaleMagnitude( 0.3 );
  return stopwatchIcon;
}

keplersLaws.register( 'KeplersLawsControls', KeplersLawsControls );