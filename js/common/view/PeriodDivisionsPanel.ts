// Copyright 2023, University of Colorado Boulder
/**
 * Panel that contains the Period Divisions number spinner.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import PeriodDivisionSoundManager from './PeriodDivisionSoundManager.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Range from '../../../../dot/js/Range.js';

const divisionsRangeProperty = new TinyProperty( new Range(
  KeplersLawsConstants.MIN_ORBITAL_DIVISIONS,
  KeplersLawsConstants.MAX_ORBITAL_DIVISIONS
) );

export default class PeriodDivisionsPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const options = combineOptions<PanelOptions>( {
      isDisposable: false,
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
          touchAreaXDilation: 15,
          touchAreaYDilation: 5,
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
      if ( !model.resetting ) {
        periodDivisionSounds.playPeriodDivisionSound( periodDivision );
      }
    } );
  }
}

keplersLaws.register( 'PeriodDivisionsPanel', PeriodDivisionsPanel );