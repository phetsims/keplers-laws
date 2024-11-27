// Copyright 2023, University of Colorado Boulder

/**
 * Second Law Screen, where the user can learn about Kepler's Laws via an elliptical orbit.
 * In this screen, the orbit is divided in equal area sections, and the user can learn that
 * to cover each of those areas, equals amounts of time are needed.
 *
 * @author Agustín Vallejo
 */

import Screen from '../../../joist/js/Screen.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import Tandem from '../../../tandem/js/Tandem.js';
import KeplersLawsModel from '../common/model/KeplersLawsModel.js';
import LawMode from '../common/model/LawMode.js';
import KeplersLawsKeyboardHelpContent from '../common/view/KeplersLawsKeyboardHelpContent.js';
import KeplersLawsScreenView from '../common/view/KeplersLawsScreenView.js';
import keplersLaws from '../keplersLaws.js';
import KeplersLawsStrings from '../KeplersLawsStrings.js';
import SecondLawScreenIcon from './SecondLawScreenIcon.js';

class SecondLawScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: KeplersLawsStrings.screen.secondLawStringProperty,
      homeScreenIcon: new SecondLawScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem,
      createKeyboardHelpNode: () => new KeplersLawsKeyboardHelpContent( false )
    };

    super(
      () => new KeplersLawsModel( {
        initialLaw: LawMode.SECOND_LAW,
        tandem: tandem.createTandem( 'model' )
      } ),
      model => new KeplersLawsScreenView( model, {
        tandem: tandem.createTandem( 'view' )
      } ),
      options
    );
  }
}

keplersLaws.register( 'SecondLawScreen', SecondLawScreen );
export default SecondLawScreen;