// Copyright 2023, University of Colorado Boulder
/**
 * Panel that displays more data for the orbit, such as position and velocity vector values and directions.
 *
 * Only visibile when Preferences > Visual > More Orbital Data is turned on.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import keplersLaws from '../../keplersLaws.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { HBox, Node, RichText, RichTextOptions, TPaint, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import MoreOrbitalDataInfoDialog from './MoreOrbitalDataInfoDialog.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import KeplersLawsDerivedStrings from '../KeplersLawsDerivedStrings.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';

export default class MoreOrbitalDataPanel extends Panel {
  public constructor( model: KeplersLawsModel, providedOptions?: StrictOmit<PanelOptions, 'visibleProperty'> ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS, providedOptions, {
      visibleProperty: KeplersLawsPreferences.moreOrbitalDataEnabledProperty
    } );

    // Extra information: distance and velocity vector values
    const positionMagnitudeStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.AUStringProperty,
      value: new DerivedProperty( [ model.planet.positionProperty ], position => {
        return Utils.toFixed( position.magnitude / 100, 2 );
      } )
    } );
    const velocityMagnitudeStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.kmsStringProperty,
      value: new DerivedProperty( [ model.planet.velocityProperty ], velocity => {
        return Utils.toFixed( velocity.magnitude * SolarSystemCommonConstants.VELOCITY_MULTIPLIER, 2 );
      } )
    } );
    const distanceAngleStringProperty = new DerivedStringProperty( [ model.planet.positionProperty ], position => {
      const value = Utils.toFixed( Utils.toDegrees( position.angle ), 2 );
      return `${value}${MathSymbols.DEGREES}`;
    } );
    const velocityAngleStringProperty = new DerivedStringProperty( [ model.planet.velocityProperty ], velocity => {
      const value = Utils.toFixed( Utils.toDegrees( velocity.angle ), 2 );
      return `${value}${MathSymbols.DEGREES}`;
    } );

    // rv angle is the angle from R to V
    const rvAngleStringProperty = new DerivedStringProperty( [ model.planet.positionProperty, model.planet.velocityProperty, model.engine.eccentricityProperty ],
      ( position, velocity, eccentricity ) => {
        if ( eccentricity === 0 ) {
          return `${90.00}${MathSymbols.DEGREES}`;
        }
        const value = Utils.toFixed( Utils.toDegrees( velocity.angle - position.angle ), 2 );
        return `${value}${MathSymbols.DEGREES}`;
      } );

    const distanceEquivalentSymbolStringProperty = new DerivedStringProperty(
      [ KeplersLawsDerivedStrings.d1StringProperty, KeplersLawsStrings.symbol.RStringProperty, model.alwaysCircularProperty ], ( d1, R, alwaysCircular ) => {
        return alwaysCircular ? R : d1;
      }
    );

    // Extra information: distance and velocity vector values
    const moreInfoNode = new VBox( {
      align: 'left',
      children: [
        // First item not using createCustomEquation because it's a special case of |r|=d=value
        new HBox( {
          spacing: 2,
          children: [
            new RichText( KeplersLawsDerivedStrings.rMagnitudeStringProperty, {
              fill: KeplersLawsColors.distancesColorProperty,
              font: new PhetFont( { size: 18, weight: 'bold' } ),
              maxWidth: KeplersLawsConstants.ABSOLUTE_SYMBOL_MAX_WIDTH
            } ),
            new RichText( ' = ', KeplersLawsConstants.TEXT_OPTIONS ),
            new RichText( distanceEquivalentSymbolStringProperty, {
              fill: KeplersLawsColors.distancesColorProperty,
              font: new PhetFont( { size: 18, weight: 'bold' } ),
              maxWidth: KeplersLawsConstants.ABSOLUTE_SYMBOL_MAX_WIDTH
            } ),
            new RichText( ' = ', KeplersLawsConstants.TEXT_OPTIONS ),
            new RichText( positionMagnitudeStringProperty, combineOptions<RichTextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
              maxWidth: KeplersLawsConstants.VALUE_MAX_WIDTH
            } ) )
          ]
        } ),
        createCustomEquation(
          KeplersLawsDerivedStrings.rAngleStringProperty,
          distanceAngleStringProperty,
          KeplersLawsColors.distancesColorProperty
        ),
        createCustomEquation(
          KeplersLawsDerivedStrings.vMagnitudeStringProperty,
          velocityMagnitudeStringProperty,
          KeplersLawsColors.velocityColorProperty
        ),
        createCustomEquation(
          KeplersLawsDerivedStrings.vAngleStringProperty,
          velocityAngleStringProperty,
          KeplersLawsColors.velocityColorProperty
        ),
        createCustomEquation(
          KeplersLawsDerivedStrings.rvAngleStringProperty,
          rvAngleStringProperty,
          KeplersLawsColors.foregroundProperty
        )
      ]
    } );

    // Info button and associated dialog
    const infoDialog = new MoreOrbitalDataInfoDialog();
    const infoButton = new InfoButton( {
      accessibleName: KeplersLawsStrings.a11y.infoButtonForMoreOrbitalDataStringProperty,
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
        maxWidth: KeplersLawsConstants.ABSOLUTE_SYMBOL_MAX_WIDTH
      } ),
      new RichText( ' = ', KeplersLawsConstants.TEXT_OPTIONS ),
      new RichText( valueStringProperty, combineOptions<RichTextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        maxWidth: KeplersLawsConstants.VALUE_MAX_WIDTH
      } ) )
    ]
  } );
}

keplersLaws.register( 'MoreOrbitalDataPanel', MoreOrbitalDataPanel );