const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
// const LeanES = require("../../../src/leanes/index.js").default;
const LeanES = require("../../../src/leanes/index.js").default;
const { joi } = LeanES.NS.Utils;
const {
  Objectizer, Collection, Record,
  initialize, partOf, nameBy, resolver, meta, attribute, mixin
} = LeanES.NS;

describe('Objectizer', () => {
  describe('recoverize', () => {
    it("should recoverize object value", async () => {

      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }

      @initialize
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
        static findRecordByName() {
          return Test.NS.TestRecord
        }
        @attribute({type: 'string'}) string
        @attribute({type: 'number'}) number
        @attribute({type: 'boolean'}) boolean
      }

      const collection = TestsCollection.new();
      collection.setName('Tests');
      collection.setData({
        delegate: 'TestRecord'
      });
      const objectizer = Objectizer.new(collection);
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
    it("should objectize Record.NS value", async () => {

      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }

      @initialize
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
        static findRecordByName() {
          return Test.NS.TestRecord
        }
        @attribute({type: 'string'}) string
        @attribute({type: 'number'}) number
        @attribute({type: 'boolean'}) boolean
      }

      // const col = TestsCollection.new('Tests', {
      //   delegate: 'TestRecord'
      // });
      const collection = TestsCollection.new();
      collection.setName('Tests');
      collection.setData({
        delegate: 'TestRecord'
      });

      const objectizer = Objectizer.new(collection);
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
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      class MyCollection extends LeanES.NS.Collection {
        @nameBy static  __filename = 'MyCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class MyObjectizer extends LeanES.NS.Objectizer {
        @nameBy static  __filename = 'MyObjectizer';
        @meta static object = {};
      }

      const COLLECTION = 'COLLECTION';
      const col = MyCollection.new();
      col.setName(COLLECTION);
      col.setData({
        delegate: Test.NS.Record,
        objectizer: MyObjectizer
      });
      let collection = facade.registerProxy(col);
      collection = facade.retrieveProxy(COLLECTION);
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
    const KEY = 'TEST_SERIALIZER_002';
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should restore objectizer from replica', async () => {
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      class MyCollection extends LeanES.NS.Collection {
        @nameBy static  __filename = 'MyCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class MyObjectizer extends LeanES.NS.Objectizer {
        @nameBy static  __filename = 'MyObjectizer';
        @meta static object = {};
      }

      const COLLECTION = 'COLLECTION';
      const col = MyCollection.new();
      col.setName(COLLECTION);
      col.setData({
        delegate: Test.NS.Record,
        objectizer: MyObjectizer
      });
      let collection = facade.registerProxy(col);
      collection = facade.retrieveProxy(COLLECTION);
      const restored = await MyObjectizer.restoreObject(Test, {
        type: 'instance',
        class: 'MyObjectizer',
        multitonKey: KEY,
        collectionName: COLLECTION
      });
      assert.deepEqual(collection.objectizer, restored);
    });
  });
});
