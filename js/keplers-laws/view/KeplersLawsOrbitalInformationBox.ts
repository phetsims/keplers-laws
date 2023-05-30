// Copyright 2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, HBoxOptions, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import KeplersLawsStrings from '../../../../keplers-laws/js/KeplersLawsStrings.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import keplersLaws from '../../keplersLaws.js';
import FirstLawCheckboxIcons from '../../first-law/FirstLawCheckboxIcons.js';

type SelfOptions = EmptySelfOptions;

export type KeplersLawsOrbitalInformationOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

class KeplersLawsOrbitalInformationBox extends VBox {

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsOrbitalInformationOptions ) {
    const getCheckboxOptions = ( name: string, options: CheckboxOptions = {} ) => {
      return combineOptions<CheckboxOptions>( options, SolarSystemCommonConstants.CHECKBOX_OPTIONS, {
        tandem: providedOptions.tandem.createTandem( name )
      } );
    };

    const createCheckbox = (
      property: LinkableProperty<boolean>,
      text: TReadOnlyProperty<string>,
      tandemName: string,
      icon: Node = new Node(),
      options?: CheckboxOptions
    ) => {
      return new Checkbox( property, new HBox( {
        children: [
          new Text( text, SolarSystemCommonConstants.TEXT_OPTIONS ),
          icon
        ],
        spacing: 10
      } ), getCheckboxOptions( tandemName, options ) );
    };

    const firstLawChildren = [
      createCheckbox(
        model.fociVisibleProperty,
        KeplersLawsStrings.fociStringProperty,
        'fociVisibleCheckbox',
        FirstLawCheckboxIcons.getFociIcon()
      ),
      createCheckbox(
        model.stringsVisibleProperty,
        KeplersLawsStrings.stringsStringProperty,
        'stringsVisibleCheckbox',
        FirstLawCheckboxIcons.getStringsIcon(),
        {
          enabledProperty: model.fociVisibleProperty,
          layoutOptions: { leftMargin: 20 }
        }
      ),
      createCheckbox(
        model.axisVisibleProperty,
        KeplersLawsStrings.axisStringProperty,
        'axisVisibleCheckbox',
        FirstLawCheckboxIcons.getAxisIcon()
      ),
      createCheckbox(
        model.semiaxisVisibleProperty,
        KeplersLawsStrings.semiaxisStringProperty,
        'semiAxisVisibleCheckbox',
        FirstLawCheckboxIcons.getSemiaxesIcon(),
        {
          enabledProperty: model.axisVisibleProperty,
          layoutOptions: { leftMargin: 20 }
        }
      ),
      createCheckbox(
        model.eccentricityVisibleProperty,
        KeplersLawsStrings.eccentricityStringProperty,
        'eccentricityVisibleCheckbox',
        FirstLawCheckboxIcons.getEccentricityIcon()
      )
    ];

    const secondLawChildren = [
      createCheckbox(
        model.apoapsisVisibleProperty,
        KeplersLawsStrings.apoapsisStringProperty,
        'apoapsisVisibleCheckbox',
        new XNode( {
          fill: SolarSystemCommonColors.thirdBodyColorProperty,
          stroke: SolarSystemCommonColors.foregroundProperty,
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
        //REVIEW: visibFle looks like a typo introduced in https://github.com/phetsims/my-solar-system/commit/8ed18445210b1f2fbfdc88759cdb0894b8a3004a
        //REVIEW: it should be fixed
        'periapsisVisibFleCheckbox',
        new XNode( {
          fill: 'gold',
          stroke: SolarSystemCommonColors.foregroundProperty,
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
        'semiMajorAxisVisibleCheckbox'
        // axisIconImageNode TODO
      ),
      createCheckbox(
        model.periodVisibleProperty,
        KeplersLawsStrings.graph.tStringProperty,
        'periodVisibleCheckbox'
        // periodIconImageNode TODO
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