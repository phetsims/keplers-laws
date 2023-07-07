// Copyright 2023, University of Colorado Boulder
/**
 * ComboBox containing the target orbits.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import TargetOrbits from '../model/TargetOrbits.js';
import ComboBox, { ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

const targetOrbits = [
  TargetOrbits.NONE,
  TargetOrbits.MERCURY,
  TargetOrbits.VENUS,
  TargetOrbits.EARTH,
  TargetOrbits.MARS,
  TargetOrbits.JUPITER
];

export default class TargetOrbitsComboBox extends ComboBox<TargetOrbits> {
  public constructor( model: KeplersLawsModel, listParent: Node, providedOptions: ComboBoxOptions ) {
    const options = combineOptions<ComboBoxOptions>( {
      buttonTouchAreaXDilation: 10,
      buttonTouchAreaYDilation: 10,

      // pdom
      accessibleName: KeplersLawsStrings.a11y.targetOrbitSelectorStringProperty
    }, providedOptions );

    const createItem = ( mode: TargetOrbits, nameProperty: TReadOnlyProperty<string> ) => {
      return {
        value: mode,
        createNode: () => new Text( nameProperty, {
          font: SolarSystemCommonConstants.PANEL_FONT,
          maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
        } ),
        a11yName: nameProperty
      };
    };

    super( model.targetOrbitProperty, targetOrbits.map( targetOrbit => {
      return createItem( targetOrbit, targetOrbit.stringProperty );
    } ), listParent, options );
  }
}

keplersLaws.register( 'TargetOrbitsComboBox', TargetOrbitsComboBox );