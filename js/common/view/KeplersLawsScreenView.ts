// Copyright 2023, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import { AlignBox, HBox, Node } from '../../../../scenery/js/imports.js';
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
import TargetOrbitNode from './TargetOrbitNode.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Success_mp3 from '../../../sounds/Success_mp3.js';
import BodiesCollide_mp3 from '../../../sounds/BodiesCollide_mp3.js';
import ObjectWillEscape_mp3 from '../../../sounds/ObjectWillEscape_mp3.js';
import OrbitTypes from '../model/OrbitTypes.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

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

  private readonly playBodySounds: () => void;

  public constructor( model: KeplersLawsModel, providedOptions?: KeplersLawsScreenViewOptions ) {
    const options = optionize<KeplersLawsScreenViewOptions, SelfOptions, SolarSystemCommonScreenViewOptions>()( {
      playingAllowedProperty: model.engine.allowedOrbitProperty,
      allowLawSelection: false,
      isDisposable: false
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
      focusable: false,
      pickable: false
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

    this.playBodySounds = () => {
      if ( this.model.isPlayingProperty.value ) {
        bodyNode.playSound();
      }
      else {
        bodyNode.stopSound();
      }
    };

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

    // Target orbit node
    const targetOrbitNode = new TargetOrbitNode(
      model.targetOrbitProperty,
      this.modelViewTransformProperty,
      {
        visibleProperty: new DerivedProperty( [ model.isSolarSystemProperty, model.isSecondLawProperty ],
          ( isSolarSystem, isSecondLaw ) => isSolarSystem && !isSecondLaw )
      } );
    this.bottomLayer.addChild( targetOrbitNode );

    const ellipticalOrbitNode = new EllipticalOrbitNode( model, this.modelViewTransformProperty );
    this.bottomLayer.addChild( ellipticalOrbitNode );
    this.bodiesLayer.addChild( ellipticalOrbitNode.topLayer );

    // Sound ----------------------------------------------------------------------------------
    const crashSound = new SoundClip( BodiesCollide_mp3 );
    const escapeSound = new SoundClip( ObjectWillEscape_mp3 );
    const correctPowersSound = new SoundClip( Success_mp3 );
    soundManager.addSoundGenerator( crashSound );
    soundManager.addSoundGenerator( escapeSound );
    soundManager.addSoundGenerator( correctPowersSound );

    model.correctPowersSelectedProperty.lazyLink( correct => {
      if ( correct ) {
        correctPowersSound.play();
      }
    } );
    model.engine.orbitTypeProperty.lazyLink( orbitType => {
      if ( orbitType === OrbitTypes.CRASH_ORBIT ) {
        crashSound.play();
      }
      else if ( orbitType === OrbitTypes.ESCAPE_ORBIT ) {
        escapeSound.play();
      }
    } );

    // UI ----------------------------------------------------------------------------------
    // Second and Third Law Accordion Boxes and Zoom Buttons

    this.topLayer.addChild( new OrbitalWarningMessage( model.engine.orbitTypeProperty, model.engine.allowedOrbitProperty, this.modelViewTransformProperty ) );

    this.firstLawPanel = new FirstLawPanels( model );
    this.secondLawPanel = new SecondLawPanels( model );
    this.thirdLawPanel = new ThirdLawPanels( model );

    const lawsPanelsBox = new AlignBox( new HBox( {
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

    // Temporarily set the selected law to the first one, so that the first law panel defines the height of the controls
    this.keplersLawsControls = new KeplersLawsControls( model, this.topLayer, options.tandem.createTandem( 'controlPanel' ) );

    const zoomButtons = new MagnifyingGlassZoomButtonGroup(
      model.zoomLevelProperty,
      {
        orientation: 'horizontal',
        spacing: 5,
        magnifyingGlassNodeOptions: {
          glassRadius: 8
        },
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      } );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    const topRightAlignBox = new AlignBox(
      new HBox( {
        spacing: 10,
        align: 'top',
        children: [
          zoomButtons,
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

    const timeControlsNode = new KeplersLawsTimeControlNode( model,
      {
        enabledProperty: options.playingAllowedProperty || null,
        restartListener: () => model.restart(),
        stepForwardListener: () => model.stepOnce( 1 / 8 ),
        tandem: options.tandem.createTandem( 'timeControlNode' )
      } );
    const timeBox = new AlignBox( timeControlsNode, {
      alignBoundsProperty: this.availableBoundsProperty,
      margin: SolarSystemCommonConstants.MARGIN,
      xAlign: 'center',
      yAlign: 'bottom'
    } );

    model.stopwatch.positionProperty.value = timeControlsNode.center.plusXY( timeControlsNode.width / 2 + 20, -40 );
    const stopwatchNode = new StopwatchNode(
      model.stopwatch, {
        dragBoundsProperty: this.visibleBoundsProperty,
        visibleProperty: model.stopwatchVisibleProperty,
        numberDisplayOptions: {
          numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
            showAsMinutesAndSeconds: false,
            numberOfDecimalPlaces: 2,
            units: KeplersLawsStrings.units.yearsStringProperty
          } )
        }
      }
    );
    this.topLayer.addChild( stopwatchNode );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( lawsPanelsBox );
    this.interfaceLayer.addChild( topRightAlignBox );
    if ( options.allowLawSelection ) {
      this.lawsButtons = new LawsButtons( model.selectedLawProperty );

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

  public override step( dt: number ): void {
    super.step( dt );
    this.playBodySounds();
  }
}

keplersLaws.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;