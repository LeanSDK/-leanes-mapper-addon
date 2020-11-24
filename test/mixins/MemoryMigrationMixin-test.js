const { Readable } = require('stream');
const EventEmitter = require('events');
const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const httpErrors = require('http-errors');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, meta, constant, mixin, method, plugin
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
        @mixin(Test.NS.GenerateUuidIdMixin)
        class MemoryCollection extends Test.NS.Collection {
          @nameBy static __filename = 'MemoryCollection';
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
        @mixin(Test.NS.MemoryMigrationMixin)
        class BaseMigration extends Test.NS.Migration {
          @nameBy static __filename = 'BaseMigration';
          @meta static object = {};
          @method static change() {}
        }
        facade.addProxy(collectionName, 'MemoryCollection', {
          delegate: 'BaseMigration',
          adapter: 'TestAdapter'
        })
        const collection = facade.getProxy(collectionName);
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.createCollection('TestsCollection');
        }
      }
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      })
      const collection = facade.getProxy(collectionName);
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.createEdgeCollection('TestsCollection1', 'TestsCollection2', {
            prop: 'prop'
          });
        }
      }
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      })
      const collection = facade.getProxy(collectionName);
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.addField('tests', 'test', {
            type: 'number',
            default: 'Test1'
          });
        }
      }
      facade.addAdapter('TestAdapter','TestAdapter');
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.addProxy('TestsCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const testsCollection = facade.getProxy('TestsCollection');
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.addIndex('collectionName', ['attr1', 'attr2'], {
            type: "hash"
          });
        }
      }
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.addTimestamps('tests');
        }
      }
      facade.addAdapter('TestAdapter','TestAdapter');
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.addProxy('TestsCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const testsCollection = facade.getProxy('TestsCollection');
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.changeCollection('collectionName', {
            prop: 'prop'
          });
        }
      }
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.changeField('tests', 'test', {
            type: Test.NS.SUPPORTED_TYPES.number
          });
        }
      }
      facade.addAdapter('TestAdapter','TestAdapter');
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.addProxy('TestsCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const testsCollection = facade.getProxy('TestsCollection');
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.renameField('tests', 'test', 'test1');
        }
      }
      facade.addAdapter('TestAdapter','TestAdapter');
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.addProxy('TestsCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const testsCollection = facade.getProxy('TestsCollection');
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.renameIndex('collectionName', 'oldIndexname', 'newIndexName');
        }
      }
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.renameCollection('oldCollectionName', 'newCollectionName');
        }
      }
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.dropCollection('tests');
        }
      }
      facade.addAdapter('TestAdapter','TestAdapter');
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.addProxy('TestsCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const testsCollection = facade.getProxy('TestsCollection');
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.dropEdgeCollection('Tests1', 'Tests2');
        }
      }
      facade.addAdapter('TestAdapter','TestAdapter');
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.addProxy('Tests1Tests2Collection', 'MemoryCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const testsCollection = facade.getProxy('Tests1Tests2Collection');
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
      assert.deepEqual(testsCollection.adapter._collection, {});
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.removeField('tests', 'test');
        }
      }
      facade.addAdapter('TestAdapter','TestAdapter');
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.addProxy('TestsCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const testsCollection = facade.getProxy('TestsCollection');
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
      const ref = testsCollection.adapter._collection;
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
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
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
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
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
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
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) 'test';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryMigrationMixin)
      class BaseMigration extends Test.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.removeTimestamps('tests');
        }
      }
      facade.addAdapter('TestAdapter','TestAdapter');
      facade.addProxy(collectionName, 'MemoryCollection', {
        delegate: 'BaseMigration',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      facade.addProxy('TestsCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const testsCollection = facade.getProxy('TestsCollection');
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
