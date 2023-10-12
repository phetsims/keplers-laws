// Copyright 2023, University of Colorado Boulder

/**
 * FirstLawPanels is the set of control panels for the First Law.
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { VBox } from '../../../../scenery/js/imports.js';
import keplersLaws from '../../keplersLaws.js';
import EccentricityPanel from './EccentricityPanel.js';
import OrbitalDataPanel from './OrbitalDataPanel.js';
import MoreOrbitalDataPanel from './MoreOrbitalDataPanel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

export default class FirstLawPanels extends VBox {
  public constructor(
    model: KeplersLawsModel,
    semiaxesVisibleProperty: BooleanProperty,
    eccentricityVisibleProperty: BooleanProperty,
    tandem: Tandem ) {
    super( {
      isDisposable: false,
      visibleProperty: model.isFirstLawProperty,
      margin: 5,
      children: [
        new EccentricityPanel( model.engine.eccentricityProperty, eccentricityVisibleProperty, tandem.createTandem( 'eccentricityPanel' ) ),
        new OrbitalDataPanel( model, semiaxesVisibleProperty, eccentricityVisibleProperty, tandem.createTandem( 'orbitalDataPanel' ) ),
        new MoreOrbitalDataPanel( model, tandem.createTandem( 'moreOrbitalDataPanel' ) )
      ],
      tandem: tandem
    } );
  }
}

keplersLaws.register( 'FirstLawPanels', FirstLawPanels );