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
import { Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import PeriodDivisionSoundManager from './PeriodDivisionSoundManager.js';
import KeplersLawsCheckbox from './KeplersLawsCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import KeplersLawsVisibleProperties from './KeplersLawsVisibleProperties.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export default class PeriodDivisionsPanel extends Panel {

  public constructor( model: KeplersLawsModel, visibleProperties: KeplersLawsVisibleProperties, tandem: Tandem ) {

    const visibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'visibleProperty' )
    } );

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      isDisposable: false,
      visibleProperty: DerivedProperty.and( [ model.isSecondLawProperty, visibleProperty ] ),
      tandem: tandem
    } );

    const periodVisionsText = new Text( KeplersLawsStrings.periodDivisionStringProperty,
      combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        maxWidth: 200
      } ) );

    const periodDivisionsSpinner = new NumberSpinner( model.periodDivisionsProperty, model.periodDivisionsProperty.rangeProperty, {
      arrowsPosition: 'leftRight',
      layoutOptions: {
        align: 'center'
      },
      touchAreaXDilation: 15,
      touchAreaYDilation: 5,
      arrowsSoundPlayer: nullSoundPlayer,
      accessibleName: KeplersLawsStrings.periodDivisionStringProperty,
      tandem: tandem.createTandem( 'periodDivisionsSpinner' )
    } );

    const areaValuesCheckbox = KeplersLawsCheckbox.createAreaValuesCheckbox( visibleProperties.areaValuesVisibleProperty,
      tandem.createTandem( 'areaValuesCheckbox' ) );

    const timeValuesCheckbox = KeplersLawsCheckbox.createTimeValuesCheckbox( visibleProperties.timeValuesVisibleProperty,
      tandem.createTandem( 'timeValuesCheckbox' ) );

    const content = new VBox( {
      spacing: SolarSystemCommonConstants.VBOX_SPACING,
      align: 'left',
      children: [
        periodVisionsText,
        periodDivisionsSpinner,
        areaValuesCheckbox,
        timeValuesCheckbox
      ]
    } );

    super( content, options );

    const periodDivisionSounds = new PeriodDivisionSoundManager();
    model.periodDivisionsProperty.lazyLink( periodDivision => {
      if ( !model.resetting ) {
        periodDivisionSounds.playPeriodDivisionSound( periodDivision );
      }
    } );
  }
}

keplersLaws.register( 'PeriodDivisionsPanel', PeriodDivisionsPanel );