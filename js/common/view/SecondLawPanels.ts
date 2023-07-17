// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's second law panel control: Swept area
 *
 * This class is mostly empty and only has SecondLawGraph as a child to keep code consistency across the three laws.
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import SecondLawGraph from './SecondLawGraph.js';
import keplersLaws from '../../keplersLaws.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ArrowButton, { ArrowButtonOptions } from '../../../../sun/js/buttons/ArrowButton.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import KeplersLawsConstants from '../../KeplersLawsConstants.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';

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
      children: [
        new Text( KeplersLawsStrings.area.periodDivisionStringProperty, KeplersLawsConstants.TEXT_OPTIONS ),
        new DivisionsArrowButtonsBox( model ),
        new SolarSystemCommonCheckbox( model.areaValuesVisibleProperty, new Text( KeplersLawsStrings.area.valuesStringProperty, KeplersLawsConstants.TEXT_OPTIONS ), {
          accessibleName: KeplersLawsStrings.area.valuesStringProperty
        } ),
        new SolarSystemCommonCheckbox( model.timeValuesVisibleProperty, new Text( KeplersLawsStrings.area.timeValuesStringProperty, KeplersLawsConstants.TEXT_OPTIONS ), {
          accessibleName: KeplersLawsStrings.area.timeValuesStringProperty
        } )
      ]
    } ), options );
  }
}

class DivisionsArrowButtonsBox extends HBox {
  public constructor( model: KeplersLawsModel ) {

    const divisionsRange = new RangeWithValue(
      KeplersLawsConstants.MIN_ORBITAL_DIVISIONS,
      KeplersLawsConstants.MAX_ORBITAL_DIVISIONS,
      4 );

    const arrowButtonOptions: ArrowButtonOptions = {
      baseColor: 'white',
      stroke: 'black',
      lineWidth: 1
    };

    // increment button
    const incrementButton = new ArrowButton(
      'right',
      () => {
        const numberValue = model.periodDivisionProperty.value;
        model.periodDivisionProperty.value =
          numberValue < divisionsRange.max ?
          numberValue + 1 :
          numberValue;
      },
      combineOptions<ArrowButtonOptions>( {
        accessibleName: KeplersLawsStrings.a11y.increaseDivisionsStringProperty,
        enabledProperty: new DerivedProperty(
          [ model.periodDivisionProperty ],
          periodDivisions => {
            return periodDivisions < divisionsRange.max;
          }
        )
      }, arrowButtonOptions )
    );

    // decrement button
    const decrementButton = new ArrowButton(
      'left',
      () => {
        const numberValue = model.periodDivisionProperty.value;
        model.periodDivisionProperty.value =
          numberValue > divisionsRange.min ?
          numberValue - 1 :
          numberValue;
      },
      combineOptions<ArrowButtonOptions>( {
        accessibleName: KeplersLawsStrings.a11y.decreaseDivisionsStringProperty,
        enabledProperty: new DerivedProperty(
          [ model.periodDivisionProperty ],
          periodDivisions => {
            return periodDivisions > divisionsRange.min;
          }
        )
      }, arrowButtonOptions )
    );

    super( {
      spacing: 5,
      children: [
        decrementButton,
        new NumberDisplay( model.periodDivisionProperty, divisionsRange ),
        incrementButton
      ]
    } );
  }
}

keplersLaws.register( 'SecondLawPanels', SecondLawPanels );