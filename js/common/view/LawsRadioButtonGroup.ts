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
import LawMode from '../model/LawMode.js';
import keplersLaws from '../../keplersLaws.js';
import FirstLawScreenIcon from '../../first-law/FirstLawScreenIcon.js';
import SecondLawScreenIcon from '../../second-law/SecondLawScreenIcon.js';
import ThirdLawScreenIcon from '../../third-law/ThirdLawScreenIcon.js';
import Property from '../../../../axon/js/Property.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

export type LawsRadioButtonGroupOptions = RectangularRadioButtonGroupOptions;

export default class LawsRadioButtonGroup extends RectangularRadioButtonGroup<LawMode> {
  public constructor( selectedLawProperty: Property<LawMode>, providedOptions?: LawsRadioButtonGroupOptions ) {
    const options = combineOptions<LawsRadioButtonGroupOptions>( {
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: null,
        buttonAppearanceStrategyOptions: {
          selectedStroke: '#60a9dd',
          selectedLineWidth: 4,
          deselectedStroke: '#60a9dd',
          deselectedLineWidth: 2
        }
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 10,

      isDisposable: false
    }, providedOptions );


    // Intentionally left without KeplersLawsStrings because this buttons will have icons
    super( selectedLawProperty, [
      {
        value: LawMode.FIRST_LAW,
        createNode: () => new Node( { children: [ FirstLawScreenIcon.createFullNode() ], scale: 1.5 } ),
        tandemName: 'firstLawButton',
        labelContent: KeplersLawsStrings.a11y.firstLawStringProperty
      },
      {
        value: LawMode.SECOND_LAW,
        createNode: () => new Node( { children: [ SecondLawScreenIcon.createFullNode() ], scale: 1.5 } ),
        tandemName: 'secondLawButton',
        labelContent: KeplersLawsStrings.a11y.secondLawStringProperty
      },
      {
        value: LawMode.THIRD_LAW,
        createNode: () => new Node( { children: [ ThirdLawScreenIcon.createFullNode() ], scale: 1.5 } ),
        tandemName: 'thirdLawButton',
        labelContent: KeplersLawsStrings.a11y.thirdLawStringProperty
      }
    ], options );
  }
}

keplersLaws.register( 'LawsRadioButtonGroup', LawsRadioButtonGroup );
