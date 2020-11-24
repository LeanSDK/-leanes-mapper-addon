const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  Router,
  initialize, partOf, nameBy, meta, method, property, mixin, constant, plugin
} = LeanES.NS;

describe('Collection', () => {
  describe('.new', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should create collection instance', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_001';

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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.equal(collection._data.delegate, 'TestRecord', 'Record is incorrect');
      assert.deepEqual(collection.serializer.collectionName, collectionName, 'Serializer is incorrect');
      assert.deepEqual(collection.objectizer.collectionName, collectionName, 'Objectizer is incorrect');
    });
  });
  describe('.collectionName', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should get collection name', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_002';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.equal(collection.collectionName(), 'tests');
    });
  });
  describe('.collectionPrefix', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should get collection prefix', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_003';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.registerProxy(collection);
      assert.equal(collection.collectionPrefix(), 'test_');
    });
  });
  describe('.collectionFullName', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should get collection full name', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_004';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.equal(collection.collectionFullName(), 'test_tests');
    });
  });
  describe('.collectionFullName', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should get collection full name', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_005';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.equal(collection.collectionFullName(), 'test_tests');
    });
  });
  describe('.recordHasBeenChanged', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should send notification about record changed', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_006';
      const spyHandleNotitfication = sinon.spy(() => { });

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestMediator extends Test.NS.Mediator {
        @nameBy static __filename = 'TestMediator';
        @meta static object = {};
        @method listNotificationInterests() {
          return [Test.NS.RECORD_CHANGED];
        }
        @method handleNotification() {
          spyHandleNotitfication();
        }
      }
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.registerMediator(TestMediator.new('TEST_MEDIATOR', {}));
      collection.recordHasBeenChanged('createdRecord', TestRecord.new({
        test: 'test',
        type: 'TestRecord'
      }, collection));
      assert.isTrue(spyHandleNotitfication.called, 'Notification did not received');
    });
  });
  describe('.generateId', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should get dummy generated ID', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_006';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
        @method async generateId() {
          return 1;
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord'
      });
      const collection = facade.getProxy(collectionName);
      assert.equal(await collection.generateId(), 1, 'Generated ID is defined');
    });
  });
  describe('.build', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should create record from delegate', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_007';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};

        @attribute({ type: 'string' }) test = null;
        @attribute({ type: 'number' }) data = null;
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const record = await collection.build({
        test: 'test',
        data: 123
      });

      assert.equal(record.test, 'test', 'Record.test is incorrect');
      assert.equal(record.data, 123, 'Record.data is incorrect');
    });
  });
  describe('.create', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should create record in collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_008';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const spyCollectionPush = sinon.spy(collection, 'push');
      const record = await collection.create({
        test: 'test',
        data: 123
      });
      assert.isDefined(record, 'Record not created');
      assert.isTrue(spyCollectionPush.called, 'Record not saved');
    });
  });
  describe('.update', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should update record in collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_009';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const record = await collection.create({
        test: 'test',
        data: 123
      });
      record.data = 456;
      await record.update();
      assert.equal((await collection.find(record.id)).data, 456, 'Record not updated');
    });
  });
  describe('.delete', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should delete record from collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_011';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const record = await collection.create({
        test: 'test',
        data: 123
      });
      await record.delete();
      assert.isFalse((await collection.find(record.id)) != null, 'Record removed');
    });
  });
  describe('.destroy', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should destroy record from collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_011';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const record = await collection.create({
        test: 'test',
        data: 123
      });
      await record.destroy();
      assert.isFalse((await collection.find(record.id)) != null, 'Record removed');
    });
  });
  describe('.find', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should find record from collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_012';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }
      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const record = await collection.create({
        test: 'test',
        data: 123
      });
      const record2 = await collection.find(record.id);
      assert.equal(record.test, record2.test, 'Record not found');
    });
  });
  describe('findMany', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should find many records from collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_013';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const { id: id1 } = await collection.create({
        test: 'test1'
      });
      const { id: id2 } = await collection.create({
        test: 'test2'
      });
      const { id: id3 } = await collection.create({
        test: 'test3'
      });
      const records = await (await collection.findMany([id1, id2, id3])).toArray();
      assert.equal(records.length, 3, 'Found not the three records');
      assert.equal(records[0].test, 'test1', 'First record is incorrect');
      assert.equal(records[1].test, 'test2', 'Second record is incorrect');
      assert.equal(records[2].test, 'test3', 'Third record is incorrect');
    });
  });
  describe('.clone', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should make record copy with new id without save', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_014';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }
      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const original = await collection.build({
        test: 'test',
        data: 123
      });
      const clone = await collection.clone(original);
      assert.notEqual(original, clone, 'Record is not a copy but a reference');
      assert.equal(original.test, clone.test, '`test` values are different');
      assert.equal(original.data, clone.data, '`data` values are different');
      assert.notEqual(original.id, clone.id, '`id` values are the same');
    });
  });
  describe('.copy', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should make record copy with new id with save', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_015';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const original = await collection.build({
        test: 'test',
        data: 123
      });
      const clone = await collection.copy(original);
      assert.notEqual(original, clone, 'Record is not a copy but a reference');
      assert.equal(original.test, clone.test, '`test` values are different');
      assert.equal(original.data, clone.data, '`data` values are different');
      assert.notEqual(original.id, clone.id, '`id` values are the same');
    });
  });
  describe('.normalize', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should normalize record from data', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_COLLECTION_016';
      const spySerializerNormalize = sinon.spy();

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestSerializer extends Test.NS.Serializer {
        @nameBy static __filename = 'TestSerializer';
        @meta static object = {};

        @method async normalize(... args) {
          const result = await super.normalize(...args);
          spySerializerNormalize();
          return result;
        }
      }
      facade.bind('TestSerializer').to(TestSerializer);
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: 'TestSerializer',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const record = await collection.normalize({
        test: 'test',
        data: 123,
        type: 'TestRecord'
      });
      assert.isTrue(spySerializerNormalize.called, 'Normalize called improperly');
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
      const spySerializerSerialize = sinon.spy(async (aoRecord, options = null) => {
          const vcRecord = aoRecord.constructor;
          await vcRecord.serialize(aoRecord, options);
      });

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        @attribute({ type: 'number' }) data;
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestSerializer extends Test.NS.Serializer {
        @nameBy static __filename = 'TestSerializer';
        @meta static object = {};

        @method async serialize(... args) {
          return await spySerializerSerialize(... args)
        }
      }
      facade.bind('TestSerializer').to(TestSerializer);
      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: 'TestSerializer',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
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
