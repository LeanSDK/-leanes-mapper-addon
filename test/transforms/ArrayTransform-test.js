const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const LeanES = require("../../../src/leanes/index.js").default;
const { joi } = LeanES.NS.Utils;
const ArrayTransform = LeanES.NS.ArrayTransform;

describe('ArrayTransform', () => {
  describe('.schema', () => {
    it('should has correct schema value', () => {
      expect(ArrayTransform.schema).deep.equal(joi.array().items(joi.any()).allow(null).optional());
    });
    it('should has correct validate empty array value', async () => {
      expect(await joi.validate([], ArrayTransform.schema)).deep.equal([]);
    });
    it('should has correct validate any array value', async () => {
      expect(await joi.validate([
        1,
        true,
        'three',
        {
          four: "2020-07-06T12:52:43.160Z"
        }
      ], ArrayTransform.schema)).deep.equal(
        [
          1,
          true,
          'three',
          {
            four: "2020-07-06T12:52:43.160Z"
          }
        ]
      );
    });
  });
  describe('.normalize', () => {
    it('should normalize null value', async () => {
      assert.deepEqual(await ArrayTransform.normalize(null), []);
    });
    it('should normalize empty array', async () => {
      assert.deepEqual(await ArrayTransform.normalize([]), []);
    });
    it('should normalize simple array', async () => {
      assert.deepEqual(await ArrayTransform.normalize([1, true, 'three', "2020-07-06T12:52:43.160Z"]), [1, true, 'three', new Date("2020-07-06T12:52:43.160Z")]);
    });
    it('should normalize complex array', async () => {
      assert.deepEqual(await ArrayTransform.normalize(
        [
          1,
          { two: { three: 'three' } },
          [1, 2]
        ]),
        [
          1,
          { two: { three: 'three' } },
          [1, 2]
        ]);
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async () => {
      assert.deepEqual(await ArrayTransform.serialize(null), []);
    });
    it('should serialize empty array', async () => {
      assert.deepEqual(await ArrayTransform.serialize([]), []);
    });
    it('should serialize simple array', async () => {
      assert.deepEqual(await ArrayTransform.serialize([1, true, 'three', new Date("2018-06-05T12:52:43.160Z")]), [1, true, 'three', "2018-06-05T12:52:43.160Z"]);
    });
    it('should serialize complex array', async () => {
      assert.deepEqual(await ArrayTransform.serialize(
        [
          1,
          { two: { three: 'three' } },
          [1, 2]
        ]
      ),
        [
          1,
          { two: { three: 'three' } },
          [1, 2]
        ]
      );
    });
  });
  describe('.objectize', () => {
    it('should objectize null value', () => {
      expect(ArrayTransform.objectize(null)).deep.equal([]);
    });
    it('should objectize empty array', () => {
      expect(ArrayTransform.objectize([])).deep.equal([]);
    });
    it('should objectize simple array', () => {
      expect(ArrayTransform.objectize([1, true, 'three', new Date("2018-06-05T12:52:43.160Z")])).deep.equal([1, true, 'three', "2018-06-05T12:52:43.160Z"]);
    });
    it('should objectize complex array', () => {
      expect(ArrayTransform.objectize(
        [
          1,
          { two: { three: 'three' } },
          [1, 2]
        ])).deep.equal(
          [
            1,
            { two: { three: 'three' } },
            [1, 2]
          ]
        );
    });
  });
});
