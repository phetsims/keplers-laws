// Copyright 2023, University of Colorado Boulder

/**
 * KeplersLawsPanels is the collection of panels that appears in the upper-right corner of all screens.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HSeparator, Node, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import OrbitalInformationPanel from './OrbitalInformationPanel.js';
import keplersLaws from '../../keplersLaws.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import TargetOrbitPanel from './TargetOrbitPanel.js';
import GravityScaleSlider from '../../../../solar-system-common/js/view/GravityScaleSlider.js';
import KeplersLawsCheckbox from './KeplersLawsCheckbox.js';
import KeplersLawsVisibleProperties from './KeplersLawsVisibleProperties.js';

export default class KeplersLawsPanels extends VBox {

  public constructor( model: KeplersLawsModel, visibleProperties: KeplersLawsVisibleProperties, topLayer: Node, tandem: Tandem ) {

    // Panel that contains the combo box for selecting a target orbit
    const targetOrbitPanel = new TargetOrbitPanel( model, topLayer );

    // Panel that contains checkboxes related to Foci, Axes, and Eccentricity
    const orbitalInformationPanel = new OrbitalInformationPanel( model, visibleProperties, tandem.createTandem( 'orbitalInformationPanel' ) );

    // A bunch of unrelated controls, so we named the panel based on its position in the layout.
    const bottomPanel = new Panel( new VBox( {
      spacing: 5,
      align: 'left',
      stretch: true,
      children: [

        // 'Always circular' checkbox
        KeplersLawsCheckbox.createAlwaysCircularCheckbox( model.alwaysCircularProperty, tandem.createTandem( 'alwaysCircularCheckbox' ) ),

        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Speed', 'Velocity', and 'Gravity Force' checkboxes
        SolarSystemCommonCheckbox.createSpeedCheckbox( visibleProperties.speedVisibleProperty, tandem.createTandem( 'speedCheckbox' ) ),
        SolarSystemCommonCheckbox.createVelocityCheckbox( visibleProperties.velocityVisibleProperty, tandem.createTandem( 'velocityCheckbox' ) ),
        SolarSystemCommonCheckbox.createGravityForceCheckbox( visibleProperties.gravityVisibleProperty, tandem.createTandem( 'gravityForceCheckbox' ) ),

        // Gravity 'Zoom' slider
        new GravityScaleSlider( model.forceScaleProperty, visibleProperties.gravityVisibleProperty ),

        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Grid' and 'Measuring Tape' checkboxes
        SolarSystemCommonCheckbox.createGridCheckbox( visibleProperties.gridVisibleProperty, tandem.createTandem( 'gridCheckbox' ) ),
        SolarSystemCommonCheckbox.createMeasuringTapeCheckbox( visibleProperties.measuringTapeVisibleProperty, tandem.createTandem( 'measuringTapeCheckbox' ) ),

        // 'Stopwatch' checkbox
        KeplersLawsCheckbox.createStopwatchCheckbox( visibleProperties.stopwatchVisibleProperty, tandem.createTandem( 'stopwatchCheckbox' ) )
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

keplersLaws.register( 'KeplersLawsPanels', KeplersLawsPanels );