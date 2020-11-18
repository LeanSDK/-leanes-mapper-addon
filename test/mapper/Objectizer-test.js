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

describe('Objectizer', () => {
  describe('recoverize', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it("should recoverize object value", async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }

      const { attribute, Objectizer } = Test.NS;

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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        static findRecordByName() {
          return Test.NS.TestRecord
        }
        @attribute({ type: 'string' }) string
        @attribute({ type: 'number' }) number
        @attribute({ type: 'boolean' }) boolean
      }

      facade.addProxy('TestsCollection', 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const collection = facade.retrieveProxy('TestsCollection');
      const objectizer = Objectizer.new();
      objectizer.collectionName = collection.collectionName();
      objectizer._collectionFactory = () => collection;
      objectizer._recordFactory = (recordClass, payload) => TestRecord.new(payload, collection);
      const record = await objectizer.recoverize(Test.NS.TestRecord, {
        type: 'Test::TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      });
      assert.instanceOf(record, Test.NS.TestRecord, 'Recoverize is incorrect');
      assert.equal(record.type, 'Test::TestRecord', '`type` is incorrect');
      assert.equal(record.string, 'string', '`string` is incorrect');
      assert.equal(record.number, 123, '`number` is incorrect');
      assert.equal(record.boolean, true, '`boolean` is incorrect');
    });
  });
  describe('objectize', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it("should objectize Record.NS value", async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }

      const { attribute, Objectizer } = Test.NS;

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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        static findRecordByName() {
          return Test.NS.TestRecord
        }
        @attribute({ type: 'string' }) string
        @attribute({ type: 'number' }) number
        @attribute({ type: 'boolean' }) boolean
      }
      facade.addProxy('TestsCollection', 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const collection = facade.retrieveProxy('TestsCollection');
      const objectizer = Objectizer.new();
      objectizer.collectionName = collection.collectionName();
      objectizer._collectionFactory = () => collection;
      const data = await objectizer.objectize(Test.NS.TestRecord.new({
        type: 'Test::TestRecord',
        string: 'string',
        number: 123,
        boolean: true
      }, collection));

      assert.instanceOf(data, Object, 'Objectize is incorrect');
      assert.equal(data.type, 'Test::TestRecord', '`type` is incorrect');
      assert.equal(data.string, 'string', '`string` is incorrect');
      assert.equal(data.number, 123, '`Number` is incorrect');
      assert.equal(data.boolean, true, '`Boolean` is incorrect');
    });
  });
  describe('.replicateObject', () => {
    let facade = null;
    const KEY = 'TEST_SERIALIZER_001';
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should create replica for objectizer', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Objectizer } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MyCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MyCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class MyObjectizer extends Test.NS.Objectizer {
        @nameBy static __filename = 'MyObjectizer';
        @meta static object = {};
      }

      facade.bind('MyObjectizer').to(MyObjectizer);

      const COLLECTION = 'COLLECTION';
      facade.addProxy(COLLECTION, 'MyCollection', {
        delegate: Test.NS.Record,
        objectizer: 'MyObjectizer',
        serializer: Test.NS.SERIALIZER
      });
      const collection = facade.retrieveProxy(COLLECTION);

      const replica = await MyObjectizer.replicateObject(collection.objectizer);
      assert.deepEqual(replica, {
        type: 'instance',
        class: 'MyObjectizer',
        multitonKey: KEY,
        collectionName: COLLECTION
      });
    });
  });
  describe('.restoreObject', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should restore objectizer from replica', async () => {
      const KEY = 'TEST_SERIALIZER_002';

      @initialize
      @plugin(MapperAddon)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }

      const { attribute, Objectizer } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MyCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MyCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class MyObjectizer extends Test.NS.Objectizer {
        @nameBy static __filename = 'MyObjectizer';
        @meta static object = {};
      }

      facade.bind('MyObjectizer').to(MyObjectizer);

      const COLLECTION = 'COLLECTION';
      facade.addProxy(COLLECTION, 'MyCollection', {
        delegate: Test.NS.Record,
        objectizer: 'MyObjectizer',
        serializer: Test.NS.SERIALIZER
      });
      const collection = facade.retrieveProxy(COLLECTION);
      const restored = await MyObjectizer.restoreObject(Test, {
        type: 'instance',
        class: 'MyObjectizer',
        multitonKey: KEY,
        collectionName: COLLECTION
      });
      const collectionObjectizer = collection.objectizer;
      assert.equal(collectionObjectizer.collectionName, restored.collectionName);
      assert.equal(collectionObjectizer.constructor, restored.constructor);
    });
  });
});
