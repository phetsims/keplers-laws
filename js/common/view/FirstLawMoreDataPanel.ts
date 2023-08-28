// Copyright 2023, University of Colorado Boulder
/**
 * Object that controls the sound variations of the orbital changes.
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
import { HBox, RichText, TPaint, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import InfoDialogMoreData from './InfoDialogMoreData.js';
import KeplersLawsColors from '../KeplersLawsColors.js';

export default class FirstLawMoreDataPanel extends Panel {
  public constructor( model: KeplersLawsModel, providedOptions: PanelOptions ) {

    const options = combineOptions<PanelOptions>( {
      visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty
    }, providedOptions );

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

    const createCustomEquation = ( symbol: TReadOnlyProperty<string>, text: TReadOnlyProperty<string>, symbolColor: TPaint ) => {
      return [
        new RichText( symbol, {
          fill: symbolColor,
          font: new PhetFont( { size: 18, weight: 'bold' } ),
          maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
        } ),
        new RichText( ' = ', KeplersLawsConstants.TEXT_OPTIONS ),
        new RichText( text, KeplersLawsConstants.TEXT_OPTIONS )
      ];
    };

    const infoDialog = new InfoDialogMoreData();

    super( new HBox( {
      align: 'top',
      children: [
        new VBox( {
          align: 'left',
          children: [
            // Extra information: distance and velocity vector values
            new HBox( {
              spacing: 2,
              visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.positionMagnitudeStringProperty,
                positionMagnitudeStringProperty,
                KeplersLawsColors.distancesColorProperty
              )
            } ),
            new HBox( {
              spacing: 2,
              visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.distanceAngleStringProperty,
                distanceAngleStringProperty,
                KeplersLawsColors.distancesColorProperty
              )
            } ),
            new HBox( {
              spacing: 2,
              visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.velocityMagnitudeStringProperty,
                velocityMagnitudeStringProperty,
                KeplersLawsColors.velocityColorProperty
              )
            } ),
            new HBox( {
              spacing: 2,
              visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.velocityAngleStringProperty,
                velocityAngleStringProperty,
                KeplersLawsColors.velocityColorProperty
              )
            } ),
            new HBox( {
              spacing: 2,
              visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty,
              children: createCustomEquation(
                KeplersLawsStrings.symbols.rvAngleStringProperty,
                rvAngleStringProperty,
                KeplersLawsColors.foregroundProperty
              )
            } )
          ]
        } ),
        new InfoButton( {
          accessibleName: KeplersLawsStrings.a11y.extraInfoButtonStringProperty,
          scale: 0.5,
          iconFill: 'rgb( 41, 106, 163 )',
          touchAreaDilation: 20,
          listener: () => infoDialog.show()
        } )
      ]
    } ), combineOptions<PanelOptions>( options, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) );
  }
}

keplersLaws.register( 'FirstLawMoreDataPanel', FirstLawMoreDataPanel );