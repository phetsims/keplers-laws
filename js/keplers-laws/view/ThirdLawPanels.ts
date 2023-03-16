// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's third law accordion box
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { GridBox, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ThirdLawGraph from './ThirdLawGraph.js';
import ThirdLawSliderPanel from './ThirdLawSliderPanel.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import SolarSystemCommonTextNumberDisplay from '../../../../solar-system-common/js/view/SolarSystemCommonTextNumberDisplay.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import keplersLaws from '../../keplersLaws.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';

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

    const semiMajorAxisPatternStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: SolarSystemCommonTextNumberDisplay.createPowerStringProperty( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, model.selectedAxisPowerProperty ),
      units: SolarSystemCommonTextNumberDisplay.createPowerStringProperty( SolarSystemCommonStrings.units.AUStringProperty, model.selectedAxisPowerProperty ),
      value: new DerivedProperty(
        [ model.poweredSemiMajorAxisProperty, model.engine.allowedOrbitProperty ],
        ( poweredSemiMajorAxis, allowedOrbit ) => {
          return allowedOrbit ? Utils.toFixed( poweredSemiMajorAxis, 2 ) : KeplersLawsStrings.undefinedStringProperty;
        }
      )
    } );

    const periodPatternStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: SolarSystemCommonTextNumberDisplay.createPowerStringProperty( KeplersLawsStrings.symbols.periodStringProperty, model.selectedPeriodPowerProperty ),
      units: SolarSystemCommonTextNumberDisplay.createPowerStringProperty( SolarSystemCommonStrings.units.yearsStringProperty, model.selectedPeriodPowerProperty ),
      value: new DerivedProperty(
        [ model.poweredPeriodProperty, model.engine.allowedOrbitProperty ],
        ( poweredPeriod, allowedOrbit ) => {
          return allowedOrbit ? Utils.toFixed( poweredPeriod, 2 ) : KeplersLawsStrings.undefinedStringProperty;
        }
      )
    } );

    const semiMajorAxisNumberDisplay = new RichText( semiMajorAxisPatternStringProperty, SolarSystemCommonConstants.TEXT_OPTIONS );
    const periodNumberDisplay = new RichText( periodPatternStringProperty, SolarSystemCommonConstants.TEXT_OPTIONS );

    // TODO: Add string a=infinite. Look at FirstLawPanels.ts to be consistent. Should we change that way?

    super( new VBox( {
      spacing: 10,
      align: 'left',
      children: [
        new Text( KeplersLawsStrings.graph.titleStringProperty, SolarSystemCommonConstants.TITLE_OPTIONS ),
        new GridBox( {
          children: [
            // Period power buttons
            new RectangularRadioButtonGroup(
              model.selectedPeriodPowerProperty,
              [
                {
                  value: 1,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.periodStringProperty, SolarSystemCommonConstants.TEXT_OPTIONS )
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
                  createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, SolarSystemCommonConstants.TEXT_OPTIONS )
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
        semiMajorAxisNumberDisplay,
        periodNumberDisplay
      ]
    } ), options );
  }
}

keplersLaws.register( 'ThirdLawPanels', ThirdLawPanels );