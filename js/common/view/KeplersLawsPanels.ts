// Copyright 2023-2024, University of Colorado Boulder

/**
 * KeplersLawsPanels is the collection of panels that appears in the top-right corner of all screens.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HSeparator, Node, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import GravityForceZoomControl from '../../../../solar-system-common/js/view/GravityForceZoomControl.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsCheckbox from './KeplersLawsCheckbox.js';
import KeplersLawsVisibleProperties from './KeplersLawsVisibleProperties.js';
import OrbitalInformationPanel from './OrbitalInformationPanel.js';
import TargetOrbitPanel from './TargetOrbitPanel.js';

export default class KeplersLawsPanels extends VBox {

  public constructor( model: KeplersLawsModel, visibleProperties: KeplersLawsVisibleProperties, topLayer: Node, tandem: Tandem ) {

    // Panel that contains the combo box for selecting a target orbit
    const targetOrbitPanel = new TargetOrbitPanel( model, topLayer, visibleProperties.targetOrbitPanelVisibleProperty,
      model.hasFirstLawFeatures || model.hasThirdLawFeatures ? tandem.createTandem( 'targetOrbitPanel' ) : Tandem.OPT_OUT );
    targetOrbitPanel.addLinkedElement( visibleProperties.targetOrbitPanelVisibleProperty, {
      tandemName: 'visibleProperty'
    } );

    // Panel that contains checkboxes related to Foci, Axes, and Eccentricity
    const orbitalInformationPanel = new OrbitalInformationPanel( model, visibleProperties, tandem.createTandem( 'orbitalInformationPanel' ) );

    // A bunch of unrelated controls, so we named the panel based on its position in the layout.
    const visibilityPanelTandem = tandem.createTandem( 'visibilityPanel' );
    const visibilityPanel = new Panel( new VBox( {
      spacing: SolarSystemCommonConstants.VBOX_SPACING,
      align: 'left',
      stretch: true,
      children: [

        // 'Always circular' checkbox
        KeplersLawsCheckbox.createAlwaysCircularCheckbox( model.alwaysCircularProperty, visibilityPanelTandem.createTandem( 'alwaysCircularCheckbox' ) ),

        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Speed', 'Velocity', and 'Gravity Force' checkboxes
        SolarSystemCommonCheckbox.createSpeedCheckbox( visibleProperties.speedVisibleProperty, visibilityPanelTandem.createTandem( 'speedCheckbox' ) ),
        SolarSystemCommonCheckbox.createVelocityCheckbox( visibleProperties.velocityVisibleProperty, visibilityPanelTandem.createTandem( 'velocityCheckbox' ) ),
        SolarSystemCommonCheckbox.createGravityForceCheckbox( visibleProperties.gravityVisibleProperty, visibilityPanelTandem.createTandem( 'gravityForceCheckbox' ) ),

        // Gravity 'Zoom' control (labeled slider)
        new GravityForceZoomControl( model.gravityForceScalePowerProperty, visibleProperties.gravityVisibleProperty,
          visibilityPanelTandem.createTandem( 'gravityForceZoomControl' ) ),

        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Grid' and 'Measuring Tape' checkboxes
        SolarSystemCommonCheckbox.createGridCheckbox( visibleProperties.gridVisibleProperty, visibilityPanelTandem.createTandem( 'gridCheckbox' ) ),
        SolarSystemCommonCheckbox.createMeasuringTapeCheckbox( visibleProperties.measuringTapeVisibleProperty, visibilityPanelTandem.createTandem( 'measuringTapeCheckbox' ) ),

        // 'Stopwatch' checkbox
        KeplersLawsCheckbox.createStopwatchCheckbox( visibleProperties.stopwatchVisibleProperty, visibilityPanelTandem.createTandem( 'stopwatchCheckbox' ) )
      ],
      tandem: visibilityPanelTandem,
      phetioVisiblePropertyInstrumented: true,

      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } ), SolarSystemCommonConstants.PANEL_OPTIONS );

    super( {
      isDisposable: false,
      spacing: 7,
      children: [
        targetOrbitPanel,
        orbitalInformationPanel,
        visibilityPanel
      ]
    } );
  }
}

keplersLaws.register( 'KeplersLawsPanels', KeplersLawsPanels );