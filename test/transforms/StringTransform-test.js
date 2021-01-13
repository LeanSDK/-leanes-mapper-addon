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

describe('StringTransform', () => {

  @initialize
  @plugin(MapperAddon)
  class Test extends LeanES {
    @nameBy static __filename = 'Test';
    @meta static object = {};
  }
  const StringTransform = Test.NS.StringTransform;

  describe('.schema', () => {
    it('should has correct schema value', () => {
      expect(StringTransform.schema).deep.equal(joi.string().allow(null).optional());
    });
  });
  describe('.objectize', () => {
    it('should objectize null value', () => {
      expect(StringTransform.objectize(null)).to.be.null;
    });
    it('should objectize string value', () => {
      expect(StringTransform.objectize('True')).to.equal('True');
    });
  });
  describe('.normalize', () => {
    it('should normalize null value', async () => {
      assert.equal(await StringTransform.normalize(null), null);
    });
    it('should normalize string value', async () => {
      assert.equal(await StringTransform.normalize('True'), 'True');
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async () => {
      assert.equal(await StringTransform.serialize(null), null);
    });
    it('should serialize string value', async () => {
      assert.equal(await StringTransform.serialize('True'), 'True');
    });
  });
});
