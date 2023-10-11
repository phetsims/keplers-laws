// Copyright 2023, University of Colorado Boulder

/**
 * ThirdLawPanels is the set of control panels for the Third Law.
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { VBox } from '../../../../scenery/js/imports.js';
import StarMassPanel from './StarMassPanel.js';
import keplersLaws from '../../keplersLaws.js';
import ThirdLawAccordionBox from './ThirdLawAccordionBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

export default class ThirdLawPanels extends VBox {
  public constructor( model: KeplersLawsModel, thirdLawAccordionBoxExpandedProperty: BooleanProperty, tandem: Tandem ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new ThirdLawAccordionBox( model, thirdLawAccordionBoxExpandedProperty ),
        new StarMassPanel( model )
      ],
      visibleProperty: model.isThirdLawProperty,
      tandem: tandem
    } );
  }
}

keplersLaws.register( 'ThirdLawPanels', ThirdLawPanels );