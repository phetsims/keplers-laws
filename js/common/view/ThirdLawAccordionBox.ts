// Copyright 2023, University of Colorado Boulder

/**
 * ThirdLawAccordionBox contains the equation display and controls for the ThirdLawGraph class.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AccordionBox from '../../../../sun/js/AccordionBox.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { GridBox, HBox, RichText, RichTextOptions, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
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

const RADIO_BUTTON_TEXT_OPTIONS = {
  font: new PhetFont( { size: 18, weight: 'bold' } ),
  fill: 'black',
  lineWidth: 0.1,
  maxWidth: 25
};

const UNITS_TEXT_OPTIONS = {
  font: new PhetFont( 12 ),
  fill: SolarSystemCommonColors.foregroundProperty,
  maxWidth: 35
};

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
      titleNode: new RichText( titleStringProperty, combineOptions<TextOptions>( {}, KeplersLawsConstants.TITLE_OPTIONS, {
        maxWidth: 200
      } ) ),
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

    // Equation at the top of the accordion box: T/a = ...
    const equationNode = new EquationNode( model );

    // Graph of a vs T
    const graphNode = new ThirdLawGraph( model, model.engine, {
      layoutOptions: { column: 1, row: 0 },
      excludeInvisibleChildrenFromBounds: true
    } );

    // Radio buttons to the left of the graph
    const periodPowerRadioButtonGroup = new RectangularRadioButtonGroup(
      model.selectedPeriodPowerProperty,
      [
        {
          value: 1,
          labelContent: KeplersLawsStrings.symbols.periodStringProperty,
          createNode: () => new RichText( KeplersLawsStrings.symbols.periodStringProperty, RADIO_BUTTON_TEXT_OPTIONS )
        },
        {
          value: 2,
          labelContent: KeplersLawsStrings.symbols.periodSquaredStringProperty,
          createNode: () => new RichText( KeplersLawsStrings.symbols.periodSquaredStringProperty, RADIO_BUTTON_TEXT_OPTIONS )
        },
        {
          value: 3,
          labelContent: KeplersLawsStrings.symbols.periodCubedStringProperty,
          createNode: () => new RichText( KeplersLawsStrings.symbols.periodCubedStringProperty, RADIO_BUTTON_TEXT_OPTIONS )
        }
      ],
      {
        layoutOptions: { column: 0, row: 0 }
      }
    );

    // Radio buttons below the graph
    const semiMajorAxisPowerRadioButtonGroup = new RectangularRadioButtonGroup(
      model.selectedAxisPowerProperty,
      [
        {
          value: 1,
          labelContent: KeplersLawsStrings.symbols.semiMajorAxisStringProperty,
          createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisStringProperty, RADIO_BUTTON_TEXT_OPTIONS )
        },
        {
          value: 2,
          labelContent: KeplersLawsStrings.symbols.semiMajorAxisSquaredStringProperty,
          createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisSquaredStringProperty, RADIO_BUTTON_TEXT_OPTIONS )
        },
        {
          value: 3,
          labelContent: KeplersLawsStrings.symbols.semiMajorAxisCubedStringProperty,
          createNode: () => new RichText( KeplersLawsStrings.symbols.semiMajorAxisCubedStringProperty, RADIO_BUTTON_TEXT_OPTIONS )
        }
      ],
      {
        layoutOptions: { column: 1, row: 1 },
        orientation: 'horizontal'
      }
    );

    const eraserButton = new EraserButton( {
      listener: () => model.engine.resetEmitter.emit(),
      layoutOptions: { column: 0, row: 1 },
      accessibleName: KeplersLawsStrings.eraserStringProperty,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10
    } );

    // Accordion box content
    const content = new VBox( {
      spacing: 20,
      align: 'left',
      children: [
        equationNode,
        new GridBox( {
          children: [
            periodPowerRadioButtonGroup,
            semiMajorAxisPowerRadioButtonGroup,
            graphNode,
            eraserButton
          ],
          spacing: 10
        } )
      ]
    } );

    super( content, options );
  }
}

/**
 * The equation that appears at the top of the accordion box, T/a = ...
 */
class EquationNode extends HBox {
  public constructor( model: KeplersLawsModel ) {

    // T / a
    const fractionLeftTextOptions = combineOptions<RichTextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
      maxWidth: 25
    } );
    const fractionLeft = new FractionNode(
      new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.symbols.periodStringProperty,
        model.selectedPeriodPowerProperty, new TinyProperty<boolean>( true ) ), fractionLeftTextOptions ),
      new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.symbols.semiMajorAxisStringProperty,
        model.selectedAxisPowerProperty, new TinyProperty<boolean>( true ) ), fractionLeftTextOptions )
    );

    const fractionRight = new FractionNode(
      new RichText( new DerivedProperty(
        [ model.poweredPeriodProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ],
        ( poweredPeriod, allowedOrbit, undefinedMessage ) => {
          return allowedOrbit ? Utils.toFixed( poweredPeriod, 2 ) : undefinedMessage;
        }
      ), KeplersLawsConstants.TEXT_OPTIONS ),
      new RichText( new DerivedProperty(
        [ model.poweredSemiMajorAxisProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ],
        ( poweredSemiMajorAxis, allowedOrbit, undefinedMessage ) => {
          return allowedOrbit ? Utils.toFixed( poweredSemiMajorAxis, 2 ) : undefinedMessage;
        }
      ), KeplersLawsConstants.TEXT_OPTIONS )
    );

    // years / AU
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
        font: new PhetFont( { weight: 'bold', size: 25 } ),
        fill: SolarSystemCommonColors.foregroundProperty,
        lineWidth: 0.1
      } );
    model.correctPowersSelectedProperty.link( correct => {
      fractionResult.fill = correct ? '#5c0' : SolarSystemCommonColors.foregroundProperty;
    } );

    super( {
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
  }
}

keplersLaws.register( 'ThirdLawAccordionBox', ThirdLawAccordionBox );