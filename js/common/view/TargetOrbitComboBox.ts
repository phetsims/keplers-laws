// Copyright 2023, University of Colorado Boulder

/**
 * TargetOrbitComboBox is the combo box for selecting a target orbit.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import TargetOrbits from '../model/TargetOrbits.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

type TargetOrbitComboBoxOptions = SelfOptions & ComboBoxOptions;

export default class TargetOrbitComboBox extends ComboBox<TargetOrbits> {

  public constructor( targetOrbitProperty: Property<TargetOrbits>, listParent: Node, providedOptions: TargetOrbitComboBoxOptions ) {

    const options = optionize<TargetOrbitComboBoxOptions, SelfOptions, ComboBoxOptions>()( {
      isDisposable: false,
      buttonTouchAreaXDilation: 10,
      buttonTouchAreaYDilation: 10,

      // pdom
      accessibleName: KeplersLawsStrings.a11y.targetOrbitSelectorStringProperty
    }, providedOptions );

    assert && assert( targetOrbitProperty.validValues );
    const items = targetOrbitProperty.validValues!.map( targetOrbit =>
      createItem( targetOrbit, targetOrbit.nameProperty, targetOrbit.tandemName, targetOrbit.isPhetioConfigurable ) );

    super( targetOrbitProperty, items, listParent, options );
  }
}

/**
 * Creates and item for the combo box.
 */
function createItem( mode: TargetOrbits, nameProperty: TReadOnlyProperty<string>, tandemName: string, isPhetioConfigurable: boolean ): ComboBoxItem<TargetOrbits> {
  return {
    value: mode,
    createNode: () => new Text( nameProperty, {
      font: SolarSystemCommonConstants.COMBO_BOX_ITEM_FONT,
      maxWidth: 120
    } ),
    comboBoxListItemNodeOptions: {
      visible: !isPhetioConfigurable
    },
    a11yName: nameProperty,
    tandemName: tandemName
  };
}

keplersLaws.register( 'TargetOrbitComboBox', TargetOrbitComboBox );