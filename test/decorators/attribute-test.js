const { expect, assert } = require('chai');
const LeanES = require("../../../src/leanes/index.js").default;
const {
  initialize, partOf, nameBy, meta, attribute
} = LeanES.NS;

describe('attribute', () => {
  describe('attribute(opts)', () => {
    it('should add attributes in metaObject', () => {
      expect(() => {

        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @attribute({ type: 'string' }) test = 'test';
        }
        assert.isOk(TestRecord.metaObject.parent.data.attributes.test);
        assert.equal(TestRecord.metaObject.parent.data.attributes.test.type, 'string');
        assert.isOk(TestRecord.metaObject.parent.data.instanceVariables.test);
      }).to.not.throw(Error);
    });
    it('should add attributes in metaObject(fail)', () => {
      expect(() => {

        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @attribute({ type: 'string' }) static test = 'test';
        }
        assert.isOk(TestRecord.metaObject.parent.data.attributes.test);
        assert.equal(TestRecord.metaObject.parent.data.attributes.test.type, 'string');
        assert.isOk(TestRecord.metaObject.parent.data.instanceVariables.test);
      }).to.throw(Error);
    });
    it('option `type` is required', () => {
      expect(() => {

        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @attribute() test;
        }
      }).to.throw(Error);
    });
  });
});
