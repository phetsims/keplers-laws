// Copyright 2023, University of Colorado Boulder

/**
 * Provides a specific class for handling the buttons that
 * coordinate the specific Kepler's Law being seen in the screen.
 *
 * @author Agustín Vallejo
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import LawMode from '../model/LawMode.js';
import keplersLaws from '../../keplersLaws.js';
import FirstLawScreenIcon from '../../first-law/FirstLawScreenIcon.js';
import SecondLawScreenIcon from '../../second-law/SecondLawScreenIcon.js';
import ThirdLawScreenIcon from '../../third-law/ThirdLawScreenIcon.js';

export type LawsButtonsOptions = RectangularRadioButtonGroupOptions;

export default class LawsButtons extends RectangularRadioButtonGroup<LawMode> {
  public constructor( model: KeplersLawsModel, providedOptions?: LawsButtonsOptions ) {
    const options = combineOptions<LawsButtonsOptions>( {
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: '#555',
        buttonAppearanceStrategyOptions: {
          selectedStroke: '#60a9dd',
          selectedLineWidth: 4
        }
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 10
    }, providedOptions );


    // Intentionally left without KeplersLawsStrings because this buttons will have icons
    super( model.selectedLawProperty, [
      {
        value: LawMode.FIRST_LAW,
        createNode: () => new Node( { children: [ FirstLawScreenIcon.getFullNode() ], scale: 2 } ),
        tandemName: 'firstLawButton'
      },
      {
        value: LawMode.SECOND_LAW,
        createNode: () => new Node( { children: [ SecondLawScreenIcon.getFullNode() ], scale: 2 } ),
        tandemName: 'secondLawButton'
      },
      {
        value: LawMode.THIRD_LAW,
        createNode: () => new Node( { children: [ ThirdLawScreenIcon.getFullNode() ], scale: 2 } ),
        tandemName: 'thirdLawButton'
      }
    ], options );
  }
}

keplersLaws.register( 'LawsButtons', LawsButtons );
