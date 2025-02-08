// Copyright 2023-2025, University of Colorado Boulder

/**
 * TargetOrbitComboBox is the combo box for selecting a target orbit.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import TargetOrbit from '../model/TargetOrbit.js';

type SelfOptions = EmptySelfOptions;

type TargetOrbitComboBoxOptions = SelfOptions & ComboBoxOptions;

export default class TargetOrbitComboBox extends ComboBox<TargetOrbit> {

  public constructor( targetOrbitProperty: Property<TargetOrbit>, listParent: Node, providedOptions: TargetOrbitComboBoxOptions ) {

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
function createItem( mode: TargetOrbit, nameProperty: TReadOnlyProperty<string>, tandemName: string, isPhetioConfigurable: boolean ): ComboBoxItem<TargetOrbit> {
  return {
    value: mode,
    createNode: () => new Text( nameProperty, {
      font: SolarSystemCommonConstants.COMBO_BOX_ITEM_FONT,
      maxWidth: 120
    } ),
    comboBoxListItemNodeOptions: {
      visible: !isPhetioConfigurable
    },
    accessibleName: nameProperty,
    tandemName: tandemName
  };
}

keplersLaws.register( 'TargetOrbitComboBox', TargetOrbitComboBox );