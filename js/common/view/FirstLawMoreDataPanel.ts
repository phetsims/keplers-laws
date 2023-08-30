// Copyright 2023, University of Colorado Boulder
/**
 * Panel that holds extra information about the orbit such as
 * position and velocity vector values and directions.
 *
 * Only visibile when Preferences > Visual > More Orbital Data is turned on.
 *
 * @author Agustín Vallejo
 */

import keplersLaws from '../../keplersLaws.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { HBox, Node, RichText, TPaint, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import InfoDialogMoreData from './InfoDialogMoreData.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

export default class FirstLawMoreDataPanel extends Panel {
  public constructor( model: KeplersLawsModel, providedOptions: StrictOmit<PanelOptions, 'visibleProperty'> ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS, providedOptions, {
      visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty
    } );

    // Extra information: distance and velocity vector values
    const positionMagnitudeStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.AUStringProperty,
      value: new DerivedProperty( [ model.planet.positionProperty ], position => {
        return Utils.toFixed( position.magnitude / 100, 2 );
      } )
    }, { tandem: Tandem.OPT_OUT } );
    const velocityMagnitudeStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.kmsStringProperty,
      value: new DerivedProperty( [ model.planet.velocityProperty ], velocity => {
        return Utils.toFixed( velocity.magnitude * SolarSystemCommonConstants.VELOCITY_MULTIPLIER, 2 );
      } )
    }, { tandem: Tandem.OPT_OUT } );
    const distanceAngleStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.degreesStringProperty,
      value: new DerivedProperty( [ model.planet.positionProperty ], position => {
        return Utils.toFixed( Utils.toDegrees( position.angle ), 2 );
      } )
    }, { tandem: Tandem.OPT_OUT } );
    const velocityAngleStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.degreesStringProperty,
      value: new DerivedProperty( [ model.planet.velocityProperty ], velocity => {
        return Utils.toFixed( Utils.toDegrees( velocity.angle ), 2 );
      } )
    }, { tandem: Tandem.OPT_OUT } );

    // rv angle is the angle from R to V
    const rvAngleStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.degreesStringProperty,
      value: new DerivedProperty( [ model.planet.positionProperty, model.planet.velocityProperty ], ( position, velocity ) => {
        return Utils.toFixed( Utils.toDegrees( velocity.angle - position.angle ), 2 );
      } )
    }, { tandem: Tandem.OPT_OUT } );

    // Extra information: distance and velocity vector values
    const moreInfoNode = new VBox( {
      align: 'left',
      children: [
        createCustomEquation(
          KeplersLawsStrings.symbols.positionMagnitudeStringProperty,
          positionMagnitudeStringProperty,
          KeplersLawsColors.distancesColorProperty
        ),
        createCustomEquation(
          KeplersLawsStrings.symbols.distanceAngleStringProperty,
          distanceAngleStringProperty,
          KeplersLawsColors.distancesColorProperty
        ),
        createCustomEquation(
          KeplersLawsStrings.symbols.velocityMagnitudeStringProperty,
          velocityMagnitudeStringProperty,
          KeplersLawsColors.velocityColorProperty
        ),
        createCustomEquation(
          KeplersLawsStrings.symbols.velocityAngleStringProperty,
          velocityAngleStringProperty,
          KeplersLawsColors.velocityColorProperty
        ),
        createCustomEquation(
          KeplersLawsStrings.symbols.rvAngleStringProperty,
          rvAngleStringProperty,
          KeplersLawsColors.foregroundProperty
        )
      ]
    } );

    // Info button and associated dialog
    const infoDialog = new InfoDialogMoreData();
    const infoButton = new InfoButton( {
      accessibleName: KeplersLawsStrings.a11y.extraInfoButtonStringProperty,
      scale: 0.5,
      iconFill: 'rgb( 41, 106, 163 )',
      touchAreaDilation: 20,
      listener: () => infoDialog.show()
    } );

    // The panel's content
    const content = new HBox( {
      align: 'top',
      spacing: 5,
      children: [ moreInfoNode, infoButton ]
    } );

    super( content, options );
  }
}

function createCustomEquation( symbolStringProperty: TReadOnlyProperty<string>, valueStringProperty: TReadOnlyProperty<string>, symbolColor: TPaint ): Node {
  return new HBox( {
    spacing: 2,
    children: [
      new RichText( symbolStringProperty, {
        fill: symbolColor,
        font: new PhetFont( { size: 18, weight: 'bold' } ),
        maxWidth: 25
      } ),
      new RichText( ' = ', KeplersLawsConstants.TEXT_OPTIONS ),
      new RichText( valueStringProperty, KeplersLawsConstants.TEXT_OPTIONS )
    ]
  } );
}

keplersLaws.register( 'FirstLawMoreDataPanel', FirstLawMoreDataPanel );