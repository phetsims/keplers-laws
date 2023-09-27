// Copyright 2023, University of Colorado Boulder

/**
 * AllLaws Screen, where the user can learn about Kepler's Laws via an elliptical orbit.
 * This screen is the combination of the three previous ones, and allows the user to select
 * which law to visualize on the same orbit.
 *
 * @author Agustín Vallejo
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import KeplersLawsModel from '../common/model/KeplersLawsModel.js';
import LawMode from '../common/model/LawMode.js';
import KeplersLawsScreenView from '../common/view/KeplersLawsScreenView.js';
import keplersLaws from '../keplersLaws.js';
import KeplersLawsStrings from '../KeplersLawsStrings.js';
import AllLawsScreenIcon from './AllLawsScreenIcon.js';
import KeplersLawsKeyboardHelpContent from '../common/view/KeplersLawsKeyboardHelpContent.js';

class AllLawsScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: KeplersLawsStrings.screen.allLawsStringProperty,
      homeScreenIcon: new AllLawsScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem,
      createKeyboardHelpNode: () => new KeplersLawsKeyboardHelpContent()
    };

    super(
      () => new KeplersLawsModel( {
        initialLaw: LawMode.FIRST_LAW,
        isLab: true,
        tandem: tandem.createTandem( 'model' )
      } ),
      model => new KeplersLawsScreenView( model, {
        tandem: tandem.createTandem( 'view' ),
        allowLawSelection: true
      } ),
      options
    );
  }
}

keplersLaws.register( 'AllLawsScreen', AllLawsScreen );
export default AllLawsScreen;