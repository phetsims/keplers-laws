// Copyright 2023, University of Colorado Boulder

/**
 * KeplersLawsCheckbox creates checkboxes that are specific to the Kepler's Law sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SolarSystemCommonCheckbox, { SolarSystemCommonCheckboxOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import keplersLaws from '../../keplersLaws.js';
import Property from '../../../../axon/js/Property.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';

type SelfOptions = EmptySelfOptions;
type KeplersLawsCheckboxOptions = SelfOptions & SolarSystemCommonCheckboxOptions;

export default class KeplersLawsCheckbox extends SolarSystemCommonCheckbox {

  protected constructor( property: Property<boolean>, content: Node, providedOptions?: KeplersLawsCheckboxOptions ) {
    super( property, content, providedOptions );
  }

  public static createAlwaysCircularCheckbox( alwaysCircularProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {

    const text = new Text( KeplersLawsStrings.alwaysCircularStringProperty, SolarSystemCommonCheckbox.TEXT_OPTIONS );

    return new KeplersLawsCheckbox( alwaysCircularProperty, text, {
      accessibleName: KeplersLawsStrings.alwaysCircularStringProperty,
      tandem: tandem
    } );
  }

  public static createStopwatchCheckbox( stopwatchVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {

    const text = new Text( KeplersLawsStrings.stopwatchStringProperty, SolarSystemCommonCheckbox.TEXT_OPTIONS );
    const icon = createStopwatchIcon();

    const content = new HBox( {
      children: [ text, icon ],
      spacing: SolarSystemCommonCheckbox.TEXT_ICON_SPACING
    } );

    return new KeplersLawsCheckbox( stopwatchVisibleProperty, content, {
      accessibleName: KeplersLawsStrings.stopwatchStringProperty,
      tandem: tandem
    } );
  }
}

/**
 * Creates the icon for the stopwatch checkbox.
 */
function createStopwatchIcon(): Node {
  const stopwatchIcon = new StopwatchNode( new Stopwatch( {
    isVisible: true
  } ), {
    numberDisplayOptions: {
      textOptions: {
        maxWidth: 100
      }
    }
  } ).rasterized( {
    resolution: 5,
    imageOptions: {
      cursor: 'pointer'
    }
  } );
  stopwatchIcon.setScaleMagnitude( 0.3 );
  return stopwatchIcon;
}

keplersLaws.register( 'KeplersLawsCheckbox', KeplersLawsCheckbox );