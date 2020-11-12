const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const EventEmitter = require('events');
const httpErrors = require('http-errors');
const LeanES = require("../../../src/leanes/index.js").default;
const {
  Resource,
  initialize, partOf, nameBy, meta, constant, mixin, property, method, attribute, resolver
} = LeanES.NS;

describe('MigrateCommand', () => {
  describe('.new', () => {
    it('should create new command', () => {
      const command = LeanES.NS.MigrateCommand.new();
      assert.instanceOf(command, LeanES.NS.MigrateCommand);
    });
  });
  describe('.initializeNotifier', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should initialize command', () => {
      const KEY = 'TEST_MIGRATE_COMMAND_001';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @property entityName = 'TestEntity';
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestMemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }
      const collection = TestMemoryCollection.new();
      collection.setName(LeanES.NS.MIGRATIONS);
      collection.setData({
        delegate: 'TestRecord',
        serializer: LeanES.NS.Serializer
      });
      facade.registerProxy(collection);
      const command = LeanES.NS.MigrateCommand.new();
      command.initializeNotifier(KEY);
      assert.equal(command.migrationsCollection, facade.retrieveProxy(LeanES.NS.MIGRATIONS));
      assert.isNotNull(command.migrationsCollection);
      assert.isDefined(command.migrationsCollection);
    });
  });
  describe('.migrationsDir', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get migrations directory path', () => {
      const KEY = 'TEST_MIGRATE_COMMAND_002';
      facade = LeanES.NS.Facade.getInstance(KEY);

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
      }

      @initialize
      @partOf(Test)
      class TestConfiguration extends LeanES.NS.Configuration {
        @nameBy static __filename = 'TestConfiguration';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestMemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }

      const collection = TestMemoryCollection.new();
      collection.setName(LeanES.NS.MIGRATIONS);
      collection.setData({
        delegate: 'TestRecord',
        serializer: LeanES.NS.Serializer
      });
      facade.registerProxy(collection);
      const configs = LeanES.NS.Configuration.new();
      configs.setName(LeanES.NS.CONFIGURATION);
      configs.setData(Test.NS.ROOT);
      facade.registerProxy(configs);
      const command = LeanES.NS.MigrateCommand.new();
      command.initializeNotifier(KEY);
      const { migrationsDir } = command;
      assert.equal(migrationsDir, `${Test.NS.ROOT}/migrations`);
    });
  });
  describe('.migrationNames', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get migration names', () => {
      const KEY = 'TEST_MIGRATE_COMMAND_003';
      facade = LeanES.NS.Facade.getInstance(KEY);

      const cphMigrationsMap = Symbol.for('~migrationsMap');

      @initialize
      @mixin(LeanES.NS.SchemaModuleMixin)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }

      Reflect.defineProperty(Test, cphMigrationsMap, {
        enumerable: true,
        writable: true,
        value: {
          '01_migration': `${__dirname}/config/root/migrations/01_migration`,
          '02_migration': `${__dirname}/config/root/migrations/02_migration`,
          '03_migration': `${__dirname}/config/root/migrations/03_migration`
        }
      });

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestMemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestCommand extends LeanES.NS.MigrateCommand {
        @nameBy static __filename = 'TestCommand';
        @meta static object = {};
      }

      const collection = TestMemoryCollection.new();
      collection.setName(LeanES.NS.MIGRATIONS);
      collection.setData({
        delegate: 'TestRecord',
        serializer: LeanES.NS.Serializer
      });
      facade.registerProxy(collection);
      const configs = LeanES.NS.Configuration.new();
      configs.setName(LeanES.NS.CONFIGURATION);
      configs.setData(Test.NS.ROOT);
      facade.registerProxy(configs);

      @initialize
      @partOf(Test)
      class ApplicationMediator extends LeanES.NS.Mediator {
        @nameBy static __filename = 'ApplicationMediator';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestApplication extends LeanES.NS.CoreObject {
        @nameBy static __filename = 'TestApplication';
        @meta static object = {};
      }
      const mediator = ApplicationMediator.new();
      mediator.setName(LeanES.NS.APPLICATION_MEDIATOR);
      mediator.setViewComponent(TestApplication.new());
      facade.registerMediator(mediator);
      const command = TestCommand.new();
      command.initializeNotifier(KEY);
      const migrationNames = command.migrationNames;

      assert.deepEqual(migrationNames, ['01_migration', '02_migration', '03_migration']);
    });
  });
  describe('.migrate', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should run migrations', async () => {
      const KEY = 'TEST_MIGRATE_COMMAND_004';
      const facade = LeanES.NS.Facade.getInstance(KEY);
      const cphMigrationsMap = Symbol.for('~migrationsMap');
      const defineMigration = function (Module) {
        @initialize
        @partOf(Module)
        class TestMigration extends LeanES.NS.Migration {
          @nameBy static __filename = 'TestMigration';
          @meta static object = {};
          @method static findRecordByName() {
            return TestMigration;
          }
          @method static change() {}
          constructor() {
            super(...arguments);
            this.type = 'Test::TestMigration';
          }
        }
      };

      @initialize
      @mixin(LeanES.NS.SchemaModuleMixin)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root2`;
      }
      defineMigration(Test.Module);

      Reflect.defineProperty(Test, cphMigrationsMap, {
        enumerable: true,
        writable: true,
        value: {
          '00000000000001_first_migration': `${__dirname}/config/root2/migrations/00000000000001_first_migration`,
          '00000000000002_second_migration': `${__dirname}/config/root2/migrations/00000000000002_second_migration`,
          '00000000000003_third_migration': `${__dirname}/config/root2/migrations/00000000000003_third_migration`
        }
      });
      Test.requireMigrations();

      @initialize
      @partOf(Test)
      class TestConfiguration extends LeanES.NS.Configuration {
        @nameBy static __filename = 'TestConfiguration';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestMemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestCommand extends LeanES.NS.MigrateCommand {
        @nameBy static __filename = 'TestCommand';
        @meta static object = {};
      }
      const collection = TestMemoryCollection.new();
      collection.setName(LeanES.NS.MIGRATIONS);
      collection.setData({
        delegate: Test.NS.TestMigration,
        serializer: LeanES.NS.Serializer
      });
      facade.registerProxy(collection);
      const configs = LeanES.NS.Configuration.new();
      configs.setName(LeanES.NS.CONFIGURATION);
      configs.setData(Test.NS.ROOT);
      facade.registerProxy(configs);

      @initialize
      @partOf(Test)
      class ApplicationMediator extends LeanES.NS.Mediator {
        @nameBy static __filename = 'ApplicationMediator';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestApplication extends LeanES.NS.CoreObject {
        @nameBy static __filename = 'TestApplication';
        @meta static object = {};
      }
      const mediator = ApplicationMediator.new();
      mediator.setName(LeanES.NS.APPLICATION_MEDIATOR);
      mediator.setViewComponent(TestApplication.new());
      facade.registerMediator(mediator);
      const command = TestCommand.new();
      command.initializeNotifier(KEY);
      const migrationNames = command.migrationNames;
      const untilName = '00000000000002_second_migration';
      await command.migrate({
        until: untilName
      });
      const collectionData = facade.retrieveProxy(LeanES.NS.MIGRATIONS)._collection;
      for (let i = 0; i < migrationNames.length; i++) {
        const migrationName = migrationNames[i];
        assert.property(collectionData, migrationName);
        if (migrationName === untilName) {
          break;
        }
      }
    });
  });
  describe('.execute', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should run migrations via "execute"', async () => {
      const KEY = 'TEST_MIGRATE_COMMAND_005';
      const facade = LeanES.NS.Facade.getInstance(KEY);
      const cphMigrationsMap = Symbol.for('~migrationsMap');
      const trigger = new EventEmitter();
      const defineMigration = function (Module) {
        @initialize
        @partOf(Module)
        class TestMigration extends LeanES.NS.Migration {
          @nameBy static __filename = 'TestMigration';
          @meta static object = {};
          @method static findRecordByName() {
            return Test.NS.TestMigration;
          }
          @method static change() {}
          constructor() {
            super(...arguments);
            this.type = 'Test::TestMigration';
          }
        }
      };

      @initialize
      @mixin(LeanES.NS.SchemaModuleMixin)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root2`;
      }
      defineMigration(Test.Module);

      Reflect.defineProperty(Test, cphMigrationsMap, {
        enumerable: true,
        writable: true,
        value: {
          '00000000000001_first_migration': `${__dirname}/config/root2/migrations/00000000000001_first_migration`,
          '00000000000002_second_migration': `${__dirname}/config/root2/migrations/00000000000002_second_migration`,
          '00000000000003_third_migration': `${__dirname}/config/root2/migrations/00000000000003_third_migration`
        }
      });
      Test.requireMigrations();

      @initialize
      @partOf(Test)
      class TestConfiguration extends LeanES.NS.Configuration {
        @nameBy static __filename = 'TestConfiguration';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class TestMemoryCollection extends LeanES.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestCommand extends LeanES.NS.MigrateCommand {
        @nameBy static __filename = 'TestCommand';
        @meta static object = {};
        @method async migrate(options) {
          const result = await super.migrate(options);
          trigger.emit('MIGRATE', options);
          return result;
        }
      }
      const collection = TestMemoryCollection.new();
      collection.setName(LeanES.NS.MIGRATIONS);
      collection.setData({
        delegate: Test.NS.TestMigration,
        serializer: LeanES.NS.Serializer
      });
      facade.registerProxy(collection);
      const configs = LeanES.NS.Configuration.new();
      configs.setName(LeanES.NS.CONFIGURATION);
      configs.setData(Test.NS.ROOT);
      facade.registerProxy(configs);

      @initialize
      @partOf(Test)
      class ApplicationMediator extends LeanES.NS.Mediator {
        @nameBy static __filename = 'ApplicationMediator';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestApplication extends LeanES.NS.CoreObject {
        @nameBy static __filename = 'TestApplication';
        @meta static object = {};
      }
      const mediator = ApplicationMediator.new();
      mediator.setName(LeanES.NS.APPLICATION_MEDIATOR);
      mediator.setViewComponent(TestApplication.new());
      facade.registerMediator(mediator);
      const command = TestCommand.new();
      command.initializeNotifier(KEY);
      const untilName = '00000000000002_second_migration';
      const promise = new Promise((resolve) => trigger.once('MIGRATE', resolve));
      await command.execute(LeanES.NS.Notification.new(LeanES.NS.MIGRATE, {
        until: untilName
      }));
      const options = await promise;
      assert.deepEqual(options, {
        until: untilName
      });
    });
  });
});
