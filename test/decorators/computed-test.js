const { expect, assert } = require('chai');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, meta, plugin
} = LeanES.NS;

describe('computed', () => {
  describe('computed(opts)', () => {
    it('getter `lambda` in descriptor is required', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { computed } = Test.NS;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @computed({ type: 'string' }) test() { };
        }
      }).to.throw(Error);
    });
    it('setter `lambda` in descriptor is forbidden', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { computed } = Test.NS;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @computed({ type: 'string' }) get test() { };
          @computed({ type: 'string' }) set test(newVal) { };
        }
      }).to.throw(Error);
    });
    it('Decorator `computed` may be used with instance properties only', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { computed } = Test.NS;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @computed({ type: 'string' }) static get test() { };
        }
      }).to.throw(Error);
    });
    it('option `type` is required', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { computed } = Test.NS;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @computed() test() { };
        }
      }).to.throw(Error);
    });
    it('should add computeds, variables in metaObject', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { computed } = Test.NS;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @computed({ type: 'string' }) get test() { };
        }
        assert.isOk(TestRecord.metaObject.parent.data.computeds.test);
        assert.isOk(TestRecord.metaObject.parent.data.instanceVariables.test);
      }).to.not.throw(Error);
    });
  });
});
