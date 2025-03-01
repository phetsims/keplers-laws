// Copyright 2023-2025, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import DraggableVelocityVectorNode from '../../../../solar-system-common/js/view/DraggableVelocityVectorNode.js';
import SolarSystemCommonScreenView, { DragBoundsItem, SolarSystemCommonScreenViewOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
import SolarSystemCommonTimeControlNode from '../../../../solar-system-common/js/view/SolarSystemCommonTimeControlNode.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BodiesCollide_mp3 from '../../../sounds/BodiesCollide_mp3.js';
import ObjectWillEscape_mp3 from '../../../sounds/ObjectWillEscape_mp3.js';
import Success_mp3 from '../../../sounds/Success_mp3.js';
import keplersLaws from '../../keplersLaws.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import OrbitTypes from '../model/OrbitTypes.js';
import DistancesDisplayNode from './DistancesDisplayNode.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import FirstLawPanels from './FirstLawPanels.js';
import KeplersLawsPanels from './KeplersLawsPanels.js';
import KeplersLawsVisibleProperties from './KeplersLawsVisibleProperties.js';
import LawsRadioButtonGroup from './LawsRadioButtonGroup.js';
import MetronomeSoundManager from './MetronomeSoundManager.js';
import OrbitalWarningMessage from './OrbitalWarningMessage.js';
import PeriodTimerNode from './PeriodTimerNode.js';
import SecondLawPanels from './SecondLawPanels.js';
import TargetOrbitNode from './TargetOrbitNode.js';
import ThirdLawPanels from './ThirdLawPanels.js';

// constants
const MARGIN = 10;

type SelfOptions = {
  allowLawSelection?: boolean;
};

export type KeplersLawsScreenViewOptions = SelfOptions & StrictOmit<SolarSystemCommonScreenViewOptions, 'playingAllowedProperty'>;

class KeplersLawsScreenView extends SolarSystemCommonScreenView<KeplersLawsVisibleProperties> {
  private readonly periodTimerNode: PeriodTimerNode;

  private readonly rightPanels: Node;
  private readonly firstLawPanels: Node;
  private readonly secondLawPanels: Node;
  private readonly thirdLawPanels: Node;
  private readonly lawsRadioButtonGroup?: Node;

  private readonly userHasInteractedProperty: BooleanProperty;

  private readonly playBodySounds: () => void;

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {

    const options = optionize<KeplersLawsScreenViewOptions, SelfOptions, SolarSystemCommonScreenViewOptions>()( {
      playingAllowedProperty: model.engine.allowedOrbitProperty,
      allowLawSelection: false,
      isDisposable: false
    }, providedOptions );

    super( model, new KeplersLawsVisibleProperties( model.isAllLaws, model.selectedLawProperty.value, options.tandem.createTandem( 'visibleProperties' ) ), options );

    const metronomeSoundManager = new MetronomeSoundManager();

    model.engine.orbitalAreas.forEach( ( area, index ) => {
      area.insideProperty.link( inside => {
        if ( inside && model.isPlayingProperty.value && model.isSecondLawProperty.value && !model.engine.areasErased ) {
          const soundIndex = model.engine.retrograde ? model.periodDivisionsProperty.value - index - 1 : index;
          metronomeSoundManager.playOrbitalMetronome( soundIndex, model.engine.a, model.periodDivisionsProperty.value );
        }
      } );
    } );

    const sun = model.sun;
    const planet = model.planet;

    const orbitalSystemNodesTandem = options.tandem.createTandem( 'orbitalSystemNodes' );

    // BodyNode for each Body
    const sunNode = new BodyNode( sun, this.modelViewTransformProperty, {
      draggable: false,
      focusable: false,
      pickable: false,
      tandem: orbitalSystemNodesTandem.createTandem( 'sunNode' ),
      phetioInputEnabledPropertyInstrumented: false
    } );
    this.bodiesLayer.addChild( sunNode );

    this.userHasInteractedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'userHasInteractedProperty' )
    } );

    model.isPlayingProperty.link( isPlaying => {
      if ( isPlaying ) {
        this.userHasInteractedProperty.value = true;
      }
    } );
    model.userInteractingEmitter.addListener( () => {
      this.userHasInteractedProperty.value = true;
    } );

    const planetNode = new BodyNode( planet, this.modelViewTransformProperty, {
      cueingArrowsVisibleProperty: DerivedProperty.not( this.userHasInteractedProperty ),
      showVelocityIndex: false,
      soundViewNode: this,
      speedVisibleProperty: this.visibleProperties.speedVisibleProperty,
      dragSpeed: 150,
      shiftDragSpeed: 50,
      mapPosition: ( point, radius ) => {
        const escapeRadius = model.engine.escapeRadiusProperty.value;
        if ( point.magnitude > escapeRadius ) {
          point = point.normalized().times( escapeRadius );
        }
        point = this.constrainDragPoint( point, radius );
        return point;
      },
      tandem: orbitalSystemNodesTandem.createTandem( 'planetNode' )
    } );
    this.bodiesLayer.addChild( planetNode );

    // Draggable velocity vector for the planet
    const planetVelocityVectorNode = new DraggableVelocityVectorNode( planet, this.modelViewTransformProperty, {
      visibleProperty: this.visibleProperties.velocityVisibleProperty,
      minimumMagnitude: 1.055,
      snapToZero: false,
      maxMagnitudeProperty: model.engine.escapeSpeedProperty,
      isVelocityInteractiveProperty: DerivedProperty.not( model.alwaysCircularProperty ),
      dragSpeed: 200,
      shiftDragSpeed: 70,
      mapPosition: this.constrainDragPoint.bind( this ),
      soundViewNode: this,
      tandem: orbitalSystemNodesTandem.createTandem( 'planetVelocityVectorNode' )
    } );
    this.componentsLayer.addChild( planetVelocityVectorNode );

    // Gravity force vectors
    const sunGravityForceVectorNode = new VectorNode( sun, this.modelViewTransformProperty, sun.gravityForceProperty, model.gravityForceScalePowerProperty, {
      visibleProperty: this.visibleProperties.gravityVisibleProperty,
      fill: SolarSystemCommonColors.gravityColorProperty,
      scalingOffset: KeplersLawsConstants.INITIAL_VECTOR_OFFSCALE
      // tandem: Do not instrument, nothing interesting here.
    } );
    this.componentsLayer.addChild( sunGravityForceVectorNode );

    const planetGravityForceVectorNode = new VectorNode( planet, this.modelViewTransformProperty, planet.gravityForceProperty, model.gravityForceScalePowerProperty, {
      visibleProperty: this.visibleProperties.gravityVisibleProperty,
      fill: SolarSystemCommonColors.gravityColorProperty,
      scalingOffset: KeplersLawsConstants.INITIAL_VECTOR_OFFSCALE
      // tandem: Do not instrument, nothing interesting here.
    } );
    this.componentsLayer.addChild( planetGravityForceVectorNode );

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

    this.visibleProperties.velocityVisibleProperty.value = true;
    this.visibleProperties.velocityVisibleProperty.setInitialValue( true );

    // Sound ----------------------------------------------------------------------------------

    this.playBodySounds = () => {
      if ( this.model.isPlayingProperty.value ) {
        planetNode.playSound();
      }
      else {
        planetNode.stopSound();
      }
    };

    const crashSound = new SoundClip( BodiesCollide_mp3, { initialOutputLevel: SolarSystemCommonConstants.DEFAULT_SOUND_OUTPUT_LEVEL } );
    const escapeSound = new SoundClip( ObjectWillEscape_mp3, { initialOutputLevel: SolarSystemCommonConstants.DEFAULT_SOUND_OUTPUT_LEVEL } );
    const correctPowersSound = new SoundClip( Success_mp3, { initialOutputLevel: SolarSystemCommonConstants.DEFAULT_SOUND_OUTPUT_LEVEL } );
    soundManager.addSoundGenerator( crashSound );
    soundManager.addSoundGenerator( escapeSound );
    soundManager.addSoundGenerator( correctPowersSound );

    model.correctPowersSelectedProperty.lazyLink( correct => {
      if ( correct ) {
        correctPowersSound.play();
      }
    } );

    model.engine.orbitTypeProperty.lazyLink( ( orbitType, previousOrbitType ) => {
      if ( previousOrbitType === OrbitTypes.STABLE_ORBIT && !model.restarting ) {
        if ( orbitType === OrbitTypes.CRASH_ORBIT ) {
          crashSound.play();
        }
        else if ( orbitType === OrbitTypes.ESCAPE_ORBIT ) {
          escapeSound.play();
        }
      }
    } );

    // UI ----------------------------------------------------------------------------------
    // Second and Third Law Accordion Boxes and Zoom Buttons

    this.topLayer.addChild( new OrbitalWarningMessage( model.engine.orbitTypeProperty, model.engine.allowedOrbitProperty, this.modelViewTransformProperty ) );

    // Group all panels under this tandem
    const panelsTandem = options.tandem.createTandem( 'panels' );

    this.firstLawPanels = new FirstLawPanels(
      model,
      this.visibleProperties.semiaxesVisibleProperty,
      this.visibleProperties.eccentricityVisibleProperty,
      model.hasFirstLawFeatures ? panelsTandem.createTandem( 'firstLawPanels' ) : Tandem.OPT_OUT
    );
    this.secondLawPanels = new SecondLawPanels(
      model,
      this.visibleProperties,
      model.hasSecondLawFeatures ? panelsTandem.createTandem( 'secondLawPanels' ) : Tandem.OPT_OUT
    );
    this.thirdLawPanels = new ThirdLawPanels(
      model,
      this.visibleProperties.thirdLawAccordionBoxExpandedProperty,
      model.hasThirdLawFeatures ? panelsTandem.createTandem( 'thirdLawPanels' ) : Tandem.OPT_OUT
    );

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
        alignBoundsProperty: this.interfaceBoundsProperty,
        margin: MARGIN,
        xAlign: 'left',
        yAlign: 'top'
      }
    );

    // Temporarily set the selected law to the first one, so that the first law panel defines the height of the controls
    this.rightPanels = new KeplersLawsPanels( model, this.visibleProperties, this.topLayer, panelsTandem.createTandem( 'rightPanels' ) );

    const zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( model.zoomLevelProperty, {
      orientation: 'horizontal',
      spacing: 5,
      magnifyingGlassNodeOptions: {
        glassRadius: 8
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      tandem: options.tandem.createTandem( 'zoomButtonGroup' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    const topRightAlignBox = new AlignBox(
      new HBox( {
        spacing: 10,
        align: 'top',
        children: [
          zoomButtonGroup,
          this.rightPanels
        ]
      } ),
      {
        alignBoundsProperty: this.interfaceBoundsProperty,
        margin: MARGIN,
        xAlign: 'right',
        yAlign: 'top'
      }
    );

    const offScaleMessage = new Text( SolarSystemCommonStrings.offscaleMessageStringProperty, {
      font: new PhetFont( 16 ),
      fill: SolarSystemCommonColors.foregroundProperty,
      visibleProperty: DerivedProperty.and( [ this.visibleProperties.gravityVisibleProperty, model.isAnyGravityForceOffscaleProperty ] ),
      maxWidth: 400
    } );
    offScaleMessage.boundsProperty.link( bounds => {
      offScaleMessage.centerX = this.layoutBounds.centerX;
      offScaleMessage.top = this.layoutBounds.top + SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN;
    } );
    this.topLayer.addChild( offScaleMessage );

    this.periodTimerNode = new PeriodTimerNode( model.periodTracker.periodStopwatch, this.layoutBounds, {
      dragBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: this.visibleProperties.periodVisibleProperty,
      soundViewNode: this,
      tandem: model.hasThirdLawFeatures ? options.tandem.createTandem( 'periodTimerNode' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.topLayer.addChild( this.periodTimerNode );

    const distancesDisplayBox = new AlignBox( new DistancesDisplayNode( model, this.visibleProperties, this.modelViewTransformProperty ), {
      alignBoundsProperty: this.interfaceBoundsProperty,
      margin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'center',
      yAlign: 'top'
    } );

    const timeControlNode = new SolarSystemCommonTimeControlNode( model, {
      enabledProperty: options.playingAllowedProperty || null,
      restartListener: () => model.restart(),
      stepForwardListener: () => model.stepOnce( 1 / 8, true ),
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      flowBoxAlign: 'center',
      flowBoxSpacing: 20,
      speedRadioButtonGroupPlacement: 'right'
    } );
    timeControlNode.boundsProperty.link( bounds => {
      timeControlNode.centerX = this.layoutBounds.centerX;
      timeControlNode.bottom = this.layoutBounds.bottom - SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    model.stopwatch.positionProperty.setInitialValue( new Vector2( this.resetAllButton.left - 200, timeControlNode.bottom - 75 ) );
    model.stopwatch.positionProperty.reset();
    const stopwatchNode = new StopwatchNode(
      model.stopwatch, {
        dragBoundsProperty: this.visibleBoundsProperty,
        visibleProperty: this.visibleProperties.stopwatchVisibleProperty,
        keyboardDragListenerOptions: {
          dragSpeed: 450,
          shiftDragSpeed: 100
        },
        numberDisplayOptions: {
          numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
            showAsMinutesAndSeconds: false,
            numberOfDecimalPlaces: 2,
            valueUnitsPattern: KeplersLawsStrings.pattern.valueUnitsStringProperty,
            units: KeplersLawsStrings.units.yearsStringProperty
          } ),
          numberFormatterDependencies: [
            KeplersLawsStrings.units.yearsStringProperty,
            KeplersLawsStrings.pattern.valueUnitsStringProperty
          ]
        },
        tandem: options.tandem.createTandem( 'stopwatchNode' )
      }
    );
    this.topLayer.addChild( stopwatchNode );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( lawsPanelsBox );
    this.interfaceLayer.addChild( topRightAlignBox );
    if ( options.allowLawSelection ) {
      this.lawsRadioButtonGroup = new LawsRadioButtonGroup( model.selectedLawProperty, options.tandem.createTandem( 'lawsRadioButtonGroup' ) );
      this.interfaceLayer.addChild( new AlignBox( new HBox( {
          children: [
            this.lawsRadioButtonGroup
          ],
          spacing: 20
        } ),
        {
          alignBoundsProperty: this.interfaceBoundsProperty,
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
      planetVelocityVectorNode,
      this.periodTimerNode,
      this.measuringTapeNode,
      stopwatchNode
    ]; // decouple traversal order from rendering order


    this.pdomControlAreaNode.pdomOrder = [
      this.lawsRadioButtonGroup ? this.lawsRadioButtonGroup : null,
      this.rightPanels,
      this.firstLawPanels,
      this.secondLawPanels,
      this.thirdLawPanels,
      timeControlNode,
      zoomButtonGroup,
      this.resetAllButton
    ]; // decouple traversal order from rendering order
  }

  public override getDragBoundsItems(): DragBoundsItem[] {
    return [
      ...super.getDragBoundsItems(),
      {
        node: this.rightPanels,
        expandX: 'right',
        expandY: 'top'
      },

      // All of these Nodes are aligned at left-top
      ...[ this.firstLawPanels, this.secondLawPanels, this.thirdLawPanels ].map( ( node: Node ): DragBoundsItem => {
        return {
          node: node,
          expandX: 'left',
          expandY: 'top'
        };
      } ),

      // This Node is optional
      ...( this.lawsRadioButtonGroup ? [
        {
          node: this.lawsRadioButtonGroup,
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
    this.userHasInteractedProperty.reset();
  }
}

keplersLaws.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;