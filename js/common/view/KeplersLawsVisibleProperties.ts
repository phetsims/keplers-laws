// Copyright 2023, University of Colorado Boulder

/**
 * KeplersLawsVisibleProperties is an abstract class that each law will use to define the visible properties
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonVisibleProperties from '../../../../solar-system-common/js/view/SolarSystemCommonVisibleProperties.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

export default class KeplersLawsVisibleProperties extends SolarSystemCommonVisibleProperties {

  protected visibleProperties: BooleanProperty[];

  public constructor( tandem: Tandem ) {
    super( tandem );
    this.visibleProperties = [];

    // TODO: Create child classes for each Law and add the visible properties here, see https://github.com/phetsims/my-solar-system/issues/225
  }
}

keplersLaws.register( 'KeplersLawsVisibleProperties', KeplersLawsVisibleProperties );