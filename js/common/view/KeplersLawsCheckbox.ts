// Copyright 2023-2025, University of Colorado Boulder

/**
 * KeplersLawsCheckbox adds static methods to SolarSystemCommonCheckbox for creating checkboxes that are specific to
 * the Kepler's Law sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import { Image, Node, rasterized } from '../../../../scenery/js/imports.js';
import SolarSystemCommonCheckbox, { SolarSystemCommonCheckboxOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import periodTimerIcon_png from '../../../images/periodTimerIcon_png.js';
import FirstLawCheckboxIcons from '../../first-law/FirstLawCheckboxIcons.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsColors from '../KeplersLawsColors.js';

type SelfOptions = EmptySelfOptions;
type KeplersLawsCheckboxOptions = SelfOptions & SolarSystemCommonCheckboxOptions;

export default class KeplersLawsCheckbox extends SolarSystemCommonCheckbox {

  protected constructor( property: Property<boolean>, stringProperty: TReadOnlyProperty<string>, providedOptions: KeplersLawsCheckboxOptions ) {
    super( property, stringProperty, providedOptions );
  }

  /**
   * Creates the 'Foci' checkbox
   */
  public static createFociCheckbox( fociVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( fociVisibleProperty, KeplersLawsStrings.fociStringProperty, {
      icon: FirstLawCheckboxIcons.createFociCheckboxIcon(),
      phetioDisplayOnlyPropertyInstrumented: true,
      tandem: tandem
    } );
  }

  /**
   * Creates the 'String' checkbox
   */
  public static createStringCheckbox( stringVisibleProperty: Property<boolean>, providedOptions: KeplersLawsCheckboxOptions ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( stringVisibleProperty, KeplersLawsStrings.stringStringProperty, combineOptions<KeplersLawsCheckboxOptions>( {
      icon: FirstLawCheckboxIcons.createStringCheckboxIcon(),
      phetioDisplayOnlyPropertyInstrumented: true
    }, providedOptions ) );
  }

  /**
   * Creates the 'Axes' checkbox
   */
  public static createAxesCheckbox( axesVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( axesVisibleProperty, KeplersLawsStrings.axesStringProperty, {
      icon: FirstLawCheckboxIcons.createAxesCheckboxIcon(),
      phetioDisplayOnlyPropertyInstrumented: true,
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Semiaxes' checkbox
   */
  public static createSemiaxesCheckbox( semiaxesVisibleProperty: Property<boolean>, providedOptions: KeplersLawsCheckboxOptions ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( semiaxesVisibleProperty, KeplersLawsStrings.semiaxesStringProperty, combineOptions<KeplersLawsCheckboxOptions>( {
      icon: FirstLawCheckboxIcons.createSemiaxesCheckboxIcon(),
      phetioDisplayOnlyPropertyInstrumented: true
    }, providedOptions ) );
  }

  /**
   * Creates the 'Apoapsis' checkbox
   */
  public static createApoapsisCheckbox( apoapsisVisibleProperty: Property<boolean>, providedOptions: KeplersLawsCheckboxOptions ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( apoapsisVisibleProperty, KeplersLawsStrings.apoapsisStringProperty, combineOptions<KeplersLawsCheckboxOptions>( {
      phetioDisplayOnlyPropertyInstrumented: true,
      icon: new XNode( {
        fill: KeplersLawsColors.apoapsisColorProperty,
        stroke: KeplersLawsColors.foregroundProperty,
        scale: 0.5
      } )
    }, providedOptions ) );
  }

  /**
   * Creates the 'Periapsis' checkbox
   */
  public static createPeriapsisCheckbox( periapsisVisibleProperty: Property<boolean>, providedOptions: KeplersLawsCheckboxOptions ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( periapsisVisibleProperty, KeplersLawsStrings.periapsisStringProperty, combineOptions<KeplersLawsCheckboxOptions>( {
      phetioDisplayOnlyPropertyInstrumented: true,
      icon: new XNode( {
        fill: KeplersLawsColors.periapsisColorProperty,
        stroke: KeplersLawsColors.foregroundProperty,
        scale: 0.5
      } )
    }, providedOptions ) );
  }

  /**
   * Creates the 'Semi-Major Axis (a)' checkbox
   */
  public static createSemiMajorAxisCheckbox( semiMajorAxisVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( semiMajorAxisVisibleProperty, KeplersLawsStrings.graph.aStringProperty, {
      icon: FirstLawCheckboxIcons.createSemiMajorAxisCheckboxIcon(),
      phetioDisplayOnlyPropertyInstrumented: true,
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Period (T)' checkbox
   */
  public static createPeriodCheckbox( periodVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( periodVisibleProperty, KeplersLawsStrings.graph.tStringProperty, {
      icon: new Image( periodTimerIcon_png, { scale: 0.6 } ),
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Area Values' checkbox
   */
  public static createAreaValuesCheckbox( areaValuesVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( areaValuesVisibleProperty, KeplersLawsStrings.areaValuesStringProperty, {
      textOptions: {
        maxWidth: 200
      },
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Time Values' checkbox
   */
  public static createTimeValuesCheckbox( timeValuesVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( timeValuesVisibleProperty, KeplersLawsStrings.timeValuesStringProperty, {
      textOptions: {
        maxWidth: 200
      },
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Eccentricity' checkbox
   */
  public static createEccentricityCheckbox( eccentricityVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( eccentricityVisibleProperty, KeplersLawsStrings.eccentricityStringProperty, {
      icon: FirstLawCheckboxIcons.createEccentricityCheckboxIcon(),
      phetioDisplayOnlyPropertyInstrumented: true,
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Always Circular' checkbox
   */
  public static createAlwaysCircularCheckbox( alwaysCircularProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( alwaysCircularProperty, KeplersLawsStrings.alwaysCircularStringProperty, {
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Stopwatch' checkbox
   */
  public static createStopwatchCheckbox( stopwatchVisibleProperty: Property<boolean>, tandem: Tandem ): KeplersLawsCheckbox {
    return new KeplersLawsCheckbox( stopwatchVisibleProperty, KeplersLawsStrings.stopwatchStringProperty, {
      icon: createStopwatchIcon(),
      tandem: tandem
    } );
  }
}

/**
 * Creates the icon for the 'Stopwatch' checkbox.
 */
function createStopwatchIcon(): Node {

  const stopwatch = new Stopwatch( {
    isVisible: true,
    tandem: Tandem.OPT_OUT
  } );

  const stopwatchNode = new StopwatchNode( stopwatch, {
    numberDisplayOptions: {
      textOptions: {
        maxWidth: 100
      }
    },
    tandem: Tandem.OPT_OUT
  } );

  const icon = rasterized( stopwatchNode, {
    resolution: 5,
    nodeOptions: {
      cursor: 'pointer'
    }
  } );
  icon.setScaleMagnitude( 0.3 );

  return icon;
}

keplersLaws.register( 'KeplersLawsCheckbox', KeplersLawsCheckbox );