const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const LeanES = require("../../../src/leanes/index.js").default;
const {
  Router,
  initialize, partOf, nameBy, meta, method, property, mixin, attribute, constant
} = LeanES.NS;

describe('Collection', () => {
  // let facade = null;
  // afterEach(() => {
  //   facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  // });
  // describe('.new', () => {
  //   it('should create collection instance', () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_001';
  //     facade = LeanES.NS.Facade.getInstance(KEY);

  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }

  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     assert.equal(collection._data.delegate, TestRecord, 'Record is incorrect');
  //     assert.deepEqual(collection.serializer, LeanES.NS.Serializer.new(collection), 'Serializer is incorrect');
  //     assert.deepEqual(collection.objectizer, LeanES.NS.Objectizer.new(collection), 'Objectizer is incorrect');
  //   });
  // });
  // describe('.collectionName', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should get collection name', () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_002';
  //     facade = LeanES.NS.Facade.getInstance(KEY);

  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }

  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     assert.equal(collection.collectionName(), 'tests');
  //   });
  // });
  // describe('.collectionPrefix', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should get collection prefix', () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_003';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     assert.equal(collection.collectionPrefix(), 'test_');
  //   });
  // });
  // describe('.collectionFullName', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should get collection full name', () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_004';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     assert.equal(collection.collectionFullName(), 'test_tests');
  //   });
  // });
  // describe('.recordHasBeenChanged', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should send notification about record changed', () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_005';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     const spyHandleNotitfication = sinon.spy(() => { });
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestMediator extends LeanES.NS.Mediator {
  //       @nameBy static __filename = 'TestMediator';
  //       @meta static object = {};
  //       @method listNotificationInterests() {
  //         return [LeanES.NS.RECORD_CHANGED];
  //       }
  //       @method handleNotification() {
  //         spyHandleNotitfication();
  //       }
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: 'TestRecord'
  //     });
  //     facade.registerProxy(collection);
  //     facade.registerMediator(TestMediator.new('TEST_MEDIATOR', {}));
  //     collection.recordHasBeenChanged('createdRecord', TestRecord.new({
  //       test: 'test',
  //       type: 'TestRecord'
  //     }, collection));
  //     assert.isTrue(spyHandleNotitfication.called, 'Notification did not received');
  //   });
  // });
  // describe('.generateId', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should get dummy generated ID', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_006';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }

  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: 'TestRecord'
  //     });
  //     facade.registerProxy(collection);
  //     assert.isUndefined(await collection.generateId(), 'Generated ID is defined');
  //   });
  // });
  describe('.build', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should create record from delegate', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_007';
      facade = LeanES.NS.Facade.getInstance(KEY);
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

        @attribute({ type: 'string' }) test = null;
        @attribute({ type: 'number' }) data = null;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestsCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }
      // const collection = TestsCollection.new(collectionName, {
      //   delegate: 'TestRecord'
      // });
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(collection);
      const record = await collection.build({
        test: 'test',
        data: 123
      });

      assert.equal(record.test, 'test', 'Record.test is incorrect');
      assert.equal(record.data, 123, 'Record.data is incorrect');
    });
  });
  // describe('.create', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should create record in collection', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_008';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     const spyCollectionPush = sinon.spy(collection, 'push');
  //     const record = await collection.create({
  //       test: 'test',
  //       data: 123
  //     });
  //     assert.isDefined(record, 'Record not created');
  //     assert.isTrue(spyCollectionPush.called, 'Record not saved');
  //   });
  // });
  // describe('.update', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should update record in collection', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_009';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //       @attribute({ type: 'string' }) test;
  //       @attribute({ type: 'number' }) data;
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     const record = await collection.create({
  //       test: 'test',
  //       data: 123
  //     });
  //     record.data = 456;
  //     await record.update();
  //     assert.equal((await collection.find(record.id)).data, 456, 'Record not updated');
  //   });
  // });
  // describe('.delete', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should delete record from collection', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_010';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //       @attribute({ type: 'string' }) test;
  //       @attribute({ type: 'number' }) data;
  //     }
  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     };
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     const record = await collection.create({
  //       test: 'test',
  //       data: 123
  //     });
  //     await record.delete();
  //     assert.isFalse(await record.isNew(), 'Record not saved');
  //     assert.isTrue(record.isHidden, 'Record not hidden');
  //   });
  // });
  // describe('.destroy', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should destroy record from collection', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_011';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //       @attribute({ type: 'string' }) test;
  //       @attribute({ type: 'number' }) data;
  //     }
  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     const record = await collection.create({
  //       test: 'test',
  //       data: 123
  //     });
  //     await record.destroy();
  //     assert.isFalse((await collection.find(record.id)) != null, 'Record removed');
  //   });
  // });
  // describe('.find', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should find record from collection', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_012';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //       @attribute({ type: 'string' }) test;
  //       @attribute({ type: 'number' }) data;
  //     }
  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     const record = await collection.create({
  //       test: 'test',
  //       data: 123
  //     });
  //     const record2 = await collection.find(record.id);
  //     assert.equal(record.test, record2.test, 'Record not found');
  //   });
  // });
  // describe('findMany', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should find many records from collection', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_013';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //       @attribute({ type: 'string' }) test;
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     const { id: id1 } = await collection.create({
  //       test: 'test1'
  //     });
  //     const { id: id2 } = await collection.create({
  //       test: 'test2'
  //     });
  //     const { id: id3 } = await collection.create({
  //       test: 'test3'
  //     });
  //     const records = await (await collection.findMany([id1, id2, id3])).toArray();
  //     assert.equal(records.length, 3, 'Found not the three records');
  //     assert.equal(records[0].test, 'test1', 'First record is incorrect');
  //     assert.equal(records[1].test, 'test2', 'Second record is incorrect');
  //     assert.equal(records[2].test, 'test3', 'Third record is incorrect');
  //   });
  // });
  // describe('.clone', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should make record copy with new id without save', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_014';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //       @attribute({ type: 'string' }) test;
  //       @attribute({ type: 'number' }) data;
  //     }
  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     const original = await collection.build({
  //       test: 'test',
  //       data: 123
  //     });
  //     const clone = await collection.clone(original);
  //     assert.notEqual(original, clone, 'Record is not a copy but a reference');
  //     assert.equal(original.test, clone.test, '`test` values are different');
  //     assert.equal(original.data, clone.data, '`data` values are different');
  //     assert.notEqual(original.id, clone.id, '`id` values are the same');
  //   });
  // });
  // describe('.copy', () => {
  //   let facade = null;
  //   afterEach(() => {
  //     facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
  //   });
  //   it('should make record copy with new id with save', async () => {
  //     const collectionName = 'TestsCollection';
  //     const KEY = 'TEST_COLLECTION_015';
  //     facade = LeanES.NS.Facade.getInstance(KEY);
  //     @initialize
  //     class Test extends LeanES {
  //       @nameBy static __filename = 'Test';
  //       @meta static object = {};
  //     }

  //     @initialize
  //     @partOf(Test)
  //     class TestRecord extends LeanES.NS.Record {
  //       @nameBy static __filename = 'TestRecord';
  //       @meta static object = {};
  //       @attribute({ type: 'string' }) test;
  //       @attribute({ type: 'number' }) data;
  //     }

  //     @initialize
  //     @mixin(LeanES.NS.MemoryCollectionMixin)
  //     @mixin(LeanES.NS.GenerateUuidIdMixin)
  //     @partOf(Test)
  //     class TestsCollection extends LeanES.NS.Collection {
  //       @nameBy static __filename = 'TestsCollection';
  //       @meta static object = {};
  //     }
  //     const collection = TestsCollection.new(collectionName, {
  //       delegate: TestRecord
  //     });
  //     facade.registerProxy(collection);
  //     const original = await collection.build({
  //       test: 'test',
  //       data: 123
  //     });
  //     const clone = await collection.copy(original);
  //     assert.notEqual(original, clone, 'Record is not a copy but a reference');
  //     assert.equal(original.test, clone.test, '`test` values are different');
  //     assert.equal(original.data, clone.data, '`data` values are different');
  //     assert.notEqual(original.id, clone.id, '`id` values are the same');
  //   });
  // });
  describe('.normalize', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should normalize record from data', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_016';
      facade = LeanES.NS.Facade.getInstance(KEY);
      const spySerializerNormalize = sinon.spy(async function (acRecord, ahPayload) {
        const self = this;
        await acRecord.normalize(ahPayload, self.collection);
      });
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
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestsCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestSerializer extends LeanES.NS.Serializer {
        @nameBy static __filename = 'TestSerializer';
        @meta static object = {};

        @method async normalize(... args) {
          return await spySerializerNormalize(... args)
        }
      }
      // const collection = TestsCollection.new(collectionName, {
      //   delegate: TestRecord,
      //   serializer: TestSerializer
      // });
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: TestRecord,
        serializer: TestSerializer
      });
      facade.registerProxy(collection);
      const record = await collection.normalize({
        test: 'test',
        data: 123,
        type: 'TestRecord'
      });
      assert.isTrue(spySerializerNormalize.calledWith(TestRecord, {
        test: 'test',
        data: 123,
        type: 'TestRecord'
      }), 'Normalize called improperly');
    });
  });
  describe('.serialize', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should serialize record to data', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_017';
      facade = LeanES.NS.Facade.getInstance(KEY);
      const spySerializerSerialize = sinon.spy(async (aoRecord, options = null) => {
          const vcRecord = aoRecord.constructor;
          await vcRecord.serialize(aoRecord, options);
      });
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
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }
      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestsCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestSerializer extends LeanES.NS.Serializer {
        @nameBy static __filename = 'TestSerializer';
        @meta static object = {};

        @method async serialize(... args) {
          return await spySerializerSerialize(... args)
        }
      }
      // const collection = TestsCollection.new(collectionName, {
      //   delegate: TestRecord,
      //   serializer: TestSerializer
      // });
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: TestRecord,
        serializer: TestSerializer
      });
      facade.registerProxy(collection);
      const record = await collection.build({
        test: 'test',
        data: 123
      });
      const data = await collection.serialize(record, {
        value: 'value'
      });
      assert.isTrue(spySerializerSerialize.calledWith(record, {
        value: 'value'
      }), 'Serialize called improperly');
    });
  });
});
