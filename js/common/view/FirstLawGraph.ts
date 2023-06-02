// Copyright 2023, University of Colorado Boulder

/**
 * Panel that shows the graph of the Eccentricity of the orbit. Compared to other
 * orbits of the Solar System.
 *
 * @author Agustín Vallejo
 */

import { AlignBox, HBox, Node, Path, Text, TextOptions } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import Range from '../../../../dot/js/Range.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import { Shape } from '../../../../kite/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import keplersLaws from '../../keplersLaws.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import KeplersLawsStrings from '../../KeplersLawsStrings.js';

const FOREGROUND_COLOR_PROPERTY = SolarSystemCommonColors.foregroundProperty;

class ExampleOrbit extends EnumerationValue {
  public static readonly MERCURY = new ExampleOrbit( 0.2056, KeplersLawsStrings.orbit.mercuryStringProperty );
  public static readonly EARTH = new ExampleOrbit( 0.0167, KeplersLawsStrings.orbit.earthStringProperty );
  public static readonly ERIS = new ExampleOrbit( 0.44, KeplersLawsStrings.orbit.erisStringProperty );
  public static readonly NEREID = new ExampleOrbit( 0.75, KeplersLawsStrings.orbit.nereidStringProperty );
  public static readonly HALLEY = new ExampleOrbit( 0.967, KeplersLawsStrings.orbit.halleyStringProperty );

  public static readonly enumeration = new Enumeration( ExampleOrbit );

  public constructor( public readonly eccentricity: number, public readonly stringProperty: TReadOnlyProperty<string> ) {
    super();
  }
}

export default class FirstLawGraph extends AlignBox {

  public constructor( public model: KeplersLawsModel ) {

    const yAxisLength = 180;

    const modelYRange = new Range( 0, 1 );

    const yAxis = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, yAxisLength ), {
      fill: FOREGROUND_COLOR_PROPERTY,
      stroke: FOREGROUND_COLOR_PROPERTY
    } );

    const orbitAndValues: HBox[] = [];

    ExampleOrbit.enumeration.values.forEach( ( exampleOrbit: ExampleOrbit ) => {
      const orbitNameProperty = exampleOrbit.stringProperty;
      const eccentricity = exampleOrbit.eccentricity;
      const title = new Text( orbitNameProperty, SolarSystemCommonConstants.TEXT_OPTIONS );
      const content = new HBox( {
        centerY: yAxisLength * eccentricity,
        spacing: 5,
        children: [
          title,
          new ArrowNode( 0, 0, 20, 0, { stroke: FOREGROUND_COLOR_PROPERTY, fill: FOREGROUND_COLOR_PROPERTY, tailWidth: 1 } )
        ]
      } );
      orbitAndValues.push( content );

      orbitNameProperty.link( ( name: string ) => {
        content.x = -title.width - 30;
      } );
    } );

    const currentEccentricityNode = new HBox( {
      x: 10,
      children: [
        new ArrowNode( 0, 0, -20, 0, { stroke: 'fuchsia', fill: 'fuchsia', tailWidth: 1 } ),
        new NumberDisplay( model.engine.eccentricityProperty, modelYRange, {
          decimalPlaces: 2,
          textOptions: combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TEXT_OPTIONS, {
            fill: 'fuchsia'
          } ),
          backgroundFill: null,
          backgroundStroke: null
        } )
      ]
    } );

    const currentEccentricityContainer = new Node( {
      children: [ currentEccentricityNode ],
      localBounds: new Bounds2( currentEccentricityNode.left, 0, currentEccentricityNode.right, yAxisLength )
    } );

    model.engine.eccentricityProperty.link( ( eccentricity: number ) => {
      currentEccentricityNode.centerY = yAxisLength * eccentricity;
    } );

    const chartTransform = new ChartTransform( {
      viewHeight: yAxisLength,
      modelYRange: modelYRange
    } );

    // y tick marks
    const YSpacing = 0.1;
    const YTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, YSpacing, {
      edge: 'min',
      stroke: SolarSystemCommonColors.foregroundProperty
    } );

    super( new Node( {
      children: [
        ...orbitAndValues,
        yAxis,
        YTickMarkSet,
        currentEccentricityContainer
      ]
    } ), {
      layoutOptions: {
        align: 'center'
      }
    } );
  }
}

keplersLaws.register( 'FirstLawGraph', FirstLawGraph );