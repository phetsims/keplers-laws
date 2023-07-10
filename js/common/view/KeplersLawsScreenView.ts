// Copyright 2023, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import { AlignBox, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsControls from './KeplersLawsControls.js';
import SecondLawPanels from './SecondLawPanels.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import ThirdLawPanels from './ThirdLawPanels.js';
import optionize from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonScreenView, { BodyBoundsItem, SolarSystemCommonScreenViewOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
import LawsButtons from './LawsButtons.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import FirstLawPanels from './FirstLawPanels.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import OrbitalWarningMessage from './OrbitalWarningMessage.js';
import DistancesDisplayNode from './DistancesDisplayNode.js';
import keplersLaws from '../../keplersLaws.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PeriodTimerNode from './PeriodTimerNode.js';
import KeplersLawsTimeControlNode from './KeplersLawsTimeControlNode.js';
import Panel from '../../../../sun/js/Panel.js';
import TargetOrbitsComboBox from './TargetOrbitsComboBox.js';

// constants
const MARGIN = 10;

type SelfOptions = {
  allowLawSelection?: boolean;
};

export type KeplersLawsScreenViewOptions = SelfOptions & SolarSystemCommonScreenViewOptions;

class KeplersLawsScreenView extends SolarSystemCommonScreenView {
  private readonly periodTimerNode: PeriodTimerNode;

  private readonly keplersLawsControls: Node;
  private readonly firstLawPanel: Node;
  private readonly secondLawPanel: Node;
  private readonly thirdLawPanel: Node;
  private readonly lawsButtons?: Node;

  public constructor( model: KeplersLawsModel, providedOptions?: KeplersLawsScreenViewOptions ) {
    const options = optionize<KeplersLawsScreenViewOptions, SelfOptions, SolarSystemCommonScreenViewOptions>()( {
      playingAllowedProperty: model.engine.allowedOrbitProperty,
      allowLawSelection: false
    }, providedOptions );

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
      draggable: false,
      focusable: false
    } );
    const bodyNode = new BodyNode( body, this.modelViewTransformProperty, {
      useCueingArrows: true,
      showVelocityIndex: false,
      soundViewNode: this,
      valuesVisibleProperty: model.valuesVisibleProperty,
      dragVelocity: 150,
      shiftDragVelocity: 50,
      mapPosition: ( point, radius ) => {
        point = modelDragBoundsProperty.value.eroded( radius ).closestPointTo( point );

        const escapeRadius = model.engine.escapeRadiusProperty.value;

        if ( point.magnitude > escapeRadius ) {
          point = point.normalized().times( escapeRadius );
        }

        point = this.constrainBoundaryViewPoint( point, radius );

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
      enabledProperty: DerivedProperty.not( model.alwaysCircularProperty ),

      dragVelocity: 150,
      shiftDragVelocity: 50
    } ) );

    // Gravity force vectors
    this.componentsLayer.addChild( new VectorNode(
      body, this.modelViewTransformProperty, model.gravityVisibleProperty, body.forceProperty,
      new NumberProperty( -0.5 ), { fill: PhetColorScheme.GRAVITATIONAL_FORCE }
    ) );

    this.componentsLayer.addChild( new VectorNode(
      sun, this.modelViewTransformProperty, model.gravityVisibleProperty, sun.forceProperty,
      new NumberProperty( -0.5 ), { fill: PhetColorScheme.GRAVITATIONAL_FORCE }
    ) );

    const ellipticalOrbitNode = new EllipticalOrbitNode( model, this.modelViewTransformProperty );
    this.bottomLayer.addChild( ellipticalOrbitNode );
    this.bodiesLayer.addChild( ellipticalOrbitNode.topLayer );

    // UI ----------------------------------------------------------------------------------
    // Second and Third Law Accordion Boxes and Zoom Buttons

    this.topLayer.addChild( new OrbitalWarningMessage( model, this.modelViewTransformProperty ) );

    this.firstLawPanel = new FirstLawPanels( model );
    this.secondLawPanel = new SecondLawPanels( model );
    this.thirdLawPanel = new ThirdLawPanels( model );

    const lawsAndZoomBoxes = new AlignBox( new HBox( {
        children: [
          this.firstLawPanel,
          this.secondLawPanel,
          this.thirdLawPanel
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

    this.keplersLawsControls = new KeplersLawsControls( model, options.tandem.createTandem( 'controlPanel' ) );

    const targetOrbitsPanel = new Panel( new VBox( {
      spacing: 5,
      align: 'left',
      children: [
        new Text( 'Target Orbit:', SolarSystemCommonConstants.TEXT_OPTIONS ),
        new TargetOrbitsComboBox( model, this.topLayer, {
          layoutOptions: {
            align: 'center'
          }
        } )
      ]
    } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    const controlPanelAlignBox = new AlignBox(
      new VBox( {
        spacing: 5,
        align: 'left',
        children: [
          targetOrbitsPanel,
          this.keplersLawsControls
        ]
      } ),
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: MARGIN,
        xAlign: 'right',
        yAlign: 'top'
      }
    );

    this.periodTimerNode = new PeriodTimerNode( model.periodTracker.periodTimer, this.modelViewTransformProperty, this.layoutBounds, {
      dragBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: model.periodVisibleProperty,
      soundViewNode: this
    } );

    this.topLayer.addChild( this.periodTimerNode );

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

    const timeBox = new AlignBox( new KeplersLawsTimeControlNode( model,
      {
        enabledProperty: options.playingAllowedProperty || null,
        restartListener: () => model.restart(),
        stepForwardListener: () => model.stepOnce( 1 / 8 ),
        tandem: options.tandem.createTandem( 'timeControlNode' )
      } ), {
      alignBoundsProperty: this.availableBoundsProperty,
      margin: SolarSystemCommonConstants.MARGIN,
      xAlign: 'center',
      yAlign: 'bottom'
    } );


    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( lawsAndZoomBoxes );
    this.interfaceLayer.addChild( controlPanelAlignBox );
    if ( options.allowLawSelection ) {
      this.lawsButtons = new LawsButtons( model );

      this.interfaceLayer.addChild( new AlignBox( new HBox( {
          children: [
            this.lawsButtons
          ],
          spacing: 20
        } ),
        {
          alignBoundsProperty: this.availableBoundsProperty,
          margin: MARGIN,
          xAlign: 'left',
          yAlign: 'bottom'
        }
      ) );
    }
    this.interfaceLayer.addChild( timeBox );
    this.interfaceLayer.addChild( resetBox );
    this.bottomLayer.addChild( distancesDisplayBox );
  }

  public override getBodyBoundsItems(): BodyBoundsItem[] {
    return [
      ...super.getBodyBoundsItems(),
      // Top-left controls, all with individual scopes (all expanded top-left)
      ...[ this.firstLawPanel, this.secondLawPanel, this.thirdLawPanel ].map( ( node: Node ): BodyBoundsItem => {
        return {
          node: node,
          expandX: 'left',
          expandY: 'top'
        };
      } ),
      {
        node: this.keplersLawsControls,
        expandX: 'right',
        expandY: 'top'
      },
      ...( this.lawsButtons ? [
        {
          node: this.lawsButtons,
          expandX: 'left' as const,
          expandY: 'bottom' as const
        }
      ] : [] )
    ];
  }
}

keplersLaws.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;