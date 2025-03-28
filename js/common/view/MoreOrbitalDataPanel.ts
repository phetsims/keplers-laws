// Copyright 2023-2025, University of Colorado Boulder

/**
 * Panel that displays more data for the orbit, such as position and velocity vector values and directions.
 *
 * Only visibile when Preferences > Visual > More Orbital Data is turned on.
 *
 * @author Agustín Vallejo
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import TPaint from '../../../../scenery/js/util/TPaint.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsDerivedStrings from '../KeplersLawsDerivedStrings.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsPreferences from '../model/KeplersLawsPreferences.js';
import MoreOrbitalDataInfoDialog from './MoreOrbitalDataInfoDialog.js';

export default class MoreOrbitalDataPanel extends Panel {
  public constructor( model: KeplersLawsModel, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      visibleProperty: KeplersLawsPreferences.moreOrbitalDataVisibleProperty,
      tandem: tandem,
      phetioFeatured: true
    } );

    // Extra information: distance and velocity vector values
    const distanceStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.AUStringProperty,
      value: new DerivedProperty( [ model.distanceProperty ],
        distance => Utils.toFixed( distance, 2 ) )
    } );
    const velocityMagnitudeStringProperty = new PatternStringProperty( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
      units: KeplersLawsStrings.units.kmsStringProperty,
      value: new DerivedProperty( [ model.planet.speedProperty ],
        speed => Utils.toFixed( speed, 2 ) )
    } );
    const distanceAngleStringProperty = new DerivedStringProperty( [ model.distanceAngleProperty ], distanceAngle => {
      const value = Utils.toFixed( distanceAngle, 2 );
      return `${value}${MathSymbols.DEGREES}`;
    } );
    const velocityAngleStringProperty = new DerivedStringProperty( [ model.velocityAngleProperty ], velocityAngle => {
      const value = Utils.toFixed( velocityAngle, 2 );
      return `${value}${MathSymbols.DEGREES}`;
    } );

    // rv angle is the angle from R to V
    const rvAngleStringProperty = new DerivedStringProperty( [ model.rvAngleProperty ], rvAngle => {
      const value = Utils.toFixed( rvAngle, 2 );
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
      minContentWidth: KeplersLawsConstants.VALUE_MAX_WIDTH,
      children: [
        // First item not using createCustomEquation because it's a special case of |r|=d=value
        new HBox( {
          spacing: 2,
          align: 'origin',
          justify: 'left',
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
            new RichText( distanceStringProperty, combineOptions<RichTextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
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
          SolarSystemCommonColors.velocityColorProperty
        ),
        createCustomEquation(
          KeplersLawsDerivedStrings.vAngleStringProperty,
          velocityAngleStringProperty,
          SolarSystemCommonColors.velocityColorProperty
        ),
        createCustomEquation(
          KeplersLawsDerivedStrings.rvAngleStringProperty,
          rvAngleStringProperty,
          KeplersLawsColors.foregroundProperty
        )
      ]
    } );

    // Info button and associated dialog
    const infoDialog = new MoreOrbitalDataInfoDialog( tandem.createTandem( 'infoDialog' ) );
    const infoButton = new InfoButton( {
      accessibleName: KeplersLawsStrings.a11y.infoButtonForMoreOrbitalDataStringProperty,
      scale: 0.5,
      touchAreaDilation: 20,
      listener: () => infoDialog.show(),
      tandem: tandem.createTandem( 'infoButton' )
    } );

    // The panel's content
    const content = new HBox( {
      align: 'top',
      spacing: 10,
      children: [ moreInfoNode, infoButton ]
    } );

    super( content, options );
  }
}

function createCustomEquation( symbolStringProperty: TReadOnlyProperty<string>, valueStringProperty: TReadOnlyProperty<string>, symbolColor: TPaint ): Node {
  return new HBox( {
    spacing: 2,
    align: 'origin',
    justify: 'left',
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