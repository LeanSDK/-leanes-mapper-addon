const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const _ = require('lodash');
const LeanES = require('@leansdk/leanes/src/leanes').default;
const {
  RecordInterface,
  initialize, partOf, nameBy, resolver, meta, attribute, mixin, constant, method, property
} = LeanES.NS;

describe('HttpSerializerMixin', () => {
  describe('.normalize', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it("should normalize object value", async () => {
      const KEY = 'TEST_HTTP_SERIALIZER_001';
      facade = LeanES.NS.Facade.getInstance(KEY);
      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @partOf(Test)
      class TestsCollection extends LeanES.NS.Collection {
        @nameBy static  __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static  __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName(asType) {
          return this;
        }
        @attribute({type: 'string'}) string;
        @attribute({type: 'number'}) number;
        @attribute({type: 'boolean'}) boolean;
      }

      @initialize
      @mixin(LeanES.NS.HttpSerializerMixin)
      @partOf(Test)
      class HttpSerializer extends LeanES.NS.Serializer {
        @nameBy static  __filename = 'HttpSerializer';
        @meta static object = {};
      }
      const boundCollection = TestsCollection.new('TestsCollection', {
        delegate: 'TestRecord'
      });
      facade.registerProxy(boundCollection);
      const serializer = HttpSerializer.new(boundCollection);
      const record = await serializer.normalize(TestRecord, {
        type: 'TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      });
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
      facade = LeanES.NS.Facade.getInstance(KEY);
      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @partOf(Test)
      class TestsCollection extends LeanES.NS.Collection {
        @nameBy static  __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static  __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName(asType) {
          return TestRecord;
        }
        @attribute({type: 'string'}) string;
        @attribute({type: 'number'}) number;
        @attribute({type: 'boolean'}) boolean;
      }

      @initialize
      @mixin(LeanES.NS.HttpSerializerMixin)
      @partOf(Test)
      class HttpSerializer extends LeanES.NS.Serializer {
        @nameBy static  __filename = 'HttpSerializer';
        @meta static object = {};
      }
      const boundCollection = TestsCollection.new('TestsCollection', {
        delegate: 'TestRecord'
      });
      facade.registerProxy(boundCollection);
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
