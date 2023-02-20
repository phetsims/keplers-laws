// Copyright 2022-2023, University of Colorado Boulder

/**
 * Kepler's third law accordion box
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../../../my-solar-system/js/mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { GridBox, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import MySolarSystemStrings from '../../../../my-solar-system/js/MySolarSystemStrings.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ThirdLawGraph from './ThirdLawGraph.js';
import ThirdLawSliderPanel from './ThirdLawSliderPanel.js';
import SolarSystemCommonTextNumberDisplay from '../../../../solar-system-common/js/view/SolarSystemCommonTextNumberDisplay.js';

export type PanelThirdLawOptions = PanelOptions;

export default class ThirdLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new ThirdLawMainPanel( model ),
        new ThirdLawSliderPanel( model )
      ],
      visibleProperty: model.isThirdLawProperty
    } );
  }
}

class ThirdLawMainPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const options = combineOptions<PanelThirdLawOptions>( {
      visibleProperty: model.isThirdLawProperty,
      fill: SolarSystemCommonColors.backgroundProperty,
      stroke: SolarSystemCommonColors.gridIconStrokeColorProperty
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );

    const semiMajorAxisValueRange = new RangeWithValue( 1, 10000, model.engine.a );
    const periodValueRange = new RangeWithValue( 1, 10000, model.engine.T );

    const semiMajorAxisPatternStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: SolarSystemCommonTextNumberDisplay.combinePowerString( MySolarSystemStrings.symbols.semiMajorAxisStringProperty, model.selectedAxisPowerProperty ),
      units: SolarSystemCommonTextNumberDisplay.combinePowerString( MySolarSystemStrings.units.AUStringProperty, model.selectedAxisPowerProperty )
    } );

    const periodPatternStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: SolarSystemCommonTextNumberDisplay.combinePowerString( MySolarSystemStrings.symbols.periodStringProperty, model.selectedPeriodPowerProperty ),
      units: SolarSystemCommonTextNumberDisplay.combinePowerString( MySolarSystemStrings.units.yearsStringProperty, model.selectedPeriodPowerProperty )
    } );

    // TODO: Add string a=infinite. Look at FirstLawPanels.ts to be consistent. Should we change that way?

    super( new VBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.graph.titleStringProperty, SolarSystemCommonConstants.TITLE_OPTIONS ),
        new GridBox( {
          children: [
            // Period power buttons
            new RectangularRadioButtonGroup(
              model.selectedPeriodPowerProperty,
              [
                {
                  value: 1,
                  createNode: () => new RichText( MySolarSystemStrings.symbols.periodStringProperty, SolarSystemCommonConstants.TEXT_OPTIONS )
                },
                {
                  value: 2,
                  //REVIEW: And this should probably include string composition (e.g. combining the translated string for
                  //REVIEW: T with the superscript somehow?)
                  createNode: () => new RichText( 'T<sup>2</sup>', SolarSystemCommonConstants.TEXT_OPTIONS )
                },
                {
                  value: 3,
                  createNode: () => new RichText( 'T<sup>3</sup>', SolarSystemCommonConstants.TEXT_OPTIONS )
                }
              ],
              {
                layoutOptions: { column: 0, row: 0 }
              }
            ),
            // Semi-major axis power buttons
            new RectangularRadioButtonGroup(
              model.selectedAxisPowerProperty,
              [
                {
                  value: 1,
                  createNode: () => new RichText( MySolarSystemStrings.symbols.semiMajorAxisStringProperty, SolarSystemCommonConstants.TEXT_OPTIONS )
                },
                {
                  value: 2,
                  createNode: () => new RichText( 'a<sup>2</sup>', SolarSystemCommonConstants.TEXT_OPTIONS )
                },
                {
                  value: 3,
                  createNode: () => new RichText( 'a<sup>3</sup>', SolarSystemCommonConstants.TEXT_OPTIONS )
                }
              ],
              {
                layoutOptions: { column: 1, row: 1 },
                orientation: 'horizontal'
              }
            ),
            new ThirdLawGraph( model, model.engine, {
              layoutOptions: { column: 1, row: 0 },
              excludeInvisibleChildrenFromBounds: true
            } )
          ],
          spacing: 10
        } ),
        new SolarSystemCommonTextNumberDisplay(
          model.poweredSemiMajorAxisProperty,
          semiMajorAxisValueRange,
          {
            valuePattern: semiMajorAxisPatternStringProperty,
            align: 'left',
            visibleProperty: model.engine.allowedOrbitProperty
          }
        ),
        new SolarSystemCommonTextNumberDisplay(
          model.poweredPeriodProperty,
          periodValueRange,
          {
            valuePattern: periodPatternStringProperty,
            align: 'left',
            visibleProperty: model.engine.allowedOrbitProperty
          } )
      ]
    } ), options );
  }
}

mySolarSystem.register( 'ThirdLawPanels', ThirdLawPanels );