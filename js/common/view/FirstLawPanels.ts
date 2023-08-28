// Copyright 2023, University of Colorado Boulder

/**
 * FirstLawPanels is the set of control panels for the First Law.
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, Line, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import FirstLawGraphPanel from './FirstLawGraphPanel.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import FirstLawValuesPanel from './FirstLawValuesPanel.js';
import FirstLawMoreDataPanel from './FirstLawMoreDataPanel.js';

export default class FirstLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {

    const eccentricityPanel = new EccentricityPanel( model );
    const valuesPanel = new FirstLawValuesPanel( model, {
      minWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
    } );
    const extraDataPanel = new FirstLawMoreDataPanel( model, {
      minWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
    } );

    super( {
      isDisposable: false,
      margin: 5,
      children: [
        eccentricityPanel,
        valuesPanel,
        extraDataPanel
      ],
      maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 1.5
    } );
  }
}

class EccentricityPanel extends Panel {
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
        new FirstLawGraphPanel( model.engine.eccentricityProperty )
      ],
      spacing: 10,
      align: 'left',
      stretch: true
    } ), combineOptions<PanelOptions>( {
      visibleProperty: model.eccentricityVisibleProperty
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) );
  }
}

keplersLaws.register( 'FirstLawPanels', FirstLawPanels );