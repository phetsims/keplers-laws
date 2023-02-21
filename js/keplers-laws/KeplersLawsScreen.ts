// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's Laws Screen, where the user can learn about Kepler's Laws via an elliptical orbit
 *
 * @author Agustín Vallejo
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import mySolarSystem from '../../../my-solar-system/js/mySolarSystem.js';
import KeplersLawsModel from './model/KeplersLawsModel.js';
import KeplersLawsScreenView from './view/KeplersLawsScreenView.js';
import KeplersLawsScreenIcon from './view/KeplersLawsScreenIcon.js';

class KeplersLawsScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      homeScreenIcon: new KeplersLawsScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem
    };

    super(
      () => new KeplersLawsModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new KeplersLawsScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

mySolarSystem.register( 'KeplersLawsScreen', KeplersLawsScreen );
export default KeplersLawsScreen;