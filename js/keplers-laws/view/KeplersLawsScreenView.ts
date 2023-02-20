// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Agustín Vallejo
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import KeplersLawsConstants from '../../common/KeplersLawsConstants.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
 //TODO add options that are specific to KeplersLawsScreenView here
};

type KeplersLawsScreenViewOptions = SelfOptions & ScreenViewOptions;

class KeplersLawsScreenView extends ScreenView {

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {

    const options = optionize<KeplersLawsScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - KeplersLawsConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - KeplersLawsConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

keplersLaws.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;