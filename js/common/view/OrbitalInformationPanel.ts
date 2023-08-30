// Copyright 2023, University of Colorado Boulder

/**
 * OrbitalInformationPanel is the panel that contains controls related to the display of orbital information.
 *
 * @author Agustín Vallejo
 */

import { HBox, Image, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import keplersLaws from '../../keplersLaws.js';
import FirstLawCheckboxIcons from '../../first-law/FirstLawCheckboxIcons.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import periodTimerIcon_png from '../../../images/periodTimerIcon_png.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

export default class OrbitalInformationPanel extends Panel {

  public constructor( model: KeplersLawsModel, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS, {
      tandem: tandem
    } );

    // Checkboxes for First Law
    const firstLawCheckboxesTandem = tandem.createTandem( 'firstLawCheckboxes' );
    const firstLawCheckboxes: Checkbox[] = [
      createCheckbox(
        model.fociVisibleProperty,
        KeplersLawsStrings.fociStringProperty,
        firstLawCheckboxesTandem.createTandem( 'fociVisibleCheckbox' ),
        FirstLawCheckboxIcons.createFociCheckboxIcon()
      ),
      createCheckbox(
        model.stringsVisibleProperty,
        KeplersLawsStrings.stringsStringProperty,
        firstLawCheckboxesTandem.createTandem( 'stringsVisibleCheckbox' ),
        FirstLawCheckboxIcons.createStringsCheckboxIcon(),
        {
          enabledProperty: model.fociVisibleProperty,
          layoutOptions: { leftMargin: 20 } // to indent this checkbox
        }
      ),
      createCheckbox(
        model.axisVisibleProperty,
        KeplersLawsStrings.axisStringProperty,
        firstLawCheckboxesTandem.createTandem( 'axisVisibleCheckbox' ),
        FirstLawCheckboxIcons.createAxisCheckboxIcon()
      ),
      createCheckbox(
        model.semiaxisVisibleProperty,
        KeplersLawsStrings.semiaxisStringProperty,
        firstLawCheckboxesTandem.createTandem( 'semiAxisVisibleCheckbox' ),
        FirstLawCheckboxIcons.createSemiaxesCheckboxIcon(),
        {
          enabledProperty: model.axisVisibleProperty,
          layoutOptions: { leftMargin: 20 } // to indent this checkbox
        }
      ),
      createCheckbox(
        model.eccentricityVisibleProperty,
        KeplersLawsStrings.eccentricityStringProperty,
        firstLawCheckboxesTandem.createTandem( 'eccentricityVisibleCheckbox' ),
        FirstLawCheckboxIcons.createEccentricityCheckboxIcon()
      )
    ];

    // Checkboxes for Second Law
    const secondLawCheckboxesTandem = tandem.createTandem( 'secondLawCheckboxes' );
    const secondLawCheckboxes: Checkbox[] = [
      createCheckbox(
        model.apoapsisVisibleProperty,
        KeplersLawsStrings.apoapsisStringProperty,
        secondLawCheckboxesTandem.createTandem( 'apoapsisVisibleCheckbox' ),
        new XNode( {
          fill: KeplersLawsColors.apoapsisColorProperty,
          stroke: KeplersLawsColors.foregroundProperty,
          scale: 0.5
        } ),
        {
          enabledProperty: new DerivedProperty( [ model.engine.eccentricityProperty ],
            e => e > 0 )
        }
      ),
      createCheckbox(
        model.periapsisVisibleProperty,
        KeplersLawsStrings.periapsisStringProperty,
        secondLawCheckboxesTandem.createTandem( 'periapsisVisibleCheckbox' ),
        new XNode( {
          fill: KeplersLawsColors.periapsisColorProperty,
          stroke: KeplersLawsColors.foregroundProperty,
          scale: 0.5
        } ),
        {
          enabledProperty: new DerivedProperty( [ model.engine.eccentricityProperty ],
            e => e > 0 )
        }
      )
    ];

    // Checkboxes for Third Law
    const thirdLawCheckboxesTandem = tandem.createTandem( 'thirdLawCheckboxes' );
    const thirdLawCheckboxes: Checkbox[] = [
      createCheckbox(
        model.semiMajorAxisVisibleProperty,
        KeplersLawsStrings.graph.aStringProperty,
        thirdLawCheckboxesTandem.createTandem( 'semiMajorAxisVisibleCheckbox' ),
        FirstLawCheckboxIcons.createSemiMajorAxisCheckboxIcon()
      ),
      createCheckbox(
        model.periodVisibleProperty,
        KeplersLawsStrings.graph.tStringProperty,
        thirdLawCheckboxesTandem.createTandem( 'periodVisibleCheckbox' ),
        new Image( periodTimerIcon_png, {
          scale: 0.6
        } )
      )
    ];

    const content = new VBox( {
      spacing: 5,
      align: 'left',
      stretch: true
      // children: set by model.lawUpdatedEmitter listener below
    } );

    super( content, options );

    model.lawUpdatedEmitter.addListener( () => {
      content.children = [
        ...( model.isFirstLawProperty.value ? firstLawCheckboxes :
             model.isSecondLawProperty.value ? secondLawCheckboxes :
             model.isThirdLawProperty.value ? thirdLawCheckboxes : [] )
      ];
    } );

    model.lawUpdatedEmitter.emit();
  }
}

/**
 * Creates a checkbox.
 */
function createCheckbox( property: Property<boolean>, text: TReadOnlyProperty<string>,
                         tandem: Tandem, icon: Node = new Node(),
                         providedOptions?: StrictOmit<CheckboxOptions, 'tandem' | 'accessibleName'>
): Checkbox {

  const options = combineOptions<CheckboxOptions>( {
    tandem: tandem,
    accessibleName: text
  }, SolarSystemCommonConstants.CHECKBOX_OPTIONS, providedOptions );

  const content = new HBox( {
    spacing: 10,
    children: [
      new Text( text, KeplersLawsConstants.TEXT_OPTIONS ),
      icon
    ]
  } );

  return new SolarSystemCommonCheckbox( property, content, options );
}

keplersLaws.register( 'OrbitalInformationPanel', OrbitalInformationPanel );