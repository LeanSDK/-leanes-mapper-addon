const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const LeanES = require("../../../src/leanes/index.js").default;
const { joi } = LeanES.NS.Utils;
const NumberTransform = LeanES.NS.NumberTransform;

describe('NumberTransform', () => {
  describe('.schema', () => {
     it('should has correct schema value', () => {
       expect(NumberTransform.schema).deep.equal(joi.number().allow(null).optional());
    });
  });
  describe('.normalize', () => {
    it('should normalize null value', async () => {
      assert.equal(await NumberTransform.normalize(null), null);
    });
    it('should normalize boolean value', async () => {
      assert.equal(await NumberTransform.normalize(true), 1);
    });
     it('should normalize number value', async () => {
      assert.equal(await NumberTransform.normalize(1), 1);
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async () => {
      assert.equal(await NumberTransform.serialize(null), null);
    });
    it('should serialize boolean value', async () => {
      assert.equal(await NumberTransform.serialize(true), 1);
    });
     it('should serialize number value', async () => {
      assert.equal(await NumberTransform.serialize(1), 1);
    });
  });
   describe('.objectize', () => {
    it('should objectize null value', () => {
      expect(NumberTransform.objectize(null)).to.be.null;
    });
    it('should objectize boolean value', () => {
      expect(NumberTransform.objectize(true)).to.equal(1);
    });
     it('should objectize number value', () => {
      expect(NumberTransform.objectize(1)).to.equal(1);
    });
  });
});
