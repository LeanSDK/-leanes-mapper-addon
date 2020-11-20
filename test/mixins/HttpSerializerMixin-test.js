const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, resolver, meta, mixin, constant, method, property, plugin
} = LeanES.NS;

describe('HttpSerializerMixin', () => {
  describe('.normalize', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it("should normalize object value", async () => {
      const KEY = 'TEST_HTTP_SERIALIZER_001';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName(asType) {
          return this;
        }
        @attribute({ type: 'string' }) string;
        @attribute({ type: 'number' }) number;
        @attribute({ type: 'boolean' }) boolean;
      }

      @initialize
      @mixin(Test.NS.HttpSerializerMixin)
      @partOf(Test)
      class HttpSerializer extends Test.NS.Serializer {
        @nameBy static __filename = 'HttpSerializer';
        @meta static object = {};
      }

      facade.addProxy('TestsCollection', 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const boundCollection = facade.retrieveProxy('TestsCollection');
      const serializer = HttpSerializer.new();
      serializer.collectionName = boundCollection.collectionName();
      serializer._collectionFactory = () => boundCollection;
      serializer._recordFactory = (recordClass, payload) => TestRecord.new(payload, boundCollection);
      const record = await serializer.normalize(TestRecord, JSON.stringify({
        type: 'TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      }));
      assert.instanceOf(record, TestRecord, 'Normalize is incorrect');
      assert.include(record, {
        type: 'TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      });
    });
  });
  describe('.serialize', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it("should serialize Record.NS value", async () => {
      const KEY = 'TEST_HTTP_SERIALIZER_002';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName(asType) {
          return TestRecord;
        }
        @attribute({ type: 'string' }) string;
        @attribute({ type: 'number' }) number;
        @attribute({ type: 'boolean' }) boolean;
      }

      @initialize
      @mixin(Test.NS.HttpSerializerMixin)
      @partOf(Test)
      class HttpSerializer extends Test.NS.Serializer {
        @nameBy static __filename = 'HttpSerializer';
        @meta static object = {};
      }

      facade.addProxy('TestsCollection', 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const boundCollection = facade.retrieveProxy('TestsCollection');
      const serializer = HttpSerializer.new(boundCollection);
      const data = await serializer.serialize(TestRecord.new({
        type: 'TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      }, boundCollection));
      assert.instanceOf(data, Object, 'Serialize is incorrect');
      assert.include(data.test, {
        type: 'TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      });
    });
  });
});
