// Copyright 2023, University of Colorado Boulder

/**
 * TODO https://github.com/phetsims/keplers-laws/issues/134
 *
 * @author Agustín Vallejo
 */

import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, Line, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import FirstLawGraph from './FirstLawGraph.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import keplersLaws from '../../keplersLaws.js';

export default class EccentricityPanel extends Panel {
  public constructor( model: Pick<KeplersLawsModel, 'engine' | 'eccentricityVisibleProperty' > ) {
    super( new VBox( {
      children: [
        new HBox( {
          justify: 'left',
          margin: 5,
          children: [
            new Text( KeplersLawsStrings.eccentricityEquationStringProperty, KeplersLawsConstants.TITLE_OPTIONS ),
            new VBox( {
              children: [
                new Text( KeplersLawsStrings.symbols.focalDistanceStringProperty, combineOptions<TextOptions>( {},
                  KeplersLawsConstants.TITLE_OPTIONS, {
                    fill: KeplersLawsColors.focalDistanceColorProperty
                  } ) ),
                new Line( 0, 0, 30, 0, { stroke: SolarSystemCommonColors.foregroundProperty, lineWidth: 1.5, lineCap: 'round' } ),
                new Text( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, combineOptions<TextOptions>( {},
                  KeplersLawsConstants.TITLE_OPTIONS, {
                    fill: KeplersLawsColors.semiMajorAxisColorProperty
                  } ) )
              ]
            } )
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