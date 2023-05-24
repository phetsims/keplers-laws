// Copyright 2023, University of Colorado Boulder

/**
 *
 * Second Law Screen Icon: multiple elliptical segments that represent area filling
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../keplersLaws.js';
import KeplersLawsScreenIcon from '../keplers-laws/view/KeplersLawsScreenIcon.js';
import SecondLawScreenIcon from '../second-law/SecondLawScreenIcon.js';
import FirstLawScreenIcon from '../first-law/FirstLawScreenIcon.js';
import { Node } from '../../../scenery/js/imports.js';

export default class LabScreenIcon extends KeplersLawsScreenIcon {
  public constructor() {

    const commonNode = KeplersLawsScreenIcon.getCommonNode();
    const secondLawNode = SecondLawScreenIcon.getSecondLawNode( commonNode );
    const firstLawNode = FirstLawScreenIcon.getFirstLawNode();

    super( new Node( {
      children: [ secondLawNode, firstLawNode ]
    } ) );
  }
}

keplersLaws.register( 'LabScreenIcon', LabScreenIcon );