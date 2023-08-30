// Copyright 2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, HBoxOptions, Image, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
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

type SelfOptions = EmptySelfOptions;

export type KeplersLawsOrbitalInformationOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

class KeplersLawsOrbitalInformationBox extends VBox {

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsOrbitalInformationOptions ) {
    const getCheckboxOptions = ( tandemName: string, accesibleName: string | TReadOnlyProperty<string>, options: CheckboxOptions = {} ) => {
      return combineOptions<CheckboxOptions>( options, SolarSystemCommonConstants.CHECKBOX_OPTIONS, {
        tandem: providedOptions.tandem.createTandem( tandemName ),
        accessibleName: accesibleName
      } );
    };

    const createCheckbox = (
      property: Property<boolean>,
      text: TReadOnlyProperty<string>,
      tandemName: string,
      icon: Node = new Node(),
      options?: CheckboxOptions
    ) => {
      return new SolarSystemCommonCheckbox( property, new HBox( {
        children: [
          new Text( text, KeplersLawsConstants.TEXT_OPTIONS ),
          icon
        ],
        spacing: 10
      } ), getCheckboxOptions( tandemName, text, options ) );
    };

    const firstLawChildren = [
      createCheckbox(
        model.fociVisibleProperty,
        KeplersLawsStrings.fociStringProperty,
        'fociVisibleCheckbox',
        FirstLawCheckboxIcons.createFociCheckboxIcon()
      ),
      createCheckbox(
        model.stringsVisibleProperty,
        KeplersLawsStrings.stringsStringProperty,
        'stringsVisibleCheckbox',
        FirstLawCheckboxIcons.createStringsCheckboxIcon(),
        {
          enabledProperty: model.fociVisibleProperty,
          layoutOptions: { leftMargin: 20 }
        }
      ),
      createCheckbox(
        model.axisVisibleProperty,
        KeplersLawsStrings.axisStringProperty,
        'axisVisibleCheckbox',
        FirstLawCheckboxIcons.createAxisCheckboxIcon()
      ),
      createCheckbox(
        model.semiaxisVisibleProperty,
        KeplersLawsStrings.semiaxisStringProperty,
        'semiAxisVisibleCheckbox',
        FirstLawCheckboxIcons.createSemiaxesCheckboxIcon(),
        {
          enabledProperty: model.axisVisibleProperty,
          layoutOptions: { leftMargin: 20 }
        }
      ),
      createCheckbox(
        model.eccentricityVisibleProperty,
        KeplersLawsStrings.eccentricityStringProperty,
        'eccentricityVisibleCheckbox',
        FirstLawCheckboxIcons.createEccentricityCheckboxIcon()
      )
    ];

    const secondLawChildren = [
      createCheckbox(
        model.apoapsisVisibleProperty,
        KeplersLawsStrings.apoapsisStringProperty,
        'apoapsisVisibleCheckbox',
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
        'periapsisVisibleCheckbox',
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

    const thirdLawChildren = [
      createCheckbox(
        model.semiMajorAxisVisibleProperty,
        KeplersLawsStrings.graph.aStringProperty,
        'semiMajorAxisVisibleCheckbox',
        FirstLawCheckboxIcons.createSemiMajorAxisCheckboxIcon()
      ),
      createCheckbox(
        model.periodVisibleProperty,
        KeplersLawsStrings.graph.tStringProperty,
        'periodVisibleCheckbox',
        new Image( periodTimerIcon_png, {
          scale: 0.6
        } )
      )
    ];

    super( optionize<KeplersLawsOrbitalInformationOptions, SelfOptions, HBoxOptions>()( {
      spacing: 5,
      align: 'left',
      stretch: true
    }, providedOptions ) );

    model.lawUpdatedEmitter.addListener( () => {
      this.children = [
        ...( model.isFirstLawProperty.value ? firstLawChildren :
             model.isSecondLawProperty.value ? secondLawChildren :
             model.isThirdLawProperty.value ? thirdLawChildren : [] )
      ];
    } );

    model.lawUpdatedEmitter.emit();
  }
}

keplersLaws.register( 'KeplersLawsOrbitalInformationBox', KeplersLawsOrbitalInformationBox );
export default KeplersLawsOrbitalInformationBox;