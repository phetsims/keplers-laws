// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's second law panel control: Swept area
 *
 * This class is mostly empty and only has SecondLawGraph as a child to keep code consistency across the three laws.
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { VBox } from '../../../../scenery/js/imports.js';
import SecondLawGraphAccordionBox from './SecondLawGraphAccordionBox.js';
import keplersLaws from '../../keplersLaws.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import PeriodDivisionsPanel from './PeriodDivisionsPanel.js';

export default class SecondLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new PeriodDivisionsPanel( model ),
        new SecondLawGraphAccordionBox( model )
      ],
      visibleProperty: model.isSecondLawProperty,
      maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 1.5
    } );
  }
}

keplersLaws.register( 'SecondLawPanels', SecondLawPanels );