const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  UP, DOWN,
  Migration,
  initialize, partOf, nameBy, meta, constant, method, mixin,
} = LeanES.NS;

describe('Migration', () => {
  describe('.new', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should create migration instance', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_001';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = __dirname;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {}
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Migration'
      }, collection);
      assert.lengthOf(migration.steps, 0);
    });
  });
  describe('.createCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step for create collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_002';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.createCollection('collectionName', {
            prop: 'prop'
          });
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(function () {
      //   return this.createCollection('collectionName', {
      //     prop: 'prop'
      //   });
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: [
          'collectionName',
          {
            prop: 'prop'
          }
        ],
        method: 'createCollection'
      });
    });
  });
  describe('.createEdgeCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step for create edge collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_003';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.createEdgeCollection('collectionName1', 'collectionName2', {
            prop: 'prop'
          });
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: [
          'collectionName1',
          'collectionName2',
          {
            prop: 'prop'
          }
        ],
        method: 'createEdgeCollection'
      });
    });
  });
  describe('.addField', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to add field in record at collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_004';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.addField('collectionName', 'attr1', 'number');
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.addField('collectionName', 'attr1', 'number');
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: ['collectionName', 'attr1', 'number'],
        method: 'addField'
      });
    });
  });
  describe('.addIndex', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to add index in collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_005';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.addIndex('collectionName', ['attr1', 'attr2'], {
            type: "hash"
          });
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.addIndex('collectionName', ['attr1', 'attr2'], {
      //     type: "hash"
      //   });
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: [
          'collectionName',
          ['attr1',
            'attr2'],
          {
            type: "hash"
          }
        ],
        method: 'addIndex'
      });
    });
  });
  describe('.addTimestamps', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to add timesteps in collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_006';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.addTimestamps('collectionName', {
            prop: 'prop'
          });
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.addTimestamps('collectionName', {
      //     prop: 'prop'
      //   });
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: [
          'collectionName',
          {
            prop: 'prop'
          }
        ],
        method: 'addTimestamps'
      });
    });
  });
  describe('.changeCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to change collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_007';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.changeCollection('collectionName', {
            prop: 'prop'
          });
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.changeCollection('collectionName', {
      //     prop: 'prop'
      //   });
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: [
          'collectionName',
          {
            prop: 'prop'
          }
        ],
        method: 'changeCollection'
      });
    });
  });
  describe('.changeField', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to change field in collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_008';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.changeField('collectionName', 'attr1', 'string');
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.changeField('collectionName', 'attr1', 'string');
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: ['collectionName', 'attr1', 'string'],
        method: 'changeField'
      });
    });
  });
  describe('.renameField', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to rename field in collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_009';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.renameField('collectionName', 'oldAttrName', 'newAttrName');
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.renameField('collectionName', 'oldAttrName', 'newAttrName');
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: ['collectionName', 'oldAttrName', 'newAttrName'],
        method: 'renameField'
      });
    });
  });
  describe('.renameIndex', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to rename index in collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_010';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.renameIndex('collectionName', 'oldIndexname', 'newIndexName');
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.renameIndex('collectionName', 'oldIndexname', 'newIndexName');
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: ['collectionName', 'oldIndexname', 'newIndexName'],
        method: 'renameIndex'
      });
    });
  });
  describe('.renameCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to rename collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_011';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.renameCollection('oldCollectionName', 'newCollectionName');
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.renameCollection('oldCollectionName', 'newCollectionName');
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: ['oldCollectionName', 'newCollectionName'],
        method: 'renameCollection'
      });
    });
  });
  describe('.dropCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to drop collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_012';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.dropCollection('collectionName');
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.dropCollection('collectionName');
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: ['collectionName'],
        method: 'dropCollection'
      });
    });
  });
  describe('.dropEdgeCollection', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to drop edge collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_013';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.dropEdgeCollection('collectionName1', 'collectionName2');
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.dropEdgeCollection('collectionName1', 'collectionName2');
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: ['collectionName1', 'collectionName2'],
        method: 'dropEdgeCollection'
      });
    });
  });
  describe('.removeField', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to remove field in collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_014';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.removeField('collectionName', 'attr2');
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.removeField('collectionName', 'attr2');
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: ['collectionName', 'attr2'],
        method: 'removeField'
      });
    });
  });
  describe('.removeIndex', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to remove index in collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_015';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.removeIndex('collectionName', ['attr1', 'attr2'], {
      //     type: "hash",
      //     unique: true,
      //     sparse: false
      //   });
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: [
          'collectionName',
          ['attr1',
            'attr2'],
          {
            type: "hash",
            unique: true,
            sparse: false
          }
        ],
        method: 'removeIndex'
      });
    });
  });
  describe('.removeTimestamps', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add step to remove timestamps in collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_016';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.removeTimestamps('collectionName', {
            prop: 'prop'
          });
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(() => {
      //   this.removeTimestamps('collectionName', {
      //     prop: 'prop'
      //   });
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: [
          'collectionName',
          {
            prop: 'prop'
          }
        ],
        method: 'removeTimestamps'
      });
    });
  });
  describe('.reversible', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should add reversible step', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_017';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestsCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      const reversibleArg = async ({ up, down }) => {
        await up(async () => {});
        await down(async () => {});
      };

      @initialize
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          this.reversible(reversibleArg);
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // const reversibleArg = co.wrap(async function (dir) {
      //   await dir.up(co.wrap(async function () { }));
      //   await dir.down(co.wrap(async function () { }));
      // });
      // BaseMigration.change(() => {
      //   this.reversible(reversibleArg);
      // });
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.lengthOf(migration.steps, 1);
      assert.deepEqual(migration.steps[0], {
        args: [reversibleArg],
        method: 'reversible'
      });
    });
  });
  describe('#execute', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should run generator closure with some code', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_018';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestsCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      const spyExecute = sinon.spy(async function () { });

      @initialize
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {}

        // @method execute(...args) {
        //   spyExecute(...args);
        // }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.execute.call(migration, spyExecute);
      assert.isTrue(spyExecute.called);
    });
  });
  describe('.change', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should run closure with some code', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_019';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestsCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      const spyChange = sinon.spy(() => { });

      @initialize
      @partOf(Test)
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};

        @method static change() {
          spyChange()
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      // BaseMigration.change(spyChange);
      assert.isTrue(spyChange.called);
    });
  });
  describe('#up', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should run steps in forward direction', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_020';
      facade = LeanES.NS.Facade.getInstance(KEY);
      const spyReversibleUp = sinon.spy(async function () { });
      const spyCreateCollection = sinon.spy(async function () { });
      const spyAddField = sinon.spy(async function () { });

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.reversible(async function ({ up, down }) {
            await up(spyReversibleUp);
            await down(async () => {});
          });
          this.createCollection('TEST_COLLECTION');
          this.addField('collectionName', 'TEST_FIELD', 'number');
        }
        @method async createCollection(... args) {
          await spyCreateCollection(... args);
        }
        @method async addField(... args) {
          await spyAddField(... args);
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.up();
      assert.isTrue(spyReversibleUp.called);
      assert.isTrue(spyCreateCollection.calledAfter(spyReversibleUp));
      assert.isTrue(spyAddField.calledAfter(spyCreateCollection));
      assert.equal(spyCreateCollection.args[0][0], 'TEST_COLLECTION');
      assert.deepEqual(spyAddField.args[0], ['collectionName', 'TEST_FIELD', 'number']);
    });
  });
  describe('#down', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should run steps in backward direction', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_021';
      facade = LeanES.NS.Facade.getInstance(KEY);
      const spyReversibleDown = sinon.spy(async function () { });
      const spyDropCollection = sinon.spy(async function () { });
      const spyRenameIndex = sinon.spy(async function () { });
      const spyRemoveField = sinon.spy(async function () { });

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.reversible(async function ({ up, down }) {
            await up(async () => {});
            await down(spyReversibleDown);
          });
          this.createCollection('TEST_COLLECTION');
          this.addField('collectionName', 'TEST_FIELD', 'number');
          this.renameIndex('collectionName', 'TEST_INDEX_1', 'TEST_INDEX_2');
        }
        @method async dropCollection(... args) {
          await spyDropCollection(... args);
        }
        @method async renameIndex(... args) {
          await spyRenameIndex(... args);
        }
        @method async removeField(... args) {
          await spyRemoveField(... args);
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.down();
      assert.isTrue(spyRenameIndex.called);
      assert.isTrue(spyRemoveField.calledAfter(spyRenameIndex));
      assert.isTrue(spyDropCollection.calledAfter(spyRemoveField));
      assert.isTrue(spyReversibleDown.calledAfter(spyDropCollection));
      assert.equal(spyDropCollection.args[0][0], 'TEST_COLLECTION');
      assert.deepEqual(spyRemoveField.args[0], ['collectionName', 'TEST_FIELD']);
      assert.deepEqual(spyRenameIndex.args[0], ['collectionName', 'TEST_INDEX_2', 'TEST_INDEX_1']);
    });
  });
  describe('.up', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should replace forward stepping caller', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_022';
      facade = LeanES.NS.Facade.getInstance(KEY);
      const spyUp = sinon.spy(async function () { });

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static up() {
          return spyUp;
        }
        @method static down() {
          return async () => {}
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.isFalse(spyUp.called);
      await migration.up();
      assert.isTrue(spyUp.called);
    });
  });
  describe('.down', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should replace forward stepping caller', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_023';
      facade = LeanES.NS.Facade.getInstance(KEY);
      const spyDown = sinon.spy(async function () { });

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static up() {
          return async () => {}
        }
        @method static down() {
          return spyDown;
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      assert.isFalse(spyDown.called);
      await migration.down();
      assert.isTrue(spyDown.called);
    });
  });
  describe('#migrate', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should run steps in forward direction', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_024';
      facade = LeanES.NS.Facade.getInstance(KEY);
      const spyReversibleUp = sinon.spy(async function () { });
      const spyCreateCollection = sinon.spy(async function () { });
      const spyAddField = sinon.spy(async function () { });

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.reversible(async function ({ up, down }) {
            await up(spyReversibleUp);
            await down(async () => {});
          });
          this.createCollection('TEST_COLLECTION');
          this.addField('collectionName', 'TEST_FIELD', 'number');
        }
        @method async createCollection(... args) {
          await spyCreateCollection(... args);
        }
        @method async addField(... args) {
          await spyAddField(... args);
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.migrate(UP);
      assert.isTrue(spyReversibleUp.called);
      assert.isTrue(spyCreateCollection.calledAfter(spyReversibleUp));
      assert.isTrue(spyAddField.calledAfter(spyCreateCollection));
      assert.equal(spyCreateCollection.args[0][0], 'TEST_COLLECTION');
      assert.deepEqual(spyAddField.args[0], ['collectionName', 'TEST_FIELD', 'number']);
    });
    it('should run steps in backward direction', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_MIGRATION_025';
      facade = LeanES.NS.Facade.getInstance(KEY);
      const spyReversibleDown = sinon.spy(async function () { });
      const spyDropCollection = sinon.spy(async function () { });
      const spyRenameIndex = sinon.spy(async function () { });
      const spyRemoveField = sinon.spy(async function () { });

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
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
      class BaseMigration extends LeanES.NS.Migration {
        @nameBy static __filename = 'BaseMigration';
        @meta static object = {};
        @method static change() {
          this.reversible(async function ({ up, down }) {
            await up(async () => {});
            await down(spyReversibleDown);
          });
          this.createCollection('TEST_COLLECTION');
          this.addField('collectionName', 'TEST_FIELD', 'number');
          this.renameIndex('collectionName', 'TEST_INDEX_3', 'TEST_INDEX_4');
        }
        @method async dropCollection(... args) {
          await spyDropCollection(... args);
        }
        @method async renameIndex(... args) {
          await spyRenameIndex(... args);
        }
        @method async removeField(... args) {
          await spyRemoveField(... args);
        }
      }
      const collection = TestsCollection.new();
      collection.setName(collectionName);
      collection.setData({
        delegate: 'BaseMigration'
      });
      facade.registerProxy(collection);
      const migration = BaseMigration.new({
        type: 'Test::BaseMigration'
      }, collection);
      await migration.migrate(DOWN);
      assert.isTrue(spyRenameIndex.called);
      assert.isTrue(spyRemoveField.calledAfter(spyRenameIndex));
      assert.isTrue(spyDropCollection.calledAfter(spyRemoveField));
      assert.isTrue(spyReversibleDown.calledAfter(spyDropCollection));
      assert.equal(spyDropCollection.args[0][0], 'TEST_COLLECTION');
      assert.deepEqual(spyRemoveField.args[0], ['collectionName', 'TEST_FIELD']);
      assert.deepEqual(spyRenameIndex.args[0], ['collectionName', 'TEST_INDEX_4', 'TEST_INDEX_3']);
    });
  });
});
