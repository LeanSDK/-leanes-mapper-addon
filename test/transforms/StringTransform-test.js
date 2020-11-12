const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const LeanES = require("../../../src/leanes/index.js").default;
const { joi } = LeanES.NS.Utils;
const StringTransform = LeanES.NS.StringTransform;

describe('StringTransform', () => {
  describe('.schema', () => {
    it('should has correct schema value', () => {
      expect(StringTransform.schema).deep.equal(joi.string().allow(null).optional());
    });
  });
  describe('.objectize', () => {
    it('should objectize null value', () => {
      expect(StringTransform.objectize(null)).to.be.null;
    });
    it('should objectize boolean value', () => {
      expect(StringTransform.objectize(true)).to.equal('true');
    });
    it('should objectize string value', () => {
      expect(StringTransform.objectize('True')).to.equal('True');
    });
    it('should objectize number value', () => {
      expect(StringTransform.objectize(1)).to.equal('1');
    });
  });
  describe('.normalize', () => {
    it('should normalize null value', async () => {
      assert.equal(await StringTransform.normalize(null), null);
    });
    it('should normalize boolean value', async () => {
      assert.equal(await StringTransform.normalize(true), 'true');
    });
    it('should normalize string value', async () => {
      assert.equal(await StringTransform.normalize('True'), 'True');
    });
    it('should normalize number value', async () => {
      assert.equal(await StringTransform.normalize(1), '1');
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async () => {
      assert.equal(await StringTransform.serialize(null), null);
    });
    it('should serialize boolean value', async () => {
      assert.equal(await StringTransform.serialize(true), 'true');
    });
    it('should serialize string value', async () => {
      assert.equal(await StringTransform.serialize('True'), 'True');
    });
    it('should serialize number value', async () => {
      assert.equal(await StringTransform.serialize(1), '1');
    });
  });
});
