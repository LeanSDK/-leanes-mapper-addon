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

describe('NumberTransform', () => {

  @initialize
  @plugin(MapperAddon)
  class Test extends LeanES {
    @nameBy static __filename = 'Test';
    @meta static object = {};
  }
  const NumberTransform = Test.NS.NumberTransform;

  describe('.schema', () => {
     it('should has correct schema value', () => {
       expect(NumberTransform.schema).deep.equal(joi.number().allow(null).optional());
    });
  });
  describe('.normalize', () => {
    it('should normalize null value', async () => {
      assert.equal(await NumberTransform.normalize(null), null);
    });
     it('should normalize number value', async () => {
      assert.equal(await NumberTransform.normalize(1), 1);
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async () => {
      assert.equal(await NumberTransform.serialize(null), null);
    });
     it('should serialize number value', async () => {
      assert.equal(await NumberTransform.serialize(1), 1);
    });
  });
   describe('.objectize', () => {
    it('should objectize null value', () => {
      expect(NumberTransform.objectize(null)).to.be.null;
    });
     it('should objectize number value', () => {
      expect(NumberTransform.objectize(1)).to.equal(1);
    });
  });
});
