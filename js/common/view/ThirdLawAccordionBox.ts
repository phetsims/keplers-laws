// Copyright 2023-2024, University of Colorado Boulder

/**
 * ThirdLawAccordionBox contains the equation display and controls for the ThirdLawGraph class.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsDerivedStrings from '../KeplersLawsDerivedStrings.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import FractionNode from './FractionNode.js';
import ThirdLawGraph from './ThirdLawGraph.js';
import ThirdLawTextUtils from './ThirdLawTextUtils.js';

const RADIO_BUTTON_TEXT_OPTIONS = {
  font: new PhetFont( { size: 18, weight: 'bold' } ),
  fill: 'black',
  lineWidth: 0.1,
  maxWidth: 25
};

const UNITS_TEXT_OPTIONS = {
  font: new PhetFont( 12 ),
  fill: SolarSystemCommonColors.foregroundProperty
};

const EQUATION_TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  fill: SolarSystemCommonColors.foregroundProperty
};

type SelfOptions = EmptySelfOptions;
type ThirdLawAccordionBoxOptions = AccordionBoxOptions & SelfOptions;

export default class ThirdLawAccordionBox extends AccordionBox {

  public constructor( model: KeplersLawsModel, thirdLawAccordionBoxExpandedProperty: BooleanProperty, tandem: Tandem ) {

    const visibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'visibleProperty' ),
      phetioFeatured: true
    } );

    const titleStringProperty = new DerivedProperty( [
        KeplersLawsStrings.graph.titleStringProperty,
        KeplersLawsStrings.symbol.aStringProperty,
        KeplersLawsStrings.symbol.TStringProperty,
        model.selectedAxisPowerProperty,
        model.selectedPeriodPowerProperty
      ], ( stringPattern, aString, TString, axisPower, periodPower ) =>
        StringUtils.fillIn( stringPattern, {
          period: ( periodPower === 1 ) ? TString : `${TString}<sup>${periodPower}</sup>`,
          axis: ( axisPower === 1 ) ? aString : `${aString}<sup>${axisPower}</sup>`
        } )
    );

    const titleNode = new AlignBox( new RichText( titleStringProperty, combineOptions<TextOptions>( {}, KeplersLawsConstants.TITLE_OPTIONS, {
      maxWidth: 200
    } ) ), {
      // Keeps the size effectively constant, so that the accordion box does not resize as the equation change.
      // Value determined empirically. See https://github.com/phetsims/keplers-laws/issues/151
      preferredSize: new Dimension2( 180, 25 ),
      yAlign: 'bottom'
    } );

    const options = combineOptions<ThirdLawAccordionBoxOptions>( {}, KeplersLawsConstants.ACCORDION_BOX_OPTIONS, {
      titleNode: titleNode,
      accessibleName: titleStringProperty,
      visibleProperty: DerivedProperty.and( [ model.isThirdLawProperty, visibleProperty ] ),
      isDisposable: false,
      useExpandedBoundsWhenCollapsed: false,
      expandedProperty: thirdLawAccordionBoxExpandedProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );

    // Equation at the top of the accordion box: T/a = ...
    const equationNode = new AlignBox( new EquationNode( model ), {
      // Keeps the size effectively constant, so that the accordion box does not resize as the equation change.
      // Value determined empirically. See https://github.com/phetsims/keplers-laws/issues/151
      preferredSize: new Dimension2( 260, 52 ),
      xAlign: 'left',
      tandem: tandem.createTandem( 'equationNode' )
    } );
    equationNode.addLinkedElement( model.thirdLawEquationResultProperty, {
      tandemName: 'thirdLawEquationResultProperty'
    } );

    // Graph of a vs T
    const graphNode = new ThirdLawGraph( model, model.engine, {
      layoutOptions: { column: 1, row: 0 },
      excludeInvisibleChildrenFromBounds: true,
      tandem: tandem.createTandem( 'graphNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    // Radio buttons to the left of the graph
    const periodPowerRadioButtonGroup = new RectangularRadioButtonGroup(
      model.selectedPeriodPowerProperty,
      [
        {
          value: 1,
          createNode: () => new RichText( KeplersLawsStrings.symbol.TStringProperty, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'TRadioButton',
          options: {
            accessibleName: KeplersLawsStrings.symbol.TStringProperty
          }
        },
        {
          value: 2,
          createNode: () => new RichText( KeplersLawsDerivedStrings.T2StringProperty, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'T2RadioButton',
          options: {
            accessibleName: KeplersLawsDerivedStrings.T2StringProperty
          }
        },
        {
          value: 3,
          createNode: () => new RichText( KeplersLawsDerivedStrings.T3StringProperty, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'T3RadioButton',
          options: {
            accessibleName: KeplersLawsDerivedStrings.T3StringProperty
          }
        }
      ],
      {
        layoutOptions: { column: 0, row: 0 },
        tandem: tandem.createTandem( 'periodPowerRadioButtonGroup' )
      }
    );

    // Radio buttons below the graph
    const semiMajorAxisPowerRadioButtonGroup = new RectangularRadioButtonGroup(
      model.selectedAxisPowerProperty,
      [
        {
          value: 1,
          createNode: () => new RichText( KeplersLawsStrings.symbol.aStringProperty, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'aRadioButton',
          options: {
            accessibleName: KeplersLawsStrings.symbol.aStringProperty
          }
        },
        {
          value: 2,
          createNode: () => new RichText( KeplersLawsDerivedStrings.a2StringProperty, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'a2RadioButton',
          options: {
            accessibleName: KeplersLawsDerivedStrings.a2StringProperty
          }
        },
        {
          value: 3,
          createNode: () => new RichText( KeplersLawsDerivedStrings.a3StringProperty, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'a3RadioButton',
          options: {
            accessibleName: KeplersLawsDerivedStrings.a3StringProperty
          }
        }
      ],
      {
        layoutOptions: { column: 1, row: 1 },
        orientation: 'horizontal',
        tandem: tandem.createTandem( 'semiMajorAxisPowerRadioButtonGroup' )
      }
    );

    const eraserButton = new EraserButton( {
      listener: () => model.engine.resetEmitter.emit(),
      layoutOptions: { column: 0, row: 1 },
      accessibleName: KeplersLawsStrings.a11y.eraserStringProperty,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      tandem: tandem.createTandem( 'eraserButton' )
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
    const fractionLeft = new FractionNode(
      new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.symbol.TStringProperty,
        model.selectedPeriodPowerProperty, new TinyProperty<boolean>( true ) ), EQUATION_TEXT_OPTIONS ),
      new RichText( ThirdLawTextUtils.createPowerStringProperty( KeplersLawsStrings.symbol.aStringProperty,
        model.selectedAxisPowerProperty, new TinyProperty<boolean>( true ) ), EQUATION_TEXT_OPTIONS )
    );

    // The value in fraction format, e.g. 1.90 / 1.54
    const fractionRight = new FractionNode(
      new RichText( new DerivedProperty(
        [ model.poweredPeriodProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ],
        ( poweredPeriod, allowedOrbit, undefinedMessage ) => {
          return allowedOrbit ? Utils.toFixed( poweredPeriod, 2 ) : undefinedMessage;
        }
      ), EQUATION_TEXT_OPTIONS ),
      new RichText( new DerivedProperty(
        [ model.poweredSemiMajorAxisProperty, model.engine.allowedOrbitProperty, KeplersLawsStrings.undefinedStringProperty ],
        ( poweredSemiMajorAxis, allowedOrbit, undefinedMessage ) => {
          return allowedOrbit ? Utils.toFixed( poweredSemiMajorAxis, 2 ) : undefinedMessage;
        }
      ), EQUATION_TEXT_OPTIONS )
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

    // The value in decimal format, e.g. 1.24
    const resultTextNode = new RichText(
      new DerivedProperty( [ model.thirdLawEquationResultProperty, model.engine.allowedOrbitProperty ],
        ( thirdLawEquationResultProperty, allowedOrbit ) => {
          return allowedOrbit ? Utils.toFixed( thirdLawEquationResultProperty ? thirdLawEquationResultProperty : 0, 2 ) : '';
        }
      ), {
        font: new PhetFont( { weight: 'bold', size: 25 } ),
        fill: SolarSystemCommonColors.foregroundProperty,
        centerY: 0
      } );
    model.correctPowersSelectedProperty.link( correct => {
      resultTextNode.fill = correct ? '#5c0' : SolarSystemCommonColors.foregroundProperty;
    } );

    const createEquationTextNode = ( TextNode: Text | RichText ) => {
      return new Node( {
        children: [ TextNode ]
      } );
    };

    super( {
      spacing: 5,
      align: 'origin',
      maxWidth: 260,
      children: [
        fractionLeft,
        createEquationTextNode( new Text( '=', combineOptions<TextOptions>( {}, EQUATION_TEXT_OPTIONS,
          { centerY: 0 } ) ) ),
        fractionRight,
        createUnitsFraction(),
        createEquationTextNode( new Text( '=', combineOptions<TextOptions>( {}, EQUATION_TEXT_OPTIONS, {
          visibleProperty: model.engine.allowedOrbitProperty, centerY: 0
        } ) ) ),
        createEquationTextNode( resultTextNode ),
        createUnitsFraction()
      ]
    } );
  }
}

keplersLaws.register( 'ThirdLawAccordionBox', ThirdLawAccordionBox );