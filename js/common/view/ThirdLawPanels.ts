// Copyright 2023, University of Colorado Boulder

/**
 * ThirdLawPanels is the set of control panels for the Third Law.
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { VBox } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StarMassPanel from './StarMassPanel.js';
import keplersLaws from '../../keplersLaws.js';
import { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import ThirdLawAccordionBox from './ThirdLawAccordionBox.js';

type SelfOptions = EmptySelfOptions;
export type ThirdLawAccordionBoxOptions = AccordionBoxOptions & SelfOptions;

export default class ThirdLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new ThirdLawAccordionBox( model ),
        new StarMassPanel( model )
      ],
      visibleProperty: model.isThirdLawProperty
    } );
  }
}

keplersLaws.register( 'ThirdLawPanels', ThirdLawPanels );