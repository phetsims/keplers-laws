// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Agustín Vallejo
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import KeplersLawsColors from '../common/KeplersLawsColors.js';
import keplersLaws from '../keplersLaws.js';
import KeplersLawsModel from './model/KeplersLawsModel.js';
import KeplersLawsScreenView from './view/KeplersLawsScreenView.js';
import KeplersLawsStrings from '../KeplersLawsStrings.js';

type SelfOptions = {
  //TODO add options that are specific to KeplersLawsScreen here
};

type KeplersLawsScreenOptions = SelfOptions & ScreenOptions;

class KeplersLawsScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( providedOptions: KeplersLawsScreenOptions ) {

    const options = optionize<KeplersLawsScreenOptions, SelfOptions, ScreenOptions>()( {
      name: KeplersLawsStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: KeplersLawsColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new KeplersLawsModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new KeplersLawsScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

keplersLaws.register( 'KeplersLawsScreen', KeplersLawsScreen );
export default KeplersLawsScreen;