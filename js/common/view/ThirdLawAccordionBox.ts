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
import { GridBox, HBox, Line, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
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

    const fractionLeft = new VBox( {
      spacing: 5,
      children: [
        new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.symbols.periodStringProperty, model.selectedPeriodPowerProperty, new TinyProperty<boolean>( true ) ), KeplersLawsConstants.TEXT_OPTIONS ),
        new Line( 0, 0, 30, 0, { stroke: SolarSystemCommonColors.foregroundProperty, lineWidth: 1.5, lineCap: 'round' } ),
        new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, model.selectedAxisPowerProperty, new TinyProperty<boolean>( true ) ), KeplersLawsConstants.TEXT_OPTIONS )
      ]
    } );

    const fractionRight = new VBox( {
      spacing: 5,
      children: [
        new RichText( new DerivedProperty(
          [ model.poweredPeriodProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ],
          ( poweredPeriod, allowedOrbit, undefinedMessage ) => {
            return allowedOrbit ? Utils.toFixed( poweredPeriod, 2 ) : undefinedMessage;
          }
        ), KeplersLawsConstants.TEXT_OPTIONS ),
        new Line( 0, 0, 70, 0, { stroke: SolarSystemCommonColors.foregroundProperty, lineWidth: 1.5, lineCap: 'round' } ),
        new RichText( new DerivedProperty(
          [ model.poweredSemiMajorAxisProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ],
          ( poweredSemiMajorAxis, allowedOrbit, undefinedMessage ) => {
            return allowedOrbit ? Utils.toFixed( poweredSemiMajorAxis, 2 ) : undefinedMessage;
          }
        ), KeplersLawsConstants.TEXT_OPTIONS )
      ]
    } );

    const unitsOptions = { font: new PhetFont( { size: 12 } ), fill: SolarSystemCommonColors.foregroundProperty };
    const createUnitsFraction = () => {
      return new VBox( {
        spacing: 2,
        visibleProperty: model.engine.allowedOrbitProperty,
        children: [
          new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.units.yearsStringProperty, model.selectedPeriodPowerProperty, new TinyProperty<boolean>( true ) ), unitsOptions ),
          new Line( 0, 0, 30, 0, { stroke: SolarSystemCommonColors.foregroundProperty, lineWidth: 1, lineCap: 'round' } ),
          new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.units.AUStringProperty, model.selectedAxisPowerProperty, new TinyProperty<boolean>( true ) ), unitsOptions )
        ]
      } );
    };

    const fractionResult = new RichText(
      new DerivedProperty( [ model.poweredSemiMajorAxisProperty, model.poweredPeriodProperty, model.engine.allowedOrbitProperty ],
        ( poweredSemiMajorAxis, poweredPeriod, allowedOrbit ) => {
          return allowedOrbit ? Utils.toFixed( poweredPeriod / poweredSemiMajorAxis, 2 ) : '';
        }
      ), {
        font: new PhetFont( { weight: 'bold', size: 25 } ),
        fill: SolarSystemCommonColors.foregroundProperty,
        lineWidth: 0.1
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

    const BUTTON_OPTIONS = {
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
                  createNode: () => new RichText( KeplersLawsStrings.symbols.periodStringProperty, BUTTON_OPTIONS )
                },
                {
                  value: 2,
                  labelContent: KeplersLawsStrings.symbols.periodSquaredStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.periodSquaredStringProperty, BUTTON_OPTIONS )
                },
                {
                  value: 3,
                  labelContent: KeplersLawsStrings.symbols.periodCubedStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.periodCubedStringProperty, BUTTON_OPTIONS )
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
                  createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, BUTTON_OPTIONS )
                },
                {
                  value: 2,
                  labelContent: KeplersLawsStrings.symbols.semiMajorAxisSquaredStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisSquaredStringProperty, BUTTON_OPTIONS )
                },
                {
                  value: 3,
                  labelContent: KeplersLawsStrings.symbols.semiMajorAxisCubedStringProperty,
                  createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisCubedStringProperty, BUTTON_OPTIONS )
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