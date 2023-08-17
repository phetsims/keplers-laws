// Copyright 2023, University of Colorado Boulder

//REVIEW bogus documentation, copy-paste from SecondLawScreenIcon
/**
 *
 * Second Law Screen Icon: multiple elliptical segments that represent area filling
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

    const secondLawNode = SecondLawScreenIcon.getFullNode();
    const firstLawNode = FirstLawScreenIcon.getFirstLawNode( false );
    const periodTimerNode = ThirdLawScreenIcon.getPeriodTimerNode();

    super( new Node( {
      children: [ secondLawNode, firstLawNode, periodTimerNode ]
    } ) );
  }
}

keplersLaws.register( 'AllLawsScreenIcon', AllLawsScreenIcon );