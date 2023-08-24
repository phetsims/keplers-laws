// Copyright 2023, University of Colorado Boulder


/**
 * Node that controls the extra visual elements of the sim. Designed as follows:
 * - The top part contains is a VBox, in it:
 *    - The target orbit selector.
 *    - The orbital information box. i.e. the checkboxes for each specific law
 * - The bottom part contains the checkboxes for the arrows and the information. Universal for all laws.
 *
 * @author Agustín Vallejo
 */

import { HBox, HSeparator, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
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

class KeplersLawsControls extends VBox {
  public constructor( model: KeplersLawsModel, topLayer: Node, tandem: Tandem ) {

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

    const targetOrbitsPanel = new TargetOrbitsPanel( model, topLayer );

    // Creates a custom VBox with the provided and default options
    const createVBox = ( children: Node[], providedOptions?: VBoxOptions ) => {
      return new VBox( combineOptions<VBoxOptions>( {
        children: children,
        spacing: 5,
        align: 'left',
        stretch: true,
        maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
      }, providedOptions ) );
    };

    super( {
      isDisposable: false,
      children: [
        // Target orbit and individual laws checkboxes
        createVBox( [
          targetOrbitsPanel,
          new Panel( new KeplersLawsOrbitalInformationBox( model, {
            tandem: tandem
          } ), combineOptions<PanelOptions>( {
            minWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
          }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) )
        ], { justify: 'top' } ),

        // Common checkboxes
        new Panel( createVBox( [
          new SolarSystemCommonCheckbox(
            model.alwaysCircularProperty,
            new Text( KeplersLawsStrings.circularOrbitStringProperty, KeplersLawsConstants.TEXT_OPTIONS ),
            {
              accessibleName: KeplersLawsStrings.circularOrbitStringProperty
            } ),
          new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
          ...createArrowsVisibilityCheckboxes( model, tandem ),
          new GravityScaleSlider( model.forceScaleProperty, model.gravityVisibleProperty ),
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
        ] ), combineOptions<PanelOptions>( {
          maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
        }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) )
      ],
      spacing: SolarSystemCommonConstants.CHECKBOX_SPACING
    } );
  }
}

keplersLaws.register( 'KeplersLawsControls', KeplersLawsControls );
export default KeplersLawsControls;