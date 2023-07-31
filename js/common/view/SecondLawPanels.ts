// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's second law panel control: Swept area
 *
 * This class is mostly empty and only has SecondLawGraph as a child to keep code consistency across the three laws.
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import SecondLawGraph from './SecondLawGraph.js';
import keplersLaws from '../../keplersLaws.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsConstants from '../../KeplersLawsConstants.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Range from '../../../../dot/js/Range.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import PeriodDivisionSoundManager from './PeriodDivisionSoundManager.js';

const divisionsRangeProperty = new TinyProperty( new Range(
  KeplersLawsConstants.MIN_ORBITAL_DIVISIONS,
  KeplersLawsConstants.MAX_ORBITAL_DIVISIONS
) );

export default class SecondLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new SecondLawPanel( model ),
        new SecondLawGraph( model )
      ],
      visibleProperty: model.isSecondLawProperty,
      maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 1.5
    } );
  }
}

class SecondLawPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const options = combineOptions<PanelOptions>( {
      visibleProperty: model.isSecondLawProperty
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );

    super( new VBox( {
      spacing: SolarSystemCommonConstants.CHECKBOX_SPACING,
      align: 'left',
      children: [
        new Text( KeplersLawsStrings.area.periodDivisionStringProperty, KeplersLawsConstants.TEXT_OPTIONS ),
        new NumberSpinner( model.periodDivisionProperty, divisionsRangeProperty, {
          arrowsPosition: 'leftRight',
          layoutOptions: {
            align: 'center'
          },
          arrowsSoundPlayer: nullSoundPlayer,
          accessibleName: KeplersLawsStrings.area.periodDivisionStringProperty
          } ),
        new SolarSystemCommonCheckbox( model.areaValuesVisibleProperty, new Text( KeplersLawsStrings.area.valuesStringProperty, KeplersLawsConstants.TEXT_OPTIONS ), {
          accessibleName: KeplersLawsStrings.area.valuesStringProperty
        } ),
        new SolarSystemCommonCheckbox( model.timeValuesVisibleProperty, new Text( KeplersLawsStrings.area.timeValuesStringProperty, KeplersLawsConstants.TEXT_OPTIONS ), {
          accessibleName: KeplersLawsStrings.area.timeValuesStringProperty
        } )
      ]
    } ), options );

    const periodDivisionSounds = new PeriodDivisionSoundManager();

    model.periodDivisionProperty.lazyLink( periodDivision => {
      periodDivisionSounds.playPeriodDivisionSound( periodDivision );
    } );
  }
}

keplersLaws.register( 'SecondLawPanels', SecondLawPanels );