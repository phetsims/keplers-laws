// Copyright 2023, University of Colorado Boulder

/**
 * KeplersLawsPanels is the collection of panels that appears in the upper-right corner of all screens.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, HSeparator, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import OrbitalInformationPanel from './OrbitalInformationPanel.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TargetOrbitPanel from './TargetOrbitPanel.js';
import GravityScaleSlider from '../../../../solar-system-common/js/view/GravityScaleSlider.js';

export default class KeplersLawsPanels extends VBox {
  public constructor( model: KeplersLawsModel, topLayer: Node, tandem: Tandem ) {

    // Panel that contains the combo box for selecting a target orbit
    const targetOrbitPanel = new TargetOrbitPanel( model, topLayer );

    // Panel that contains checkboxes related to Foci, Axes, and Eccentricity
    const orbitalInformationPanel = new OrbitalInformationPanel( model,
      tandem.createTandem( 'orbitalInformationPanel' ) );

    // A bunch of unrelated controls, so we named the panel based on its position in the layout.
    const bottomPanel = new Panel( new VBox( {
      spacing: 5,
      align: 'left',
      stretch: true,
      children: [

        // 'Always circular' checkbox
        new SolarSystemCommonCheckbox(
          model.alwaysCircularProperty,
          new Text( KeplersLawsStrings.alwaysCircularStringProperty, KeplersLawsConstants.CHECKBOX_TEXT_OPTIONS ),
          {
            accessibleName: KeplersLawsStrings.alwaysCircularStringProperty
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
              new Text( KeplersLawsStrings.stopwatchStringProperty, KeplersLawsConstants.CHECKBOX_TEXT_OPTIONS ),
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
        targetOrbitPanel,
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

keplersLaws.register( 'KeplersLawsPanels', KeplersLawsPanels );