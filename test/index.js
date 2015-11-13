/* eslint-env mocha */

var testShapeCloseness = require('..');
var Canvas = require('canvas');
var assert = require('assert');

var DEFAULT_TOLERANCE = 0.05;

function assertApproximately (actual, expected, tolerance, message) {
  if (typeof tolerance === 'string') {
    message = tolerance;
    tolerance = undefined;
  }
  if (tolerance === undefined) {
    tolerance = expected * DEFAULT_TOLERANCE;
  }
  if (Math.abs(expected - actual) > tolerance) {
    assert.fail(actual, expected + ' ± ' + tolerance, message, '==', assertApproximately);
  }
}

var exampleShapeData = {
  point: {
    whole: {type: 'point', x: 50, y: 50}
  },
  line: {
    whole: {type: 'line', x1: 25, y1: 25, x2: 75, y2: 75}
  },
  circle: {
    whole: {type: 'circle', x: 50, y: 50, r: Math.sqrt(500 / Math.PI)},
    half: {type: 'circle', x: 50, y: 50, r: Math.sqrt(250 / Math.PI)}
  },
  ellispe: {
    whole: {type: 'ellispe', x: 50, y: 50, r1: Math.sqrt(500 / Math.PI), r2: Math.sqrt(400 / Math.PI)},
    half: {type: 'ellispe', x: 50, y: 50, r1: Math.sqrt(250 / Math.PI), r2: Math.sqrt(200 / Math.PI)}
  },
  rect: {
    whole: {type: 'rect', x: 0, y: 0, width: 100, height: 100},
    half: {type: 'rect', x: 0, y: 0, width: 100, height: 50}
  },
  polygon: {
    whole: {type: 'polygon', points: [{x: 50, y: 0}, {x: 100, y: 50}, {x: 50, y: 100}, {x: 0, y: 50}]},
    half: {type: 'polygon', points: [{x: 50, y: 0}, {x: 100, y: 50}, {x: 50, y: 100}]}
  }
};

describe('testShapeCloseness', function () {
  it('exports a function', function () {
    assert.equal(typeof testShapeCloseness, 'function');
  });

  it('exposes some internals', function () {
    assert.equal(typeof testShapeCloseness.__internals, 'object');
  });

  it('exposes a list of its shapes', function () {
    assert.equal(typeof testShapeCloseness.__internals.shapes, 'object');
  });
});

Object.keys(testShapeCloseness.__internals.shapes).forEach(function (shape) {
  describe('Shape "' + shape + '"', function () {
    var wholeShapeData = exampleShapeData[shape].whole;
    var halfShapeData = exampleShapeData[shape].half;

    var testCanvas = new Canvas();
    testCanvas.width = 200;
    testCanvas.height = 200;

    var testOptions = {
      canvas: testCanvas
    };

    it('overlaps itself perfectly', function () {
      var shapesToCompare = [wholeShapeData, wholeShapeData];
      var overlap = testShapeCloseness(shapesToCompare, testOptions);
      assertApproximately(overlap, 1);
    });

    if (halfShapeData !== undefined) {
      it('overlaps a shape half as big', function () {
        var shapesToCompare = [wholeShapeData, halfShapeData];
        var overlap = testShapeCloseness(shapesToCompare, testOptions);
        assertApproximately(overlap, 0.5);
      });
    }
  });
});
