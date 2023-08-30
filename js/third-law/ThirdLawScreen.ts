// Copyright 2023, University of Colorado Boulder

/**
 * Third Law Screen, where the user can learn about Kepler's Laws via an elliptical orbit.
 * In this screen, the user can learn that the square of the period of an orbit is proportional to the cube of the
 * semi-major axis of the orbit.
 *
 * For that learning goal, there's a T vs 'a' graph that shows the relationship between those two variables.
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
import ThirdLawScreenIcon from './ThirdLawScreenIcon.js';
import KeplersLawsKeyboardHelpContent from '../common/view/KeplersLawsKeyboardHelpContent.js';

class ThirdLawScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: KeplersLawsStrings.screen.thirdLawStringProperty,
      homeScreenIcon: new ThirdLawScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem,
      createKeyboardHelpNode: () => new KeplersLawsKeyboardHelpContent()
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