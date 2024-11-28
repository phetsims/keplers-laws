// Copyright 2023-2024, University of Colorado Boulder

/**
 * ThirdLawPanels is the set of control panels for the Third Law.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import StarMassPanel from './StarMassPanel.js';
import ThirdLawAccordionBox from './ThirdLawAccordionBox.js';

export default class ThirdLawPanels extends VBox {
  public constructor( model: KeplersLawsModel, thirdLawAccordionBoxExpandedProperty: BooleanProperty, tandem: Tandem ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new ThirdLawAccordionBox( model, thirdLawAccordionBoxExpandedProperty, tandem.createTandem( 'graphAccordionBox' ) ),
        new StarMassPanel( model, tandem.createTandem( 'starMassPanel' ) )
      ],
      visibleProperty: model.isThirdLawProperty,
      tandem: tandem
    } );
  }
}

keplersLaws.register( 'ThirdLawPanels', ThirdLawPanels );