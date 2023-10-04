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
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

const CHECKBOX_INDENT = 20; // some checkboxes are indented by this amount

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
        FirstLawCheckboxIcons.createFociCheckboxIcon(),
        {
          tandem: firstLawCheckboxesTandem.createTandem( 'fociVisibleCheckbox' )
        }
      ),
      createCheckbox(
        model.stringVisibleProperty,
        KeplersLawsStrings.stringStringProperty,
        FirstLawCheckboxIcons.createStringsCheckboxIcon(),
        {
          tandem: firstLawCheckboxesTandem.createTandem( 'stringVisibleCheckbox' ),
          enabledProperty: model.fociVisibleProperty,
          layoutOptions: { leftMargin: CHECKBOX_INDENT } // to indent this checkbox
        }
      ),
      createCheckbox(
        model.axesVisibleProperty,
        KeplersLawsStrings.axesStringProperty,
        FirstLawCheckboxIcons.createAxisCheckboxIcon(),
        {
          tandem: firstLawCheckboxesTandem.createTandem( 'axesVisibleCheckbox' )
        }
      ),
      createCheckbox(
        model.semiaxisVisibleProperty,
        KeplersLawsStrings.semiaxesStringProperty,
        FirstLawCheckboxIcons.createSemiaxesCheckboxIcon(),
        {
          tandem: firstLawCheckboxesTandem.createTandem( 'semiAxisVisibleCheckbox' ),
          enabledProperty: model.axesVisibleProperty,
          layoutOptions: { leftMargin: CHECKBOX_INDENT } // to indent this checkbox
        }
      ),
      createCheckbox(
        model.eccentricityVisibleProperty,
        KeplersLawsStrings.eccentricityStringProperty,
        FirstLawCheckboxIcons.createEccentricityCheckboxIcon(),
        {
          tandem: firstLawCheckboxesTandem.createTandem( 'eccentricityVisibleCheckbox' )
        }
      )
    ];

    // Checkboxes for Second Law
    const secondLawCheckboxesTandem = tandem.createTandem( 'secondLawCheckboxes' );
    const secondLawCheckboxes: Checkbox[] = [
      createCheckbox(
        model.apoapsisVisibleProperty,
        KeplersLawsStrings.apoapsisStringProperty,
        new XNode( {
          fill: KeplersLawsColors.apoapsisColorProperty,
          stroke: KeplersLawsColors.foregroundProperty,
          scale: 0.5
        } ),
        {
          tandem: secondLawCheckboxesTandem.createTandem( 'apoapsisVisibleCheckbox' ),
          enabledProperty: new DerivedProperty( [ model.engine.eccentricityProperty ], e => e > 0 )
        }
      ),
      createCheckbox(
        model.periapsisVisibleProperty,
        KeplersLawsStrings.periapsisStringProperty,
        new XNode( {
          fill: KeplersLawsColors.periapsisColorProperty,
          stroke: KeplersLawsColors.foregroundProperty,
          scale: 0.5
        } ),
        {
          tandem: secondLawCheckboxesTandem.createTandem( 'periapsisVisibleCheckbox' ),
          enabledProperty: new DerivedProperty( [ model.engine.eccentricityProperty ], e => e > 0 )
        }
      )
    ];

    // Checkboxes for Third Law
    const thirdLawCheckboxesTandem = tandem.createTandem( 'thirdLawCheckboxes' );
    const thirdLawCheckboxes: Checkbox[] = [
      createCheckbox(
        model.semiMajorAxisVisibleProperty,
        KeplersLawsStrings.graph.aStringProperty,
        FirstLawCheckboxIcons.createSemiMajorAxisCheckboxIcon(),
        {
          tandem: thirdLawCheckboxesTandem.createTandem( 'semiMajorAxisVisibleCheckbox' )
        }
      ),
      createCheckbox(
        model.periodVisibleProperty,
        KeplersLawsStrings.graph.tStringProperty,
        new Image( periodTimerIcon_png, { scale: 0.6 } ),
        {
          tandem: thirdLawCheckboxesTandem.createTandem( 'periodVisibleCheckbox' )
        }
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
function createCheckbox( property: Property<boolean>, stringProperty: TReadOnlyProperty<string>, icon: Node,
                         providedOptions: StrictOmit<WithRequired<CheckboxOptions, 'tandem'>, 'accessibleName'>
): Checkbox {

  const options = combineOptions<CheckboxOptions>( {}, SolarSystemCommonConstants.CHECKBOX_OPTIONS, {
    accessibleName: stringProperty
  }, providedOptions );

  const content = new HBox( {
    spacing: 10,
    children: [
      new Text( stringProperty, KeplersLawsConstants.CHECKBOX_TEXT_OPTIONS ),
      icon
    ]
  } );

  return new SolarSystemCommonCheckbox( property, content, options );
}

keplersLaws.register( 'OrbitalInformationPanel', OrbitalInformationPanel );