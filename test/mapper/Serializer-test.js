const { expect, assert } = require('chai');
const _ = require('lodash');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, meta, constant, method, mixin, plugin
} = LeanES.NS;

describe('Serializer', () => {
  describe('.normalize', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should normalize object value', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, Serializer, attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return Test.NS.TestRecord;
        }
        @attribute({ type: 'string' }) string;
        @attribute({ type: 'number' }) number;
        @attribute({ type: 'boolean' }) boolean;
      }

      facade.addProxy('TestsCollection', 'TestsCollection', {
        delegate: 'TestRecord'
      });
      const collection = facade.retrieveProxy('TestsCollection');
      const serializer = Serializer.new();
      serializer.collectionName = collection.collectionName();
      serializer._collectionFactory = () => collection;
      serializer._recordFactory = (recordClass, payload) => TestRecord.new(payload, collection);
      const record = await serializer.normalize(Test.NS.TestRecord, {
        type: 'Test::TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      });
      assert.instanceOf(record, Test.NS.TestRecord, 'Normalize is incorrect');
      assert.equal(record.type, 'Test::TestRecord', '`type` is incorrect');
      assert.equal(record.string, 'string', '`string` is incorrect');
      assert.equal(record.number, 123, '`number` is incorrect');
      assert.equal(record.boolean, true, '`boolean` is incorrect');
    });
  });
  describe('.serialize', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should serialize Record.prototype value', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, Serializer, attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return Test.NS.TestRecord;
        }
        @attribute({ type: 'string' }) string;
        @attribute({ type: 'number' }) number;
        @attribute({ type: 'boolean' }) boolean;
      }

      facade.addProxy('TestsCollection', 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const collection = facade.retrieveProxy('TestsCollection');
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      }, collection);
      const serializer = Serializer.new();
      serializer.collectionName = collection.collectionName();
      serializer._collectionFactory = () => collection;
      serializer._recordFactory = () => record;
      const data = await serializer.serialize(record);
      assert.instanceOf(data, Object, 'Serialize is incorrect');
      assert.equal(data.type, 'Test::TestRecord', '`type` is incorrect');
      assert.equal(data.string, 'string', '`string` is incorrect');
      assert.equal(data.number, 123, '`number` is incorrect');
      assert.equal(data.boolean, true, '`boolean` is incorrect');
    });
  });
  describe('.replicateObject', () => {
    let facade = null;
    const KEY = 'TEST_SERIALIZER_001';
    after(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should create replica for serializer', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, Serializer, attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MyCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MyCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class MySerializer extends Serializer {
        @nameBy static __filename = 'MySerializer';
        @meta static object = {};
      }

      facade.bind('MySerializer').to(MySerializer);

      const COLLECTION = 'COLLECTION';
      facade.addProxy(COLLECTION, 'MyCollection', {
        delegate: Test.NS.Record,
        serializer: 'MySerializer'
      });
      const collection = facade.retrieveProxy(COLLECTION);
      const replica = await MySerializer.replicateObject(collection.serializer);
      assert.deepEqual(replica, {
        type: 'instance',
        class: 'MySerializer',
        multitonKey: KEY,
        collectionName: COLLECTION
      });
    });
  });
  describe('.restoreObject', () => {
    let facade = null;
    const KEY = 'TEST_SERIALIZER_002';
    after(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should restore serializer from replica', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, Serializer, attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MyCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MyCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class MySerializer extends Serializer {
        @nameBy static __filename = 'MySerializer';
        @meta static object = {};
      }

      facade.bind('MySerializer').to(MySerializer);

      const COLLECTION = 'COLLECTION';
      facade.addProxy(COLLECTION, 'MyCollection', {
        delegate: Test.NS.Record,
        serializer: 'MySerializer'
      });
      const collection = facade.retrieveProxy(COLLECTION);
      const restoredRecord = await MySerializer.restoreObject(Test, {
        type: 'instance',
        class: 'MySerializer',
        multitonKey: KEY,
        collectionName: COLLECTION
      });
      const collectionSerializer = collection.serializer;
      assert.equal(collectionSerializer.collectionName, restoredRecord.collectionName);
      assert.equal(collectionSerializer.constructor, restoredRecord.constructor);
    });
  });
});
