const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const LeanES = require("../../../src/leanes/index.js").default;
const { joi } = LeanES.NS.Utils;
const BooleanTransform = LeanES.NS.BooleanTransform;

describe('BooleanTransform', () => {
  describe('.schema', () => {
    it('should has correct schema value', () => {
      expect(BooleanTransform.schema).deep.equal(joi.boolean().allow(null).optional());
    });
  });
  describe('.normalize', () => {
    it('should deserialize null value', async () => {
      assert.isFalse(await BooleanTransform.normalize(null));
    });
    it('should deserialize boolean value', async () => {
      assert.isTrue(await BooleanTransform.normalize(true));
    });
    it('should deserialize string value', async () => {
      assert.isTrue(await BooleanTransform.normalize('True'));
    });
    it('should deserialize number value', async () => {
      assert.isTrue(await BooleanTransform.normalize(1));
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async () => {
      assert.isFalse(await BooleanTransform.serialize(null));
    });
    it('should serialize boolean value', async () => {
      assert.isTrue(await BooleanTransform.serialize(true));
    });
    it('should serialize string value', async () => {
      assert.isTrue(await BooleanTransform.serialize('True'));
    });
    it('should serialize number value', async () => {
      assert.isTrue(await BooleanTransform.serialize(1));
    });
  });
  describe('.objectize', () => {
    it('should objectize null value', () => {
      expect(BooleanTransform.objectize(null)).to.be.false;
    });
    it('should objectize boolean value', () => {
      expect(BooleanTransform.objectize(true)).to.be.true;
    });
    it('should objectize string value', () => {
      expect(BooleanTransform.objectize('True')).to.be.true;
    });
    it('should objectize number value', () => {
      expect(BooleanTransform.objectize(1)).to.be.true;
    });
  });
});
