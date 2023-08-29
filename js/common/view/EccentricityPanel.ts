// Copyright 2023, University of Colorado Boulder

/**
 * Panel that displays the different possible eccentricities within 0 and 1, as well as the
 * current orbital eccentricity and the equation e = c/a .
 *
 * @author Agustín Vallejo
 */

import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import FirstLawGraph from './FirstLawGraph.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import keplersLaws from '../../keplersLaws.js';
import FractionNode from './FractionNode.js';

export default class EccentricityPanel extends Panel {
  public constructor( model: Pick<KeplersLawsModel, 'engine' | 'eccentricityVisibleProperty' > ) {
    super( new VBox( {
      children: [
        new HBox( {
          justify: 'left',
          margin: 5,
          children: [
            new Text( KeplersLawsStrings.eccentricityEquationStringProperty, KeplersLawsConstants.TITLE_OPTIONS ),
            new FractionNode(
                new Text( KeplersLawsStrings.symbols.focalDistanceStringProperty, combineOptions<TextOptions>( {},
                  KeplersLawsConstants.TITLE_OPTIONS, {
                    fill: KeplersLawsColors.focalDistanceColorProperty
                  } ) ),
                new Text( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, combineOptions<TextOptions>( {},
                  KeplersLawsConstants.TITLE_OPTIONS, {
                    fill: KeplersLawsColors.semiMajorAxisColorProperty
                  } ) )
            )
          ]
        } ),
        new FirstLawGraph( model.engine.eccentricityProperty )
      ],
      spacing: 10,
      align: 'left',
      stretch: true
    } ), combineOptions<PanelOptions>( {
      visibleProperty: model.eccentricityVisibleProperty
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) );
  }
}

keplersLaws.register( 'EccentricityPanel', EccentricityPanel );