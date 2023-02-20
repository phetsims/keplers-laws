// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TModel from '../../../../joist/js/TModel.js';

type SelfOptions = {
  //TODO add options that are specific to KeplersLawsModel here
};

type KeplersLawsModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class KeplersLawsModel implements TModel {

  public constructor( providedOptions: KeplersLawsModelOptions ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

keplersLaws.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;