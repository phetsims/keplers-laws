// Copyright 2023, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import { AlignBox, HBox, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsControls from './KeplersLawsControls.js';
import SecondLawPanels from './SecondLawPanels.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import ThirdLawPanels from './ThirdLawPanels.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonScreenView, { CommonScreenViewOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
import LawsButtons from './LawsButtons.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import FirstLawPanels from './FirstLawPanels.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import OrbitalWarningMessage from './OrbitalWarningMessage.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import DistancesDisplayNode from './DistancesDisplayNode.js';
import keplersLaws from '../../keplersLaws.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

// constants
const MARGIN = 10;

type SelfOptions = EmptySelfOptions;

export type KeplersLawsScreenViewOptions = SelfOptions & CommonScreenViewOptions;

class KeplersLawsScreenView extends SolarSystemCommonScreenView {
  private readonly stopwatchNode: StopwatchNode;

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {
    const options = combineOptions<CommonScreenViewOptions>( providedOptions, {
      playingAllowedProperty: model.engine.allowedOrbitProperty
    } );

    super( model, options );

    model.engine.orbitalAreas.forEach( ( area, index ) => {
      area.insideProperty.link( inside => {
        if ( inside && model.isPlayingProperty.value && model.isSecondLawProperty.value ) {
          const soundIndex = model.engine.retrograde ? model.periodDivisionProperty.value - index - 1 : index;
          this.bodySoundManager.playOrbitalMetronome( soundIndex, model.engine.a, model.periodDivisionProperty.value );
        }
      } );
    } );

    const modelDragBoundsProperty = new DerivedProperty( [
      this.visibleBoundsProperty,
      this.modelViewTransformProperty
    ], ( visibleBounds, modelViewTransform ) => {
      const viewBounds = modelViewTransform.viewToModelBounds( visibleBounds );

      return viewBounds;
    } );

    const sun = model.bodies[ 0 ];
    const body = model.bodies[ 1 ];
    const sunNode = new BodyNode( model.bodies[ 0 ], this.modelViewTransformProperty, {
      draggable: false
    } );
    const bodyNode = new BodyNode( body, this.modelViewTransformProperty, {
      useCueingArrows: true,
      valuesVisibleProperty: model.valuesVisibleProperty,
      mapPosition: ( point, radius ) => {
        point = modelDragBoundsProperty.value.eroded( radius ).closestPointTo( point );

        const escapeRadius = model.engine.escapeRadiusProperty.value;

        if ( point.magnitude > escapeRadius ) {
          point = point.normalized().times( escapeRadius );
        }

        return point;
      }
    } );
    this.bodiesLayer.addChild( sunNode );
    this.bodiesLayer.addChild( bodyNode );

    // Draggable velocity vector
    this.componentsLayer.addChild( this.createDraggableVectorNode( body, {
      minimumMagnitude: 30,
      snapToZero: false,
      maxMagnitudeProperty: model.engine.escapeSpeedProperty,
      enabledProperty: DerivedProperty.not( model.alwaysCircularProperty )
    } ) );

    // Gravity force vectors
    this.componentsLayer.addChild( new VectorNode(
      body, this.modelViewTransformProperty, model.gravityVisibleProperty, body.forceProperty,
      new NumberProperty( 0 ), { fill: PhetColorScheme.GRAVITATIONAL_FORCE }
    ) );

    this.componentsLayer.addChild( new VectorNode(
      sun, this.modelViewTransformProperty, model.gravityVisibleProperty, sun.forceProperty,
      new NumberProperty( 0 ), { fill: PhetColorScheme.GRAVITATIONAL_FORCE }
    ) );

    const ellipticalOrbitNode = new EllipticalOrbitNode( model, this.modelViewTransformProperty );
    this.bottomLayer.addChild( ellipticalOrbitNode );
    this.bodiesLayer.addChild( ellipticalOrbitNode.topLayer );

    // UI ----------------------------------------------------------------------------------
    // Second and Third Law Accordion Boxes and Zoom Buttons

    this.topLayer.addChild( new OrbitalWarningMessage( model, this.modelViewTransformProperty ) );

    const lawsAndZoomBoxes = new AlignBox( new HBox( {
        children: [
          new FirstLawPanels( model ),
          new SecondLawPanels( model ),
          new ThirdLawPanels( model )
          // NOTE: CODE TEMPORARILY COMMENTED OUT, AWAITING DESIGN DECISION
          // new MagnifyingGlassZoomButtonGroup(
          //   model.zoomLevelProperty, {
          //     spacing: 8,
          //     magnifyingGlassNodeOptions: {
          //       glassRadius: 8
          //     },
          //     touchAreaXDilation: 5,
          //     touchAreaYDilation: 5
          //   } )
        ],
        spacing: 10,
        align: 'top'
      } ),
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: MARGIN,
        xAlign: 'left',
        yAlign: 'top'
      }
    );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    const controlPanelAlignBox = new AlignBox(
      new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          this.timeBox,
          new KeplersLawsControls( model, providedOptions.tandem.createTandem( 'controlPanel' ) )
        ]
      } ),
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: MARGIN,
        xAlign: 'right',
        yAlign: 'top'
      }
    );

    this.stopwatchNode = new StopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: model.periodVisibleProperty,
      // tandem: tandem.createTandem( 'stopwatchNode' ),
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
          bigNumberFont: 25,
          smallNumberFont: 17
        } )
      }
    } );

    this.topLayer.addChild( this.stopwatchNode );

    const lawsButtonsBox = new AlignBox( new HBox( {
        children: [
          new LawsButtons( model )
        ],
        spacing: 20
      } ),
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: MARGIN,
        xAlign: 'left',
        yAlign: 'bottom'
      }
    );

    const distancesDisplayBox = new AlignBox( new DistancesDisplayNode( model, this.modelViewTransformProperty ), {
      alignBoundsProperty: this.availableBoundsProperty,
      margin: SolarSystemCommonConstants.MARGIN,
      xAlign: 'center',
      yAlign: 'top'
    } );

    const resetBox = new AlignBox( this.resetAllButton,
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: SolarSystemCommonConstants.MARGIN,
        xAlign: 'right',
        yAlign: 'bottom'
      } );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( lawsAndZoomBoxes );
    this.interfaceLayer.addChild( controlPanelAlignBox );
    this.interfaceLayer.addChild( lawsButtonsBox );
    this.interfaceLayer.addChild( resetBox );
    this.bottomLayer.addChild( distancesDisplayBox );
  }
}

keplersLaws.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;