const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, resolver, meta, mixin, plugin,
  Utils: { joi }
} = LeanES.NS;

describe('Transform', () => {

  @initialize
  @plugin(MapperAddon)
  class Test extends LeanES {
    @nameBy static __filename = 'Test';
    @meta static object = {};
  }

  const Transform = Test.NS.Transform;

  describe('.schema', () => {
    it('should has correct schema value', () => {
      expect(Transform.schema).deep.equal(joi.any().allow(null).optional());
    });
  });
  describe('.objectize', () => {
    it('should objectize null value', () => {
      expect(Transform.objectize(null)).to.be.null;
    });
    it('should objectize boolean value', () => {
      expect(Transform.objectize(true)).to.be.true;
    });
    it('should objectize string value', () => {
      expect(Transform.objectize('True')).to.equal('True');
    });
    it('should objectize number value', () => {
      expect(Transform.objectize(1)).to.equal(1);
    });
  });
    describe('.normalize', () => {
    it('should normalize null value', async () => {
      assert.equal(await Transform.normalize(null), null);
    });
    it('should normalize boolean value', async () => {
      assert.equal(await Transform.normalize(true), true);
    });
    it('should normalize string value', async () => {
      assert.equal(await Transform.normalize('True'), 'True');
    });
    it('should normalize number value', async () => {
      assert.equal(await Transform.normalize(1), 1);
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async () => {
      assert.equal(await Transform.serialize(null), null);
    });
    it('should serialize boolean value', async () => {
      assert.equal(await Transform.normalize(true), true);
    });
    it('should serialize string value', async () => {
      assert.equal(await Transform.normalize('True'), 'True');
    });
    it('should serialize number value', async () => {
      assert.equal(await Transform.normalize(1), 1);
    });
  });
});
