// Copyright 2023, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsOrbitalInformationBox from './KeplersLawsOrbitalInformationBox.js';
import keplersLaws from '../../keplersLaws.js';

class KeplersLawsControls extends Panel {
  public constructor( model: KeplersLawsModel, tandem: Tandem ) {
    super( new VBox( {
      children: [
        new KeplersLawsOrbitalInformationBox( model, {
          tandem: tandem
        } ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, tandem ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, tandem )
      ],
      spacing: 5,
      align: 'left',
      stretch: true,
      maxWidth: SolarSystemCommonConstants.MAX_WIDTH
    } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );
  }
}

keplersLaws.register( 'KeplersLawsControls', KeplersLawsControls );
export default KeplersLawsControls;