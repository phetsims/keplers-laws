// Copyright 2023, University of Colorado Boulder

/**
 * First Law Screen, where the user can learn about Kepler's Laws via an elliptical orbit
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
import FirstLawScreenIcon from './FirstLawScreenIcon.js';

class FirstLawScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: KeplersLawsStrings.screen.firstLawStringProperty,
      homeScreenIcon: new FirstLawScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem
    };

    super(
      () => new KeplersLawsModel( {
        initialLaw: LawMode.FIRST_LAW,
        tandem: tandem.createTandem( 'model' )
      } ),
      model => new KeplersLawsScreenView( model, {
        tandem: tandem.createTandem( 'view' )
      } ),
      options
    );
  }
}

keplersLaws.register( 'FirstLawScreen', FirstLawScreen );
export default FirstLawScreen;