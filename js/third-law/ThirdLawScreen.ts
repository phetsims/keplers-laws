// Copyright 2023, University of Colorado Boulder

/**
 * Third Law Screen, where the user can learn about Kepler's Laws via an elliptical orbit
 *
 * @author Agustín Vallejo
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import KeplersLawsModel from '../keplers-laws/model/KeplersLawsModel.js';
import LawMode from '../keplers-laws/model/LawMode.js';
import KeplersLawsScreenView from '../keplers-laws/view/KeplersLawsScreenView.js';
import keplersLaws from '../keplersLaws.js';
import KeplersLawsStrings from '../KeplersLawsStrings.js';
import ThirdLawScreenIcon from './ThirdLawScreenIcon.js';

class ThirdLawScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: KeplersLawsStrings.screen.thirdLawStringProperty,
      homeScreenIcon: new ThirdLawScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem
    };

    super(
      () => new KeplersLawsModel( {
        initialLaw: LawMode.THIRD_LAW,
        tandem: tandem.createTandem( 'model' )
      } ),
      model => new KeplersLawsScreenView( model, {
        tandem: tandem.createTandem( 'view' )
      } ),
      options
    );
  }
}

keplersLaws.register( 'ThirdLawScreen', ThirdLawScreen );
export default ThirdLawScreen;