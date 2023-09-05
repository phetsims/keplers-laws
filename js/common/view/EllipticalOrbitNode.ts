// Copyright 2023, University of Colorado Boulder
/**
 * Visual Node for the Elliptical Orbit based on the Orbital Parameters
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import { Circle, Node, Path, RichText, Text, TextOptions } from '../../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';
import keplersLaws from '../../keplersLaws.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import KeplersLawsConstants from '../KeplersLawsConstants.js';
import PeriodTrackerNode from './PeriodTrackerNode.js';
import OrbitalSound from './OrbitalSound.js';
import KeplersLawsColors from '../KeplersLawsColors.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

export default class EllipticalOrbitNode extends Path {
  private readonly orbit: EllipticalOrbitEngine; // Kepler's Laws uses EllipticalOrbitEngine instead of a NumericalOrbitEngine, as My Solar System does

  // This layer is displayed on top of everything inside the EllipticalOrbitNode, but keeps the same transformations.
  public readonly topLayer: Node;

  public constructor(
    model: KeplersLawsModel,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>
  ) {

    // Passing in a null shape, since it will be updated later
    super( null, {
      lineWidth: 3,
      stroke: SolarSystemCommonColors.orbitColorProperty
    } );

    this.orbit = model.engine;

    const orbitalSound = new OrbitalSound( this.orbit.semiMajorAxisProperty, this.orbit.eccentricityProperty );

    Multilink.multilink( [ this.orbit.allowedOrbitProperty, this.orbit.updateAllowedProperty ],
      ( orbitAllowed, updateAllowed ) => {
        if ( orbitAllowed && updateAllowed ) {
          orbitalSound.playOrbitalSound();
        }
        else {
          orbitalSound.stopOrbitalSound();
        }
      } );

    // Top layer is a field because it has to be accessed from the ScreenView and added as a child there
    this.topLayer = new Node( { visibleProperty: this.orbit.allowedOrbitProperty } );
    const labelsLayer = new Node( { visibleProperty: this.orbit.allowedOrbitProperty } );
    const firstLawLayer = new Node( { visibleProperty: this.orbit.allowedOrbitProperty } );
    const secondLawLayer = new Node( { visibleProperty: this.orbit.allowedOrbitProperty } );
    const thirdLawLayer = new Node( { visibleProperty: this.orbit.allowedOrbitProperty } );

    // Also Top Layer is not added as child because it's a child of the ScreenView, just controlled in here
    this.addChild( labelsLayer );
    this.addChild( firstLawLayer );
    this.addChild( secondLawLayer );
    this.addChild( thirdLawLayer );

    // This is because the semiMajorAxis can be toggled by multiple cases
    const semiMajorAxisVisibleProperty = new DerivedProperty(
      [ model.isThirdLawProperty, model.semiaxisVisibleProperty, model.semiMajorAxisVisibleProperty, model.eccentricityVisibleProperty ],
      ( isThirdLaw, semiaxisVisible, semiMajorAxisVisible, eccentricityVisible ) => {
        return ( isThirdLaw && semiMajorAxisVisible ) || semiaxisVisible || eccentricityVisible;
      }
    );

    // Text Nodes
    const aLabelNode = new Text( KeplersLawsStrings.symbols.aStringProperty,
      combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        visibleProperty: semiMajorAxisVisibleProperty,
        scale: 1.5,
        fill: KeplersLawsColors.semiMajorAxisColorProperty,
        maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
      } ) );
    const bLabelNode = new Text( KeplersLawsStrings.symbols.bStringProperty,
      combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        visibleProperty: model.semiaxisVisibleProperty,
        scale: 1.5,
        fill: KeplersLawsColors.semiMinorAxisColorProperty,
        maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
      } ) );
    const cLabelNode = new Text( KeplersLawsStrings.symbols.cStringProperty,
      combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        visibleProperty: new DerivedProperty( [ model.eccentricityVisibleProperty, model.engine.eccentricityProperty ],
          ( visible, e ) => visible && ( e > 0 ) ),
        scale: 1.5,
        fill: KeplersLawsColors.focalDistanceColorProperty,
        maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
      } ) );

    const stringLabelOptions = combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
      visibleProperty: new DerivedProperty( [ model.stringVisibleProperty, model.engine.eccentricityProperty ],
        ( visible, e ) => visible && ( e > 0 ) ),
      scale: 1.5,
      fill: KeplersLawsColors.distancesColorProperty,
      maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
    } );
    const stringLabelNode1 = new RichText( KeplersLawsStrings.symbols.d1StringProperty, stringLabelOptions );
    const stringLabelNode2 = new RichText( KeplersLawsStrings.symbols.d2StringProperty, stringLabelOptions );
    const radiusLabelNode = new Text( KeplersLawsStrings.symbols.RStringProperty,
      combineOptions<TextOptions>( {}, KeplersLawsConstants.TEXT_OPTIONS, {
        visibleProperty: new DerivedProperty( [ model.stringVisibleProperty, model.engine.eccentricityProperty ],
          ( visible, e ) => visible && ( e === 0 ) ),
        scale: 1.5,
        fill: KeplersLawsColors.distancesColorProperty,
        maxWidth: KeplersLawsConstants.SYMBOL_MAX_WIDTH
      } ) );

    // FIRST LAW: Axis, foci, and Ellipse definition lines
    const axisPath = new Path( null, {
      stroke: SolarSystemCommonColors.foregroundProperty,
      lineWidth: 2,
      visibleProperty: new DerivedProperty(
        [ model.axesVisibleProperty, model.semiMajorAxisVisibleProperty, model.isThirdLawProperty ],
        ( axisVisible, semiMajorAxisVisible, isThirdLaw ) => {
          return axisVisible || ( semiMajorAxisVisible && isThirdLaw );
        }
      )
    } );
    const semiMajorAxisPath = new Path( null, {
      stroke: KeplersLawsColors.semiMajorAxisColorProperty,
      lineWidth: 3,
      visibleProperty: semiMajorAxisVisibleProperty
    } );
    const semiMinorAxisPath = new Path( null, {
      stroke: KeplersLawsColors.semiMinorAxisColorProperty,
      lineWidth: 3,
      visibleProperty: model.semiaxisVisibleProperty
    } );
    const focalDistancePath = new Path( null, {
      stroke: KeplersLawsColors.focalDistanceColorProperty,
      lineWidth: 3,
      visibleProperty: model.eccentricityVisibleProperty
    } );
    const stringPath = new Path( null, {
      stroke: KeplersLawsColors.distancesColorProperty,
      lineWidth: 3,
      visibleProperty: model.stringVisibleProperty,
      lineDash: [ 10, 2 ]
    } );
    const fociOptions = {
      scale: 0.8,
      center: Vector2.ZERO,
      visibleProperty: model.fociVisibleProperty,
      fill: KeplersLawsColors.fociColorProperty
    };
    const foci = [
      new XNode( fociOptions ),
      new XNode( fociOptions )
    ];

    // SECOND LAW: Periapsis and Apoapsis
    const periapsis = new XNode( {
      fill: KeplersLawsColors.periapsisColorProperty,
      stroke: KeplersLawsColors.foregroundProperty,
      center: Vector2.ZERO,
      visibleProperty: new DerivedProperty(
        [ model.periapsisVisibleProperty, this.orbit.eccentricityProperty ],
        ( visible, e ) => visible && ( e > 0 ) )
    } );
    const apoapsis = new XNode( {
      fill: KeplersLawsColors.apoapsisColorProperty,
      stroke: KeplersLawsColors.foregroundProperty,
      center: Vector2.ZERO,
      visibleProperty: new DerivedProperty(
        [ model.apoapsisVisibleProperty, this.orbit.eccentricityProperty ],
        ( visible, e ) => visible && ( e > 0 ) )
    } );

    // Arrays of orbital divisions' dots and areas
    const orbitDivisions: Circle[] = [];
    const areaPaths: Path[] = [];
    const areaValueProperties: NumberProperty[] = [];
    const timeValueProperties: NumberProperty[] = [];
    const areaValueNumberDisplays: Node[] = [];
    const timeValueNumberDisplays: Node[] = [];

    const areaValueRange = new Range( 0, 1 );
    const timeValueRange = new Range( 0, 1 );

    for ( let i = 0; i < KeplersLawsConstants.MAX_ORBITAL_DIVISIONS; i++ ) {
      orbitDivisions.push( new Circle( 4, {
        fill: 'black',
        stroke: SolarSystemCommonColors.orbitColorProperty,
        lineWidth: 3,
        center: Vector2.ZERO,
        visible: false
      } ) );
      areaPaths.push( new Path( null ) );
      const areaValueProperty = new NumberProperty( 0 );
      const timeValueProperty = new NumberProperty( 0 );
      areaValueProperties.push( areaValueProperty );
      timeValueProperties.push( timeValueProperty );
      areaValueNumberDisplays.push( new NumberDisplay( areaValueProperty, areaValueRange, {
        scale: 0.7,
        opacity: 0.8,
        numberFormatter: ( value: number ) => {
          return StringUtils.fillIn( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
            value: Utils.toFixed( value, 2 ),
            units: KeplersLawsStrings.units.AU2StringProperty
          } );
        }
      } ) );
      timeValueNumberDisplays.push( new NumberDisplay( timeValueProperty, timeValueRange, {
        scale: 0.7,
        opacity: 0.8,
        backgroundFill: KeplersLawsColors.timeDisplayBackgroundColorProperty,
        numberFormatter: ( value: number ) => {
          return StringUtils.fillIn( KeplersLawsStrings.pattern.valueUnitsStringProperty, {
            value: Utils.toFixed( value, 2 ),
            units: KeplersLawsStrings.units.yearsStringProperty
          } );
        }
      } ) );
    }

    // Nodes for the orbital divisions' dots and areas
    // There are Nodes and arrays separately to access them by index
    const orbitDivisionsNode = new Node();
    const areaPathsNode = new Node( {
      visibleProperty: model.isSecondLawProperty
    } );
    const areaValuesNode = new Node( {
      visibleProperty: DerivedProperty.and( [ model.isSecondLawProperty, model.areaValuesVisibleProperty ] )
    } );
    const timeValuesNode = new Node( {
      visibleProperty: DerivedProperty.and( [ model.isSecondLawProperty, model.timeValuesVisibleProperty ] )
    } );
    orbitDivisions.forEach( node => { orbitDivisionsNode.addChild( node ); } );
    areaPaths.forEach( node => { areaPathsNode.addChild( node ); } );
    areaValueNumberDisplays.forEach( node => { areaValuesNode.addChild( node ); } );
    timeValueNumberDisplays.forEach( node => { timeValuesNode.addChild( node ); } );

    // THIRD LAW: Period Tracker
    const periodTrackerNode = new PeriodTrackerNode( model );

    // Text Nodes
    labelsLayer.addChild( aLabelNode );
    labelsLayer.addChild( bLabelNode );
    labelsLayer.addChild( cLabelNode );
    labelsLayer.addChild( stringLabelNode1 );
    labelsLayer.addChild( stringLabelNode2 );
    labelsLayer.addChild( radiusLabelNode );

    // First Law: Axis, foci, and Ellipse definition lines
    firstLawLayer.addChild( axisPath );
    firstLawLayer.addChild( semiMinorAxisPath );
    firstLawLayer.addChild( stringPath );
    firstLawLayer.addChild( focalDistancePath );

    // Second Law: Periapsis, Apoapsis and orbital division dots and areas
    secondLawLayer.addChild( areaPathsNode );
    secondLawLayer.addChild( periapsis );
    secondLawLayer.addChild( apoapsis );
    secondLawLayer.addChild( orbitDivisionsNode );
    secondLawLayer.addChild( areaValuesNode );
    secondLawLayer.addChild( timeValuesNode );

    // Third Law: SemiMajor axis, and track
    thirdLawLayer.addChild( semiMajorAxisPath );
    thirdLawLayer.addChild( periodTrackerNode );

    this.topLayer.addChild( foci[ 0 ] );
    this.topLayer.addChild( foci[ 1 ] );

    const updatedOrbit = () => {
      // Non allowed orbits will show up as dashed lines
      this.lineDash = this.orbit.allowedOrbitProperty.value ? [ 0 ] : [ 5 ];

      const scale = modelViewTransformProperty.value.modelToViewDeltaX( 1 );

      // Ellipse distances in model coordinates
      const a = this.orbit.a;
      const b = this.orbit.b;
      const c = this.orbit.c;
      const e = this.orbit.e;
      const center = new Vector2( -c, 0 ).times( scale );

      const radiusX = scale * a;
      const radiusY = scale * b;
      const radiusC = scale * c; // Focal point

      const applyTransformation = ( point: Node ) => {
        point.translation = modelViewTransformProperty.value.modelToViewPosition( center.times( 1 / scale ) );
        point.rotation = 0;
        point.rotateAround( point.translation.add( center.times( -1 ) ), -this.orbit.w );
      };

      // The ellipse is translated and rotated so its children can use local coordinates
      applyTransformation( this );
      this.shape = new Shape().ellipse( 0, 0, radiusX, radiusY, 0 );

      // Same transformations set to TopLayer because it's not directly a child of this
      applyTransformation( this.topLayer );

      // The Number Display for areas is scaled according to the orbit size
      const numberDisplayPositionScaling = ( vectorMagnitude: number ) => {
        // Scaling the vector sum of the dot positions
        const minScaling = 1.2;
        const maxScaling = 2.0;

        // Here, a1 and a2 are the semi-major and semi-minor axes of the ellipse
        return Utils.clamp(
          Utils.linear( 10, 250, maxScaling, minScaling, vectorMagnitude ),
          minScaling, maxScaling );
      };

      // Axis of the ellipse
      const axis = new Shape().moveTo( -radiusX, 0 ).lineTo( radiusX, 0 );
      axis.moveTo( 0, -radiusY ).lineTo( 0, radiusY );
      axisPath.shape = axis;

      // Semi-major axis (a)
      semiMajorAxisPath.shape = new Shape().moveTo( 0, 0 ).lineTo( -radiusX, 0 );
      aLabelNode.center = new Vector2( -radiusX / 2, -15 );
      aLabelNode.rotation = this.orbit.w;

      // FIRST LAW -------------------------------------------
      if ( model.isFirstLawProperty.value ) {
        // Semi-minor axis (b)
        semiMinorAxisPath.shape = new Shape().moveTo( 0, 0 ).lineTo( 0, radiusY );
        bLabelNode.center = new Vector2( -15, radiusY / 2 );
        bLabelNode.rotation = this.orbit.w;

        focalDistancePath.shape = new Shape().moveTo( 0, 0 ).lineTo( e * radiusX, 0 );
        cLabelNode.center = new Vector2( e * radiusX / 2, 15 );
        cLabelNode.rotation = this.orbit.w;

        // Strings of the foci
        const bodyPosition = this.orbit.createPolar( -this.orbit.nu ).times( scale );
        const stringShape = new Shape().moveTo( -radiusC, 0 ).lineTo( ( bodyPosition.x + radiusC ), bodyPosition.y );
        stringShape.lineTo( radiusC, 0 );
        stringPath.shape = stringShape;

        const labelsYPosition = bodyPosition.y / 2;
        const offsetVector = new Vector2( 0, 15 ).rotated( bodyPosition.angle );
        const offsetVector2 = new Vector2( 0, 15 ).rotated( Math.atan2( bodyPosition.y, bodyPosition.x + 2 * radiusC ) );
        stringLabelNode1.center = new Vector2( ( bodyPosition.x / 2 + radiusC ), labelsYPosition ).add( offsetVector );
        stringLabelNode1.rotation = this.orbit.w;
        stringLabelNode2.center = new Vector2( ( ( bodyPosition.x - 2 * radiusC ) / 2 + radiusC ), labelsYPosition ).add( offsetVector2 );
        stringLabelNode2.rotation = this.orbit.w;
        radiusLabelNode.center = new Vector2( ( bodyPosition.x / 2 ), labelsYPosition ).add( offsetVector );
        radiusLabelNode.rotation = this.orbit.w;

        //Foci
        foci[ 0 ].rotation = this.orbit.w + Math.PI / 4;
        foci[ 0 ].center = new Vector2( -radiusC, 0 );

        foci[ 1 ].rotation = this.orbit.w + Math.PI / 4;
        foci[ 1 ].center = new Vector2( radiusC, 0 );
      }

      // SECOND LAW -------------------------------------------
      if ( model.isSecondLawProperty.value ) {
        // Periapsis and apoapsis
        periapsis.center = new Vector2( scale * ( a * ( 1 - e ) + c ), 0 );
        apoapsis.center = new Vector2( -scale * ( a * ( 1 + e ) - c ), 0 );

        // Drawing orbital divisions and areas
        this.orbit.orbitalAreas.forEach( ( area, i ) => {
          orbitDivisions[ i ].visible = model.isSecondLawProperty.value && area.active;
          areaPaths[ i ].visible = model.isSecondLawProperty.value && area.active;
          areaValueNumberDisplays[ i ].visible = model.isSecondLawProperty.value && area.active;
          timeValueNumberDisplays[ i ].visible = model.isSecondLawProperty.value && area.active;

          let numberDisplayPosition = new Vector2( 0, 0 );
          let numberDisplayScaling = 1;

          if ( i < model.periodDivisionProperty.value ) {
            // Set the center of the orbit's divisions dot
            const dotPosition = area.dotPosition.times( scale ).minus( center );
            orbitDivisions[ i ].center = dotPosition;
            orbitDivisions[ i ].fill = KeplersLawsColors.areaColorProperty;

            const start = area.startPosition.times( scale ).minus( center );
            const end = area.endPosition.times( scale ).minus( center );
            const startAngle = Math.atan2( start.y / radiusY, start.x / radiusX );
            const endAngle = Math.atan2( end.y / radiusY, end.x / radiusX );

            // Mean value between start and end
            numberDisplayPosition = model.engine.createPolar( ( area.startAngle + area.endAngle ) / 2 ).times( scale ).minus( center );

            if ( model.periodDivisionProperty.value === 2 ) {
              numberDisplayPosition = new Vector2( 0, radiusY * Math.pow( -1, i ) );
            }

            const dy = 15; // Spacing between area and period values
            numberDisplayScaling = numberDisplayPositionScaling( numberDisplayPosition.magnitude );
            areaValueNumberDisplays[ i ].center = numberDisplayPosition.times( numberDisplayScaling ).addXY( -dy * Math.sin( -this.orbit.w ), -dy * Math.cos( -this.orbit.w ) );
            timeValueNumberDisplays[ i ].center = numberDisplayPosition.times( numberDisplayScaling ).addXY( dy * Math.sin( -this.orbit.w ), dy * Math.cos( -this.orbit.w ) );
            areaValueNumberDisplays[ i ].rotation = this.orbit.w;
            timeValueNumberDisplays[ i ].rotation = this.orbit.w;

            // Calculates the total area of the ellipse / the number of divisions
            const fullSegmentArea = this.orbit.segmentArea * SolarSystemCommonConstants.POSITION_MULTIPLIER * SolarSystemCommonConstants.POSITION_MULTIPLIER;
            areaValueProperties[ i ].value = area.alreadyEntered ?
                                             ( area.insideProperty.value ? fullSegmentArea * area.completion : fullSegmentArea )
                                                                 : 0;
            const fullSegmentDuration = this.orbit.periodProperty.value / model.periodDivisionProperty.value;
            timeValueProperties[ i ].value = area.alreadyEntered ?
                                             ( area.insideProperty.value ? fullSegmentDuration * area.completion : fullSegmentDuration )
                                                                 : 0;

            // Activate area path
            areaPaths[ i ].fill = model.getAreaColor( area ).setAlpha( area.alreadyEntered ? 1 : 0 );
            areaPaths[ i ].shape = new Shape().moveTo( radiusC, 0 ).ellipticalArc(
              0, 0, radiusX, radiusY, 0, startAngle, endAngle, false
            ).close();
          }
        } );
      }
      else {
        for ( let i = 0; i < KeplersLawsConstants.MAX_ORBITAL_DIVISIONS; i++ ) {
          orbitDivisions[ i ].visible = false;
          areaPaths[ i ].visible = false;
        }
      }

      // THIRD LAW -------------------------------------------
      if ( model.isThirdLawProperty.value ) {
        // Period track line
        periodTrackerNode.update( scale, center, radiusX, radiusY );
      }
    };

    updatedOrbit();

    this.orbit.changedEmitter.addListener( updatedOrbit );
    this.orbit.ranEmitter.addListener( () => {
      updatedOrbit();

      // Had to call the method here because the listener is created before periodTrackerNode is instantiated
      periodTrackerNode.updateShape();
    } );

    Multilink.multilink(
      [
        modelViewTransformProperty,
        model.periodDivisionProperty,
        model.selectedLawProperty,
        KeplersLawsStrings.symbols.aStringProperty,
        KeplersLawsStrings.symbols.bStringProperty,
        KeplersLawsStrings.symbols.cStringProperty,
        KeplersLawsStrings.symbols.d1StringProperty,
        KeplersLawsStrings.symbols.d2StringProperty,
        KeplersLawsStrings.symbols.RStringProperty,
        KeplersLawsStrings.units.AU2StringProperty,
        KeplersLawsStrings.pattern.valueUnitsStringProperty,
        KeplersLawsStrings.units.yearsStringProperty
      ],
      () => updatedOrbit() );
  }
}

keplersLaws.register( 'EllipticalOrbitNode', EllipticalOrbitNode );