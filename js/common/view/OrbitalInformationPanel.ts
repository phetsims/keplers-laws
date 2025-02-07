// Copyright 2023-2024, University of Colorado Boulder

/**
 * OrbitalInformationPanel is the panel that contains controls related to the display of orbital information.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsCheckbox from './KeplersLawsCheckbox.js';
import KeplersLawsVisibleProperties from './KeplersLawsVisibleProperties.js';

const CHECKBOX_INDENT = 20; // some checkboxes are indented by this amount

export default class OrbitalInformationPanel extends Panel {

  public constructor( model: KeplersLawsModel, visibleProperties: KeplersLawsVisibleProperties, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );

    // Checkboxes for First Law
    const firstLawCheckboxesTandem = model.hasFirstLawFeatures ? tandem.createTandem( 'firstLawCheckboxes' ) : Tandem.OPT_OUT;
    const firstLawCheckboxes: Checkbox[] = [

      // Foci
      KeplersLawsCheckbox.createFociCheckbox( visibleProperties.fociVisibleProperty, firstLawCheckboxesTandem.createTandem( 'fociCheckbox' ) ),

      // String
      KeplersLawsCheckbox.createStringCheckbox( visibleProperties.stringCheckedProperty, {
        enabledProperty: visibleProperties.fociVisibleProperty,
        layoutOptions: { leftMargin: CHECKBOX_INDENT }, // to indent this checkbox
        tandem: firstLawCheckboxesTandem.createTandem( 'stringCheckbox' )
      } ),

      // Axes
      KeplersLawsCheckbox.createAxesCheckbox( visibleProperties.axesVisibleProperty, firstLawCheckboxesTandem.createTandem( 'axesCheckbox' ) ),

      // Semiaxes
      KeplersLawsCheckbox.createSemiaxesCheckbox( visibleProperties.semiaxesCheckedProperty, {
        enabledProperty: visibleProperties.axesVisibleProperty,
        layoutOptions: { leftMargin: CHECKBOX_INDENT }, // to indent this checkbox
        tandem: firstLawCheckboxesTandem.createTandem( 'semiaxesCheckbox' )
      } ),
      KeplersLawsCheckbox.createEccentricityCheckbox( visibleProperties.eccentricityVisibleProperty, firstLawCheckboxesTandem.createTandem( 'eccentricityCheckbox' ) )
    ];

    // Checkboxes for Second Law
    const secondLawCheckboxesTandem = model.hasSecondLawFeatures ? tandem.createTandem( 'secondLawCheckboxes' ) : Tandem.OPT_OUT;
    const secondLawCheckboxes: Checkbox[] = [

      // Apoapsis
      KeplersLawsCheckbox.createApoapsisCheckbox( visibleProperties.apoapsisVisibleProperty, {
        tandem: secondLawCheckboxesTandem.createTandem( 'apoapsisCheckbox' ),
        enabledProperty: new DerivedProperty( [ model.engine.eccentricityProperty ], e => e > 0 )
      } ),

      // Periapsis
      KeplersLawsCheckbox.createPeriapsisCheckbox( visibleProperties.periapsisVisibleProperty, {
        tandem: secondLawCheckboxesTandem.createTandem( 'periapsisCheckbox' ),
        enabledProperty: new DerivedProperty( [ model.engine.eccentricityProperty ], e => e > 0 )
      } )
    ];

    // Checkboxes for Third Law
    const thirdLawCheckboxesTandem = model.hasThirdLawFeatures ? tandem.createTandem( 'thirdLawCheckboxes' ) : Tandem.OPT_OUT;
    const thirdLawCheckboxes: Checkbox[] = [

      // Semi-Major Axis (a)
      KeplersLawsCheckbox.createSemiMajorAxisCheckbox( visibleProperties.semiMajorAxisVisibleProperty, thirdLawCheckboxesTandem.createTandem( 'semiMajorAxisCheckbox' ) ),

      // Period (T)
      KeplersLawsCheckbox.createPeriodCheckbox( visibleProperties.periodVisibleProperty, thirdLawCheckboxesTandem.createTandem( 'periodCheckbox' ) )
    ];

    const content = new VBox( {
      spacing: SolarSystemCommonConstants.VBOX_SPACING,
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

keplersLaws.register( 'OrbitalInformationPanel', OrbitalInformationPanel );