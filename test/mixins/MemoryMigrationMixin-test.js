const { Readable } = require('stream');
const EventEmitter = require('events');
const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const httpErrors = require('http-errors');
const LeanES = require("../../../src/leanes/index.js").default;
const {
  initialize, partOf, nameBy, meta, constant, mixin, method, attribute
} = LeanES.NS;

const hasProp = {}.hasOwnProperty;

describe('MemoryMigrationMixin', () => {
  describe('.new', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should create migration instance', () => {
      expect(() => {
        const collectionName = 'MigrationsCollection';
        const KEY = 'TEST_MEMORY_MIGRATION_001';
        facade = LeanES.NS.Facade.getInstance(KEY);

        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
          @constant ROOT = `${__dirname}/config/root/migrations`;
        }

        @initialize
        @mixin(LeanES.NS.MemoryCollectionMixin)
        @mixin(LeanES.NS.GenerateUuidIdMixin)
        @partOf(Test)
        class MemoryCollection extends LeanES.NS.Collection {
          @nameBy static __filename = 'MemoryCollection';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.MemoryMigrationMixin)
        @partOf(Test)
        class BaseMigration extends LeanES.NS.Migration {
          @nameBy static __filename = 'BaseMigration';
          @meta static object = {};
          @method static change() {}
        }
        const collection = MemoryCollection.new();
        collection.setName(collectionName);
        collection.setData({
          delegate: 'BaseMigration'
        });
        facade.registerProxy(collection);
        const migration = BaseMigration.new({
          type: 'Test::BaseMigration'
        }, collection);
      }).to.not.throw(Error);
    });
  });
  describe('.createCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step for create collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_002';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.createCollection('TestsCollection');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      const spyCreateCollection = sinon.spy(migration, 'createCollection');
      await migration.up();
      assert.isTrue(spyCreateCollection.calledWith('TestsCollection'));
    });
  });
  describe('.createEdgeCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step for create edge collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_003';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.createEdgeCollection('TestsCollection1', 'TestsCollection2', {
            prop: 'prop'
          });
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      const spyCreateCollection = sinon.spy(migration, 'createEdgeCollection');
      await migration.up();
      assert.isTrue(spyCreateCollection.calledWith('TestsCollection1', 'TestsCollection2', {
        prop: 'prop'
      }));
    });
  });
  describe('.addField', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to add field in record at collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_004';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.addField('tests', 'test', {
            type: 'number',
            default: 'Test1'
          });
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const testsCollection = MemoryCollection.new();
      testsCollection.setName('TestsCollection');
      testsCollection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(testsCollection);
      await testsCollection.create({
        id: 1
      });
      await testsCollection.create({
        id: 2
      });
      await testsCollection.create({
        id: 3
      });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.up();
      const ref = testsCollection._collection;
      for (const id in ref) {
        if (!hasProp.call(ref, id)) continue;
        const doc = ref[id];
        assert.propertyVal(doc, 'test', 'Test1');
      }
    });
  });
  describe('.addIndex', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to add index in collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_005';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.addIndex('collectionName', ['attr1', 'attr2'], {
            type: "hash"
          });
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      const spyAddIndex = sinon.spy(migration, 'addIndex');
      await migration.up();
      assert.isTrue(spyAddIndex.calledWith('collectionName', ['attr1', 'attr2'], {
        type: "hash"
      }));
    });
  });
  describe('.addTimestamps', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to add timesteps in collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_006';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.addTimestamps('tests');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const testsCollection = MemoryCollection.new();
      testsCollection.setName('TestsCollection');
      testsCollection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(testsCollection);
      await testsCollection.create({
        id: 1
      });
      await testsCollection.create({
        id: 2
      });
      await testsCollection.create({
        id: 3
      });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.up();
      const ref = testsCollection._collection;
      for (const id in ref) {
        if (!hasProp.call(ref, id)) continue;
        const doc = ref[id];
        assert.property(doc, 'createdAt');
        assert.property(doc, 'updatedAt');
        assert.property(doc, 'updatedAt');
      }
    });
  });
  describe('.changeCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to change collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_007';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.changeCollection('collectionName', {
            prop: 'prop'
          });
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      const spyChangeCollection = sinon.spy(migration, 'changeCollection');
      await migration.up();
      assert.isTrue(spyChangeCollection.calledWith('collectionName', {
        prop: 'prop'
      }));
    });
  });
  describe('.changeField', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to change field in collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_008';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.changeField('tests', 'test', {
            type: LeanES.NS.SUPPORTED_TYPES.number
          });
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const testsCollection = MemoryCollection.new();
      testsCollection.setName('TestsCollection');
      testsCollection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(testsCollection);
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.up();
      const ref = testsCollection._collection;
      for (const id in ref) {
        if (!hasProp.call(ref, id)) continue;
        const doc = ref[id];
        assert.propertyVal(doc, 'test', 42);
      }
    });
  });
  describe('.renameField', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to rename field in collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_009';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.renameField('tests', 'test', 'test1');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const testsCollection = MemoryCollection.new();
      testsCollection.setName('TestsCollection');
      testsCollection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(testsCollection);
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.up();
      const ref = testsCollection._collection;
      for (const id in ref) {
        if (!hasProp.call(ref, id)) continue;
        const doc = ref[id];
        assert.notProperty(doc, 'test');
        assert.property(doc, 'test1');
        assert.propertyVal(doc, 'test1', '42');
      }
    });
  });
  describe('.renameIndex', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to rename index in collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_010';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.renameIndex('collectionName', 'oldIndexname', 'newIndexName');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      const spyRenameIndex = sinon.spy(migration, 'renameIndex');
      await migration.up();
      assert.isTrue(spyRenameIndex.calledWith('collectionName', 'oldIndexname', 'newIndexName'));
    });
  });
  describe('.renameCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to rename collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_011';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.renameCollection('oldCollectionName', 'newCollectionName');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      const spyRenameCollection = sinon.spy(migration, 'renameCollection');
      await migration.up();
      assert.isTrue(spyRenameCollection.calledWith('oldCollectionName', 'newCollectionName'));
    });
  });
  describe('.dropCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to drop collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_012';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.dropCollection('tests');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const testsCollection = MemoryCollection.new();
      testsCollection.setName('TestsCollection');
      testsCollection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(testsCollection);
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.up();
      assert.deepEqual(testsCollection._collection, {});
    });
  });
  describe('.dropEdgeCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to drop edge collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_013';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.dropEdgeCollection('Tests1', 'Tests2');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const testsCollection = MemoryCollection.new();
      testsCollection.setName('Tests1Tests2Collection');
      testsCollection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(testsCollection);
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.up();
      assert.deepEqual(testsCollection._collection, {});
    });
  });
  describe('.removeField', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to remove field in collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_014';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.removeField('tests', 'test');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const testsCollection = MemoryCollection.new();
      testsCollection.setName('TestsCollection');
      testsCollection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(testsCollection);
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      await testsCollection.create({
        test: '42'
      });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.up();
      const ref = testsCollection._collection;
      for (const id in ref) {
        if (!hasProp.call(ref, id)) continue;
        const doc = ref[id];
        assert.notProperty(doc, 'test');
      }
    });
  });
  describe('.removeIndex', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to remove index in collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_015';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.removeIndex('collectionName', ['attr1', 'attr2'], {
            type: "hash",
            unique: true,
            sparse: false
          });
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      const spyRemoveIndex = sinon.spy(migration, 'removeIndex');
      await migration.up();
      assert.isTrue(spyRemoveIndex.calledWith('collectionName', ['attr1', 'attr2'], {
        type: "hash",
        unique: true,
        sparse: false
      }));
    });
  });
  return describe('.removeTimestamps', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should apply step to remove timestamps in collection', async () => {
      const collectionName = 'MigrationsCollection';
      const KEY = 'TEST_MEMORY_MIGRATION_016';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root/migrations`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @mixin(LeanES.NS.MemoryMigrationMixin)
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.removeTimestamps('tests');
        }
      }
      const collection = MemoryCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const testsCollection = MemoryCollection.new();
      testsCollection.setName('TestsCollection');
      testsCollection.setData({
        delegate: 'TestRecord'
      });
      facade.registerProxy(testsCollection);
      const DATE = new Date();
      await testsCollection.create({
        test: '42',
        createdAt: DATE
      });
      await testsCollection.create({
        test: '42',
        createdAt: DATE
      });
      await testsCollection.create({
        test: '42',
        createdAt: DATE
      });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      const ref = testsCollection[Symbol.for('~collection')];
      for (const id in ref) {
        if (!hasProp.call(ref, id)) continue;
        const doc = ref[id];
        assert.property(doc, 'createdAt');
        assert.property(doc, 'updatedAt');
        assert.property(doc, 'deletedAt');
      }
      await migration.up();
      const ref1 = testsCollection[Symbol.for('~collection')];
      for (const id in ref1) {
        if (!hasProp.call(ref1, id)) continue;
        const doc = ref1[id];
        assert.notProperty(doc, 'createdAt');
        assert.notProperty(doc, 'updatedAt');
        assert.notProperty(doc, 'deletedAt');
      }
    });
  });
});
