// Copyright 2023, University of Colorado Boulder

/**
 * SecondLawPanels is the set of control panels for the Second Law.
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { VBox } from '../../../../scenery/js/imports.js';
import SecondLawAccordionBox from './SecondLawAccordionBox.js';
import keplersLaws from '../../keplersLaws.js';
import PeriodDivisionsPanel from './PeriodDivisionsPanel.js';
import MoreOrbitalDataPanel from './MoreOrbitalDataPanel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import KeplersLawsVisibleProperties from './KeplersLawsVisibleProperties.js';

export default class SecondLawPanels extends VBox {
  public constructor( model: KeplersLawsModel, visibleProperties: KeplersLawsVisibleProperties, tandem: Tandem ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new PeriodDivisionsPanel( model, visibleProperties, tandem.createTandem( 'periodDivisionsPanel' ) ),
        new SecondLawAccordionBox( model, visibleProperties.secondLawAccordionBoxExpandedProperty ),
        ...( model.isAllLaws ? [] : [ new MoreOrbitalDataPanel( model, tandem.createTandem( 'moreOrbitalDataPanel' ) ) ] )
      ],
      visibleProperty: model.isSecondLawProperty,
      tandem: tandem
    } );
  }
}

keplersLaws.register( 'SecondLawPanels', SecondLawPanels );