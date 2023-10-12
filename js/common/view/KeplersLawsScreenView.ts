// Copyright 2023, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import { AlignBox, HBox, KeyboardDragListenerOptions, Node, Text } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsPanels from './KeplersLawsPanels.js';
import SecondLawPanels from './SecondLawPanels.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import ThirdLawPanels from './ThirdLawPanels.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonScreenView, { BodyBoundsItem, SolarSystemCommonScreenViewOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
import LawsRadioButtonGroup from './LawsRadioButtonGroup.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import FirstLawPanels from './FirstLawPanels.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import OrbitalWarningMessage from './OrbitalWarningMessage.js';
import DistancesDisplayNode from './DistancesDisplayNode.js';
import keplersLaws from '../../keplersLaws.js';
import PeriodTimerNode from './PeriodTimerNode.js';
import TargetOrbitNode from './TargetOrbitNode.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Success_mp3 from '../../../sounds/Success_mp3.js';
import BodiesCollide_mp3 from '../../../sounds/BodiesCollide_mp3.js';
import ObjectWillEscape_mp3 from '../../../sounds/ObjectWillEscape_mp3.js';
import Grab_Sound_mp3 from '../../../../solar-system-common/sounds/Grab_Sound_mp3.js';
import Release_Sound_mp3 from '../../../../solar-system-common/sounds/Release_Sound_mp3.js';
import OrbitTypes from '../model/OrbitTypes.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SolarSystemCommonTimeControlNode from '../../../../solar-system-common/js/view/SolarSystemCommonTimeControlNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import KeplersLawsVisibleProperties from './KeplersLawsVisibleProperties.js';
import DraggableVelocityVectorNode from '../../../../solar-system-common/js/view/DraggableVelocityVectorNode.js';

// constants
const MARGIN = 10;

type SelfOptions = {
  allowLawSelection?: boolean;
};

export type KeplersLawsScreenViewOptions = SelfOptions & StrictOmit<SolarSystemCommonScreenViewOptions, 'playingAllowedProperty'>;

class KeplersLawsScreenView extends SolarSystemCommonScreenView<KeplersLawsVisibleProperties> {
  private readonly periodTimerNode: PeriodTimerNode;

  private readonly keplersLawsPanels: Node;
  private readonly firstLawPanels: Node;
  private readonly secondLawPanels: Node;
  private readonly thirdLawPanels: Node;
  private readonly lawsButtons?: Node;

  private readonly playBodySounds: () => void;

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {

    const options = optionize<KeplersLawsScreenViewOptions, SelfOptions, SolarSystemCommonScreenViewOptions>()( {
      playingAllowedProperty: model.engine.allowedOrbitProperty,
      allowLawSelection: false,
      isDisposable: false
    }, providedOptions );

    super( model, new KeplersLawsVisibleProperties( options.tandem.createTandem( 'visibleProperties' ) ), options );

    model.engine.orbitalAreas.forEach( ( area, index ) => {
      area.insideProperty.link( inside => {
        if ( inside && model.isPlayingProperty.value && model.isSecondLawProperty.value && !model.engine.areasErased ) {
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

    const sun = model.sun;
    const planet = model.planet;
    const sunNode = new BodyNode( model.sun, this.modelViewTransformProperty, {
      draggable: false,
      focusable: false,
      pickable: false
    } );
    const planetNode = new BodyNode( planet, this.modelViewTransformProperty, {
      useCueingArrows: true,
      showVelocityIndex: false,
      soundViewNode: this,
      speedVisibleProperty: this.visibleProperties.speedVisibleProperty,
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
    this.bodiesLayer.addChild( planetNode );

    this.playBodySounds = () => {
      if ( this.model.isPlayingProperty.value ) {
        planetNode.playSound();
      }
      else {
        planetNode.stopSound();
      }
    };

    this.visibleProperties.stopwatchVisibleProperty.link( visible => {
      model.stopwatch.setTime( 0 );
      model.stopwatch.isRunningProperty.value = false;
    } );

    this.visibleProperties.periodVisibleProperty.link( visible => {
      model.periodTracker.timerReset();
    } );

    model.selectedLawProperty.link( law => {
      this.visibleProperties.saveAndDisableVisibilityState( model.lastLaw );
      this.visibleProperties.resetVisibilityState( law );
      model.lastLaw = law;
      model.lawUpdatedEmitter.emit();
    } );

    // Draggable velocity vector
    const draggableVelocityVectorNode = new DraggableVelocityVectorNode(
      planet,
      this.modelViewTransformProperty,
      this.visibleProperties.velocityVisibleProperty, {
        minimumMagnitude: 30,
        snapToZero: false,
        maxMagnitudeProperty: model.engine.escapeSpeedProperty,
        enabledProperty: DerivedProperty.not( model.alwaysCircularProperty ),
        dragVelocity: 150,
        shiftDragVelocity: 50,
        mapPosition: this.constrainBoundaryViewPoint.bind( this ),
        soundViewNode: this
      } );
    this.componentsLayer.addChild( draggableVelocityVectorNode );

    // Gravity force vectors
    this.componentsLayer.addChild( new VectorNode(
      planet, this.modelViewTransformProperty, this.visibleProperties.gravityVisibleProperty, planet.forceProperty,
      model.forceScaleProperty, { fill: SolarSystemCommonColors.gravityColorProperty, baseMagnitude: 1000 }
    ) );

    this.componentsLayer.addChild( new VectorNode(
      sun, this.modelViewTransformProperty, this.visibleProperties.gravityVisibleProperty, sun.forceProperty,
      model.forceScaleProperty, { fill: SolarSystemCommonColors.gravityColorProperty, baseMagnitude: 1000 }
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

    const ellipticalOrbitNode = new EllipticalOrbitNode( model, this.visibleProperties, this.modelViewTransformProperty );
    this.bottomLayer.addChild( ellipticalOrbitNode );
    this.bodiesLayer.addChild( ellipticalOrbitNode.topLayer );

    this.visibleProperties.velocityVisibleProperty.value = true;
    this.visibleProperties.velocityVisibleProperty.setInitialValue( true );

    // Sound ----------------------------------------------------------------------------------
    const crashSound = new SoundClip( BodiesCollide_mp3, { initialOutputLevel: 2 * SolarSystemCommonConstants.DEFAULT_SOUND_OUTPUT_LEVEL } );
    const escapeSound = new SoundClip( ObjectWillEscape_mp3, { initialOutputLevel: 2 * SolarSystemCommonConstants.DEFAULT_SOUND_OUTPUT_LEVEL } );
    const correctPowersSound = new SoundClip( Success_mp3, { initialOutputLevel: 2 * SolarSystemCommonConstants.DEFAULT_SOUND_OUTPUT_LEVEL } );
    soundManager.addSoundGenerator( crashSound );
    soundManager.addSoundGenerator( escapeSound );
    soundManager.addSoundGenerator( correctPowersSound );

    model.correctPowersSelectedProperty.lazyLink( correct => {
      if ( correct ) {
        correctPowersSound.play();
      }
    } );

    let previousOrbitType: OrbitTypes = OrbitTypes.STABLE_ORBIT;
    model.engine.orbitTypeProperty.lazyLink( orbitType => {
      if ( previousOrbitType === OrbitTypes.STABLE_ORBIT ) {
        if ( orbitType === OrbitTypes.CRASH_ORBIT ) {
          crashSound.play();
        }
        else if ( orbitType === OrbitTypes.ESCAPE_ORBIT ) {
          escapeSound.play();
        }
      }

      previousOrbitType = orbitType;
    } );

    // UI ----------------------------------------------------------------------------------
    // Second and Third Law Accordion Boxes and Zoom Buttons

    this.topLayer.addChild( new OrbitalWarningMessage( model.engine.orbitTypeProperty, model.engine.allowedOrbitProperty, this.modelViewTransformProperty ) );

    this.firstLawPanels = new FirstLawPanels( model, this.visibleProperties.semiaxesVisibleProperty, this.visibleProperties.eccentricityVisibleProperty, options.tandem.createTandem( 'firstLawPanels' ) );
    this.secondLawPanels = new SecondLawPanels( model, this.visibleProperties, options.tandem.createTandem( 'secondLawPanels' ) );
    this.thirdLawPanels = new ThirdLawPanels( model, this.visibleProperties.thirdLawAccordionBoxExpandedProperty, options.tandem.createTandem( 'thirdLawPanels' ) );

    const lawsPanelsBox = new AlignBox( new HBox( {
        children: [
          this.firstLawPanels,
          this.secondLawPanels,
          this.thirdLawPanels
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
    this.keplersLawsPanels = new KeplersLawsPanels( model, this.visibleProperties, this.topLayer, options.tandem.createTandem( 'keplersLawsPanels' ) );

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
          this.keplersLawsPanels
        ]
      } ),
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: MARGIN,
        xAlign: 'right',
        yAlign: 'top'
      }
    );

    const offScaleMessage = new Text( SolarSystemCommonStrings.offscaleMessageStringProperty, {
      font: new PhetFont( 16 ),
      fill: SolarSystemCommonColors.foregroundProperty,
      visibleProperty: DerivedProperty.and( [ this.visibleProperties.gravityVisibleProperty, model.isAnyForceOffscaleProperty ] ),
      maxWidth: 400
    } );
    offScaleMessage.boundsProperty.link( bounds => {
      offScaleMessage.centerX = this.layoutBounds.centerX;
      offScaleMessage.top = this.layoutBounds.top + SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN;
    } );
    this.topLayer.addChild( offScaleMessage );

    this.periodTimerNode = new PeriodTimerNode( model.periodTracker.periodTimer, this.modelViewTransformProperty, this.layoutBounds, {
      dragBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: this.visibleProperties.periodVisibleProperty,
      soundViewNode: this
    } );

    this.topLayer.addChild( this.periodTimerNode );

    const distancesDisplayBox = new AlignBox( new DistancesDisplayNode( model, this.visibleProperties, this.modelViewTransformProperty ), {
      alignBoundsProperty: this.availableBoundsProperty,
      margin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'center',
      yAlign: 'top'
    } );

    const timeControlNode = new SolarSystemCommonTimeControlNode( model, {
      enabledProperty: options.playingAllowedProperty || null,
      restartListener: () => model.restart(),
      stepForwardListener: () => model.stepOnce( 1 / 8 ),
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );
    timeControlNode.boundsProperty.link( bounds => {
      timeControlNode.centerX = this.layoutBounds.centerX;
      timeControlNode.bottom = this.layoutBounds.bottom - SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    const stopwatchGrabClip = new SoundClip( Grab_Sound_mp3 );
    const stopwatchReleaseClip = new SoundClip( Release_Sound_mp3 );

    soundManager.addSoundGenerator( stopwatchGrabClip, {
      associatedViewNode: this
    } );
    soundManager.addSoundGenerator( stopwatchReleaseClip, {
      associatedViewNode: this
    } );

    const dragClipsOptions = {
      start: () => {
        stopwatchGrabClip.play();
      },
      end: () => {
        stopwatchReleaseClip.play();
      }
    };

    model.stopwatch.positionProperty.setInitialValue( new Vector2( this.resetAllButton.left - 200, timeControlNode.bottom - 75 ) );
    model.stopwatch.positionProperty.reset();
    const stopwatchNode = new StopwatchNode(
      model.stopwatch, {
        dragBoundsProperty: this.visibleBoundsProperty,
        visibleProperty: this.visibleProperties.stopwatchVisibleProperty,
        dragListenerOptions: dragClipsOptions,
        keyboardDragListenerOptions: combineOptions<KeyboardDragListenerOptions>( {
          dragVelocity: 450,
          shiftDragVelocity: 100
        }, dragClipsOptions ),
        resetButtonSoundPlayer: stopwatchReleaseClip,
        numberDisplayOptions: {
          numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
            showAsMinutesAndSeconds: false,
            numberOfDecimalPlaces: 2,
            valueUnitsPattern: KeplersLawsStrings.pattern.valueUnitsStringProperty,
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
      this.lawsButtons = new LawsRadioButtonGroup( model.selectedLawProperty );
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
    this.interfaceLayer.addChild( timeControlNode );
    this.interfaceLayer.addChild( this.resetAllButton );
    this.bottomLayer.addChild( distancesDisplayBox );


    this.pdomPlayAreaNode.pdomOrder = [
      planetNode,
      draggableVelocityVectorNode,
      this.periodTimerNode,
      this.measuringTapeNode,
      stopwatchNode
    ]; // decouple traversal order from rendering order


    this.pdomControlAreaNode.pdomOrder = [
      this.lawsButtons ? this.lawsButtons : null,
      this.keplersLawsPanels,
      this.firstLawPanels,
      this.secondLawPanels,
      this.thirdLawPanels,
      timeControlNode,
      zoomButtons,
      this.resetAllButton
    ]; // decouple traversal order from rendering order
  }

  public override getBodyBoundsItems(): BodyBoundsItem[] {
    return [
      ...super.getBodyBoundsItems(),
      // Top-left controls, all with individual scopes (all expanded top-left)
      ...[ this.firstLawPanels, this.secondLawPanels, this.thirdLawPanels ].map( ( node: Node ): BodyBoundsItem => {
        return {
          node: node,
          expandX: 'left',
          expandY: 'top'
        };
      } ),
      {
        node: this.keplersLawsPanels,
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

  public override reset(): void {
    super.reset();
    this.visibleProperties.hardVisibilityReset();
  }
}

keplersLaws.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;