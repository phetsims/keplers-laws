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

  /**
   * Creates the 'Always Circular' checkbox
   */
  public static createAlwaysCircularCheckbox( alwaysCircularProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {

    const text = new Text( KeplersLawsStrings.alwaysCircularStringProperty, SolarSystemCommonCheckbox.TEXT_OPTIONS );

    return new KeplersLawsCheckbox( alwaysCircularProperty, text, {
      accessibleName: KeplersLawsStrings.alwaysCircularStringProperty,
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Stopwatch' checkbox
   */
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
 * Creates the icon for the 'Stopwatch' checkbox.
 */
function createStopwatchIcon(): Node {

  const stopwatch = new Stopwatch( {
    isVisible: true
  } );

  const stopwatchNode = new StopwatchNode( stopwatch, {
    numberDisplayOptions: {
      textOptions: {
        maxWidth: 100
      }
    }
  } );

  const icon = stopwatchNode.rasterized( {
    resolution: 5,
    imageOptions: {
      cursor: 'pointer'
    }
  } );
  icon.setScaleMagnitude( 0.3 );

  return icon;
}

keplersLaws.register( 'KeplersLawsCheckbox', KeplersLawsCheckbox );