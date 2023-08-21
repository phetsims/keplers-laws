// Copyright 2023, University of Colorado Boulder

/**
 *
 * All Laws Screen Icons: This screen allows you to analyze a single orbit through the lens of
 * all three of Kepler's Laws. The law is selected via the buttons on the bottom left.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../keplersLaws.js';
import KeplersLawsScreenIcon from '../common/view/KeplersLawsScreenIcon.js';
import SecondLawScreenIcon from '../second-law/SecondLawScreenIcon.js';
import FirstLawScreenIcon from '../first-law/FirstLawScreenIcon.js';
import { Node } from '../../../scenery/js/imports.js';
import ThirdLawScreenIcon from '../third-law/ThirdLawScreenIcon.js';

export default class AllLawsScreenIcon extends KeplersLawsScreenIcon {
  public constructor() {

    const secondLawNode = SecondLawScreenIcon.createFullNode();
    const firstLawNode = FirstLawScreenIcon.createFirstLawNode( false );
    const periodTimerNode = ThirdLawScreenIcon.createPeriodTimerNode();

    super( new Node( {
      children: [ secondLawNode, firstLawNode, periodTimerNode ]
    } ) );
  }
}

keplersLaws.register( 'AllLawsScreenIcon', AllLawsScreenIcon );