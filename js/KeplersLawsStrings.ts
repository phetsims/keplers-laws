// Copyright 2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import keplersLaws from './keplersLaws.js';

type StringsType = {
  'keplers-laws': {
    'titleStringProperty': LinkableProperty<string>;
  };
  'undefinedStringProperty': LinkableProperty<string>;
  'circularOrbitStringProperty': LinkableProperty<string>;
  'axisStringProperty': LinkableProperty<string>;
  'fociStringProperty': LinkableProperty<string>;
  'stringsStringProperty': LinkableProperty<string>;
  'semiaxisStringProperty': LinkableProperty<string>;
  'eccentricityStringProperty': LinkableProperty<string>;
  'eccentricityEquationStringProperty': LinkableProperty<string>;
  'apoapsisStringProperty': LinkableProperty<string>;
  'periapsisStringProperty': LinkableProperty<string>;
  'starMassStringProperty': LinkableProperty<string>;
  'ourSunStringProperty': LinkableProperty<string>;
  'area': {
    'periodDivisionStringProperty': LinkableProperty<string>;
    'areaUnitsStringProperty': LinkableProperty<string>;
  };
  'areaGraph': {
    'titleStringProperty': LinkableProperty<string>;
  };
  'graph': {
    'titleStringProperty': LinkableProperty<string>;
    'aStringProperty': LinkableProperty<string>;
    'tStringProperty': LinkableProperty<string>;
  };
  'symbols': {
    'semiMajorAxisStringProperty': LinkableProperty<string>;
    'semiMinorAxisStringProperty': LinkableProperty<string>;
    'focalDistanceStringProperty': LinkableProperty<string>;
    'periodStringProperty': LinkableProperty<string>;
    'divisionStringProperty': LinkableProperty<string>;
  };
  'pattern': {
    'textEqualsValueUnitsStringProperty': LinkableProperty<string>;
  };
  'warning': {
    'warningStringProperty': LinkableProperty<string>;
    'crashOrbitStringProperty': LinkableProperty<string>;
    'escapeOrbitStringProperty': LinkableProperty<string>;
  }
};

const KeplersLawsStrings = getStringModule( 'KEPLERS_LAWS' ) as StringsType;

keplersLaws.register( 'KeplersLawsStrings', KeplersLawsStrings );

export default KeplersLawsStrings;
