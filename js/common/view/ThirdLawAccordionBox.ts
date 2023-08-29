// Copyright 2023, University of Colorado Boulder

/**
 * ThirdLawAccordionBox contains the equation display and controls for the ThirdLawGraph class.
 *
 * @author Agustín Vallejo
 */

import AccordionBox from '../../../../sun/js/AccordionBox.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { GridBox, HBox, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ThirdLawTextUtils from './ThirdLawTextUtils.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import ThirdLawGraph from './ThirdLawGraph.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import keplersLaws from '../../keplersLaws.js';
import { ThirdLawAccordionBoxOptions } from './ThirdLawPanels.js';
import FractionNode from './FractionNode.js';

export default class ThirdLawAccordionBox extends AccordionBox {
  public constructor( model: KeplersLawsModel ) {
    const titleStringProperty = new DerivedProperty( [
      KeplersLawsStrings.graph.titleStringProperty,
      model.selectedAxisPowerProperty,
      model.selectedPeriodPowerProperty
    ], ( stringPattern, axisPower, periodPower ) => {
      const axisString = axisPower === 1 ? '' : `<sup>${axisPower}</sup>`;
      const periodString = periodPower === 1 ? '' : `<sup>${periodPower}</sup>`;

      return StringUtils.fillIn( stringPattern, {
        axisPower: axisString,
        periodPower: periodString
      } );
    } );
    const options = combineOptions<ThirdLawAccordionBoxOptions>( {
      titleNode: new RichText( titleStringProperty, KeplersLawsConstants.TITLE_OPTIONS ),
      accessibleName: titleStringProperty,
      titleYMargin: 10,
      buttonXMargin: 10,
      expandCollapseButtonOptions: {
        scale: 1.5
      },
      visibleProperty: model.isThirdLawProperty,
      fill: SolarSystemCommonColors.backgroundProperty,
      stroke: SolarSystemCommonColors.gridIconStrokeColorProperty,
      minWidth: KeplersLawsConstants.PANELS_MIN_WIDTH,

      isDisposable: false,
      useExpandedBoundsWhenCollapsed: false
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );

    const FRACTION_TEXT_OPTIONS = combineOptions<TextOptions>(
      {}, KeplersLawsConstants.TEXT_OPTIONS, { maxWidth: 70 }
    );

    const fractionLeft = new FractionNode(
        new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.symbols.periodStringProperty, model.selectedPeriodPowerProperty, new TinyProperty<boolean>( true ) ), FRACTION_TEXT_OPTIONS ),
        new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, model.selectedAxisPowerProperty, new TinyProperty<boolean>( true ) ), FRACTION_TEXT_OPTIONS )
    );

    const fractionRight = new FractionNode(
        new RichText( new DerivedProperty(
          [ model.poweredPeriodProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ],
          ( poweredPeriod, allowedOrbit, undefinedMessage ) => {
            return allowedOrbit ? Utils.toFixed( poweredPeriod, 2 ) : undefinedMessage;
          }
        ), FRACTION_TEXT_OPTIONS ),
        new RichText( new DerivedProperty(
          [ model.poweredSemiMajorAxisProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ],
          ( poweredSemiMajorAxis, allowedOrbit, undefinedMessage ) => {
            return allowedOrbit ? Utils.toFixed( poweredSemiMajorAxis, 2 ) : undefinedMessage;
          }
        ), FRACTION_TEXT_OPTIONS )
    );

    const UNITS_TEXT_OPTIONS = { font: new PhetFont( { size: 12 } ), fill: SolarSystemCommonColors.foregroundProperty, maxWidth: 40 };
    const createUnitsFraction = () => {
      return new FractionNode(
          new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.units.yearsStringProperty, model.selectedPeriodPowerProperty, new TinyProperty<boolean>( true ) ), UNITS_TEXT_OPTIONS ),
          new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.units.AUStringProperty, model.selectedAxisPowerProperty, new TinyProperty<boolean>( true ) ), UNITS_TEXT_OPTIONS ),
        {
          visibleProperty: model.engine.allowedOrbitProperty
        }
      );
    };

    const fractionResult = new RichText(
      new DerivedProperty( [ model.poweredSemiMajorAxisProperty, model.poweredPeriodProperty, model.engine.allowedOrbitProperty ],
        ( poweredSemiMajorAxis, poweredPeriod, allowedOrbit ) => {
          return allowedOrbit ? Utils.toFixed( poweredPeriod / poweredSemiMajorAxis, 2 ) : '';
        }
      ), {
        // Using in line options here because the font size is different from the rest of the text
        font: new PhetFont( { weight: 'bold', size: 25 } ),
        fill: SolarSystemCommonColors.foregroundProperty,
        lineWidth: 0.1,
        maxWidth: 50
      } );
    model.correctPowersSelectedProperty.link( correct => {
      fractionResult.fill = correct ? '#5c0' : SolarSystemCommonColors.foregroundProperty;
    } );

    const periodOverSemiMajorAxisDisplay = new HBox( {
      spacing: 5,
      layoutOptions: {
        align: 'left'
      },
      children: [
        fractionLeft,
        new Text( '=', KeplersLawsConstants.TEXT_OPTIONS ),
        fractionRight,
        createUnitsFraction(),
        new Text( '=', combineOptions<TextOptions>( { visibleProperty: model.engine.allowedOrbitProperty }, KeplersLawsConstants.TEXT_OPTIONS ) ),
        fractionResult,
        createUnitsFraction()
      ]
    } );

    const BUTTON_TEXT_OPTIONS = {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      fill: 'black',
      lineWidth: 0.1,
      maxWidth: 20
    };

    super( new VBox( {
      spacing: 20,
      align: 'left',
      children: [
        periodOverSemiMajorAxisDisplay,
        new GridBox( {
          children: [
            // Period power buttons
            new RectangularRadioButtonGroup(
              model.selectedPeriodPowerProperty,
              [
                {
                  value: 1,
                  labelContent: KeplersLawsStrings.symbols.periodStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.periodStringProperty, BUTTON_TEXT_OPTIONS )
                },
                {
                  value: 2,
                  labelContent: KeplersLawsStrings.symbols.periodSquaredStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.periodSquaredStringProperty, BUTTON_TEXT_OPTIONS )
                },
                {
                  value: 3,
                  labelContent: KeplersLawsStrings.symbols.periodCubedStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.periodCubedStringProperty, BUTTON_TEXT_OPTIONS )
                }
              ],
              {
                layoutOptions: { column: 0, row: 0 }
              }
            ),
            // Semimajor axis power buttons
            new RectangularRadioButtonGroup(
              model.selectedAxisPowerProperty,
              [
                {
                  value: 1,
                  labelContent: KeplersLawsStrings.symbols.semiMajorAxisStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, BUTTON_TEXT_OPTIONS )
                },
                {
                  value: 2,
                  labelContent: KeplersLawsStrings.symbols.semiMajorAxisSquaredStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisSquaredStringProperty, BUTTON_TEXT_OPTIONS )
                },
                {
                  value: 3,
                  labelContent: KeplersLawsStrings.symbols.semiMajorAxisCubedStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisCubedStringProperty, BUTTON_TEXT_OPTIONS )
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
            } ),
            new EraserButton( {
              listener: () => model.engine.resetEmitter.emit(),
              layoutOptions: { column: 0, row: 1 },
              accessibleName: KeplersLawsStrings.eraserStringProperty,
              touchAreaXDilation: 10,
              touchAreaYDilation: 10
            } )
          ],
          spacing: 10
        } )
      ]
    } ), options );
  }
}

keplersLaws.register( 'ThirdLawAccordionBox', ThirdLawAccordionBox );