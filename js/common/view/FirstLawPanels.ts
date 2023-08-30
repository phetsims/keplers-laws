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
import FirstLawValuesPanel from './FirstLawValuesPanel.js';
import FirstLawMoreDataPanel from './FirstLawMoreDataPanel.js';

export default class FirstLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {

    const eccentricityPanel = new EccentricityPanel( model );
    const valuesPanel = new FirstLawValuesPanel( model );
    const moreOrbitalDataPanel = new FirstLawMoreDataPanel( model );

    super( {
      isDisposable: false,
      visibleProperty: model.isFirstLawProperty,
      margin: 5,
      children: [
        eccentricityPanel,
        valuesPanel,
        moreOrbitalDataPanel
      ]
    } );
  }
}

keplersLaws.register( 'FirstLawPanels', FirstLawPanels );