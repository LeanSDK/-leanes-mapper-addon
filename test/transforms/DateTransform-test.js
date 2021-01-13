const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, nameBy, meta, plugin,
  Utils: { joi }
} = LeanES.NS;

describe('DateTransform', () => {

  @initialize
  @plugin(MapperAddon)
  class Test extends LeanES {
    @nameBy static __filename = 'Test';
    @meta static object = {};
  }
  const DateTransform = Test.NS.DateTransform;

  describe('.schema', () => {
    it('should has correct schema value', () => {
      expect(DateTransform.schema).deep.equal(joi.date().iso().allow(null).optional());
    });
  });
  describe('.normalize', () => {
    it('should deserialize null value', async () => {
      assert.equal(await DateTransform.normalize(null), null);
    });
    it('should deserialize date value', async () => {
      const date = new Date();
      assert.deepEqual(await DateTransform.normalize(date.toISOString()), date);
    });
    it('should deserialize number value', async () => {
      assert.deepEqual(await DateTransform.normalize(1), new Date(1));
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async () => {
      assert.equal(await DateTransform.serialize(null), null);
    });
    it('should serialize date value', async () => {
      const date = new Date();
      assert.equal(await DateTransform.serialize(date), date.toISOString());
    });
  });
  describe('.objectize', () => {
    it('should objectize null value', () => {
      expect(DateTransform.objectize(null)).to.be.null;
    });
    it('should objectize date value', () => {
      const date = new Date();
      expect(DateTransform.objectize(date)).to.eql(date.toISOString());
    });
  });
});
