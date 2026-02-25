// Copyright 2023-2025, University of Colorado Boulder

/**
 * FirstLawPanels is the set of control panels for the First Law.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import EccentricityPanel from './EccentricityPanel.js';
import MoreOrbitalDataPanel from './MoreOrbitalDataPanel.js';
import OrbitalDataPanel from './OrbitalDataPanel.js';

export default class FirstLawPanels extends VBox {
  public constructor(
    model: KeplersLawsModel,
    semiaxesVisibleProperty: TReadOnlyProperty<boolean>,
    eccentricityVisibleProperty: TReadOnlyProperty<boolean>,
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