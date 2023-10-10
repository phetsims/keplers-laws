// Copyright 2023, University of Colorado Boulder

/**
 * OrbitalInformationPanel is the panel that contains controls related to the display of orbital information.
 *
 * @author Agustín Vallejo
 */

import { VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import keplersLaws from '../../keplersLaws.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import KeplersLawsCheckbox from './KeplersLawsCheckbox.js';

const CHECKBOX_INDENT = 20; // some checkboxes are indented by this amount

export default class OrbitalInformationPanel extends Panel {

  public constructor( model: KeplersLawsModel, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS, {
      tandem: tandem
    } );

    // Checkboxes for First Law
    const firstLawCheckboxesTandem = tandem.createTandem( 'firstLawCheckboxes' );
    const firstLawCheckboxes: Checkbox[] = [

      // Foci
      KeplersLawsCheckbox.createFociCheckbox( model.fociVisibleProperty, firstLawCheckboxesTandem.createTandem( 'fociCheckbox' ) ),

      // String
      KeplersLawsCheckbox.createStringCheckbox( model.stringVisibleProperty, {
        enabledProperty: model.stringVisibleProperty,
        layoutOptions: { leftMargin: CHECKBOX_INDENT }, // to indent this checkbox
        tandem: firstLawCheckboxesTandem.createTandem( 'stringCheckbox' )
      } ),

      // Axes
      KeplersLawsCheckbox.createAxesCheckbox( model.axesVisibleProperty, firstLawCheckboxesTandem.createTandem( 'axesCheckbox' ) ),

      // Semiaxes
      KeplersLawsCheckbox.createSemiaxesCheckbox( model.semiaxisVisibleProperty, {
        enabledProperty: model.axesVisibleProperty,
        layoutOptions: { leftMargin: CHECKBOX_INDENT }, // to indent this checkbox
        tandem: firstLawCheckboxesTandem.createTandem( 'semiaxesCheckbox' )
      } ),
      KeplersLawsCheckbox.createEccentricityCheckbox( model.eccentricityVisibleProperty, firstLawCheckboxesTandem.createTandem( 'eccentricityCheckbox' ) )
    ];

    // Checkboxes for Second Law
    const secondLawCheckboxesTandem = tandem.createTandem( 'secondLawCheckboxes' );
    const secondLawCheckboxes: Checkbox[] = [

      // Apoapsis
      KeplersLawsCheckbox.createApoapsisCheckbox( model.apoapsisVisibleProperty, {
        tandem: secondLawCheckboxesTandem.createTandem( 'apoapsisCheckbox' ),
        enabledProperty: new DerivedProperty( [ model.engine.eccentricityProperty ], e => e > 0 )
      } ),

      // Periapsis
      KeplersLawsCheckbox.createPeriapsisCheckbox( model.periapsisVisibleProperty, {
        tandem: secondLawCheckboxesTandem.createTandem( 'periapsisCheckbox' ),
        enabledProperty: new DerivedProperty( [ model.engine.eccentricityProperty ], e => e > 0 )
      } )
    ];

    // Checkboxes for Third Law
    const thirdLawCheckboxesTandem = tandem.createTandem( 'thirdLawCheckboxes' );
    const thirdLawCheckboxes: Checkbox[] = [

      // Semi-Major Axis (a)
      KeplersLawsCheckbox.createSemiMajorAxisCheckbox( model.semiMajorAxisVisibleProperty, thirdLawCheckboxesTandem.createTandem( 'semiMajorAxisCheckbox' ) ),

      // Period (T)
      KeplersLawsCheckbox.createPeriodCheckbox( model.periodVisibleProperty, thirdLawCheckboxesTandem.createTandem( 'periodCheckbox' ) )
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

keplersLaws.register( 'OrbitalInformationPanel', OrbitalInformationPanel );