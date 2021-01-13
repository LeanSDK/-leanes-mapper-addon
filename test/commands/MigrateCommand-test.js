const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const EventEmitter = require('events');
const httpErrors = require('http-errors');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const { MigratableModule, loadMigrations } = require(path);
const LeanES = require('@leansdk/leanes/src').default;
const FsUtilsAddon = require('@leansdk/leanes-fs-utils-addon/src').default;
const {
  initialize, partOf, nameBy, meta, constant, mixin, property, method, resolver, plugin,
} = LeanES.NS;

describe('MigrateCommand', () => {
  describe('.new', () => {
    it('should create new command', () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const command = Test.NS.MigrateCommand.new();
      assert.instanceOf(command, Test.NS.MigrateCommand);
    });
  });
  describe('.initializeNotifier', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should initialize command', () => {
      const KEY = 'TEST_MIGRATE_COMMAND_001';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};

        @method initializeFacade(): void {
          super.initializeFacade();
          this.rebind('ApplicationModule').toConstructor(this.Module);
          this.addCommand(Test.NS.MIGRATE, 'MigrateCommand')
        }
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
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
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestMemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }

      // @initialize
      // @partOf(Test)
      // @mixin(Test.NS.MemoryAdapterMixin)
      // class TestAdapter extends LeanES.NS.Adapter {
      //   @nameBy static __filename = 'TestAdapter';
      //   @meta static object = {};
      // }
      facade.addProxy(Test.NS.MIGRATIONS, 'TestMemoryCollection', {
        delegate: 'TestRecord',
        // serializer: Test.NS.Serializer,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.getProxy(Test.NS.MIGRATIONS);
      const command = facade.getCommand(Test.NS.MIGRATE);
      // command.initializeNotifier(KEY);
      assert.equal(command.migrationsCollection, facade.getProxy(Test.NS.MIGRATIONS));
      assert.isNotNull(command.migrationsCollection);
      assert.isDefined(command.migrationsCollection);
    });
  });
  describe('.migrationNames', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get migration names', () => {
      const KEY = 'TEST_MIGRATE_COMMAND_003';

      // const cphMigrationsMap = Symbol.for('~migrationsMap');

      @initialize
      @loadMigrations
      @plugin(MigratableModule)
      @plugin(MapperAddon)
      @plugin(FsUtilsAddon)
      // @plugin(MapperAddon)
      // @mixin(LeanES.NS.SchemaModuleMixin)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};

        @method initializeFacade(): void {
          super.initializeFacade();
          this.rebind('ApplicationModule').toConstructor(this.Module);
          this.addCommand(Test.NS.MIGRATE, 'MigrateCommand')
        }
      }
      facade = ApplicationFacade.getInstance(KEY);

      // Reflect.defineProperty(Test, cphMigrationsMap, {
      //   enumerable: true,
      //   writable: true,
      //   value: {
      //     '01_migration': `${__dirname}/config/root/migrations/01_migration`,
      //     '02_migration': `${__dirname}/config/root/migrations/02_migration`,
      //     '03_migration': `${__dirname}/config/root/migrations/03_migration`
      //   }
      // });

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestMemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }

      // @initialize
      // @partOf(Test)
      // @mixin(Test.NS.MemoryAdapterMixin)
      // class TestAdapter extends LeanES.NS.Adapter {
      //   @nameBy static __filename = 'TestAdapter';
      //   @meta static object = {};
      // }

      // @initialize
      // @partOf(Test)
      // class TestCommand extends Test.NS.MigrateCommand {
      //   @nameBy static __filename = 'TestCommand';
      //   @meta static object = {};
      // }
      facade.addProxy(Test.NS.MIGRATIONS, 'TestMemoryCollection', {
        delegate: 'TestRecord',
        // serializer: Test.NS.Serializer,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.getProxy(Test.NS.MIGRATIONS);

      // @initialize
      // @partOf(Test)
      // class ApplicationMediator extends Test.NS.Mediator {
      //   @nameBy static __filename = 'ApplicationMediator';
      //   @meta static object = {};
      // }
      //
      // @initialize
      // @partOf(Test)
      // class TestApplication extends Test.NS.CoreObject {
      //   @nameBy static __filename = 'TestApplication';
      //   @meta static object = {};
      // }
      // const mediator = ApplicationMediator.new();
      // mediator.setName(Test.NS.APPLICATION_MEDIATOR);
      // mediator.setViewComponent(TestApplication.new());
      // facade.registerMediator(mediator);
      const command = facade.getCommand(Test.NS.MIGRATE);
      // const command = TestCommand.new();
      // command.initializeNotifier(KEY);
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
      // const cphMigrationsMap = Symbol.for('~migrationsMap');
      // const defineMigration = function (Module) {
      //
      //   @initialize
      //   @partOf(Module)
      //   class TestMigration extends Test.NS.Migration {
      //     @nameBy static __filename = 'TestMigration';
      //     @meta static object = {};
      //     @method static findRecordByName() {
      //       return TestMigration;
      //     }
      //     @method static change() {}
      //     constructor() {
      //       super(...arguments);
      //       this.type = 'Test::TestMigration';
      //     }
      //   }
      // };

      @initialize
      @loadMigrations
      @plugin(MigratableModule)
      @plugin(MapperAddon)
      @plugin(FsUtilsAddon)
      // @plugin(MapperAddon)
      // @mixin(LeanES.NS.SchemaModuleMixin)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root2`;
      }

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};

        @method initializeFacade(): void {
          super.initializeFacade();
          this.rebind('ApplicationModule').toConstructor(this.Module);
          this.addCommand(Test.NS.MIGRATE, 'MigrateCommand')
        }
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestMigration extends Test.NS.Migration {
        @nameBy static __filename = 'TestMigration';
        @meta static object = {};
        // @method static findRecordByName() {
        //   return TestMigration;
        // }
        @method static change() {}
        // constructor() {
        //   super(...arguments);
        //   this.type = 'Test::TestMigration';
        // }
      }

      // Reflect.defineProperty(Test, cphMigrationsMap, {
      //   enumerable: true,
      //   writable: true,
      //   value: {
      //     '00000000000001_first_migration': `${__dirname}/config/root2/migrations/00000000000001_first_migration`,
      //     '00000000000002_second_migration': `${__dirname}/config/root2/migrations/00000000000002_second_migration`,
      //     '00000000000003_third_migration': `${__dirname}/config/root2/migrations/00000000000003_third_migration`
      //   }
      // });
      // Test.requireMigrations();

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestMemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }

      // @initialize
      // @partOf(Test)
      // @mixin(Test.NS.MemoryAdapterMixin)
      // class TestAdapter extends LeanES.NS.Adapter {
      //   @nameBy static __filename = 'TestAdapter';
      //   @meta static object = {};
      // }

      // @initialize
      // @partOf(Test)
      // class TestCommand extends Test.NS.MigrateCommand {
      //   @nameBy static __filename = 'TestCommand';
      //   @meta static object = {};
      // }
      facade.addProxy(Test.NS.MIGRATIONS, 'TestMemoryCollection', {
        delegate: 'TestMigration',
        // serializer: 'Serializer',
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.getProxy(Test.NS.MIGRATIONS);

      // @initialize
      // @partOf(Test)
      // class ApplicationMediator extends Test.NS.Mediator {
      //   @nameBy static __filename = 'ApplicationMediator';
      //   @meta static object = {};
      // }

      // @initialize
      // @partOf(Test)
      // class TestApplication extends Test.NS.CoreObject {
      //   @nameBy static __filename = 'TestApplication';
      //   @meta static object = {};
      // }
      // const mediator = ApplicationMediator.new();
      // mediator.setName(Test.NS.APPLICATION_MEDIATOR);
      // mediator.setViewComponent(TestApplication.new());
      // facade.registerMediator(mediator);
      const command = facade.getCommand(Test.NS.MIGRATE);
      // const command = TestCommand.new();
      // command.initializeNotifier(KEY);
      const migrationNames = command.migrationNames;
      const untilName = '00000000000002_second_migration';
      await command.migrate({
        until: untilName
      });
      const collectionData = facade.getProxy(Test.NS.MIGRATIONS).adapter._collection;
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
      // const facade = LeanES.NS.Facade.getInstance(KEY);
      // const cphMigrationsMap = Symbol.for('~migrationsMap');
      const trigger = new EventEmitter();
      // const defineMigration = function (Module) {
      //   @initialize
      //   @partOf(Module)
      //   class TestMigration extends Test.NS.Migration {
      //     @nameBy static __filename = 'TestMigration';
      //     @meta static object = {};
      //     @method static findRecordByName() {
      //       return Test.NS.TestMigration;
      //     }
      //     @method static change() {}
      //     constructor() {
      //       super(...arguments);
      //       this.type = 'Test::TestMigration';
      //     }
      //   }
      // };

      @initialize
      @loadMigrations
      @plugin(MigratableModule)
      @plugin(MapperAddon)
      @plugin(FsUtilsAddon)
      // @plugin(MapperAddon)
      // @mixin(LeanES.NS.SchemaModuleMixin)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root2`;
      }
      // defineMigration(Test.Module);

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};

        @method initializeFacade(): void {
          super.initializeFacade();
          this.rebind('ApplicationModule').toConstructor(this.Module);
          this.addCommand(Test.NS.MIGRATE, 'TestCommand')
        }
      }
      facade = ApplicationFacade.getInstance(KEY);

      // Reflect.defineProperty(Test, cphMigrationsMap, {
      //   enumerable: true,
      //   writable: true,
      //   value: {
      //     '00000000000001_first_migration': `${__dirname}/config/root2/migrations/00000000000001_first_migration`,
      //     '00000000000002_second_migration': `${__dirname}/config/root2/migrations/00000000000002_second_migration`,
      //     '00000000000003_third_migration': `${__dirname}/config/root2/migrations/00000000000003_third_migration`
      //   }
      // });
      // Test.requireMigrations();

      @initialize
      @partOf(Test)
      class TestMigration extends Test.NS.Migration {
        @nameBy static __filename = 'TestMigration';
        @meta static object = {};
        // @method static findRecordByName() {
        //   return Test.NS.TestMigration;
        // }
        @method static change() {}
        // constructor() {
        //   super(...arguments);
        //   this.type = 'Test::TestMigration';
        // }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestMemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestMemoryCollection';
        @meta static object = {};
      }

      // @initialize
      // @partOf(Test)
      // @mixin(Test.NS.MemoryAdapterMixin)
      // class TestAdapter extends LeanES.NS.Adapter {
      //   @nameBy static __filename = 'TestAdapter';
      //   @meta static object = {};
      // }

      @initialize
      @partOf(Test)
      class TestCommand extends Test.NS.MigrateCommand {
        @nameBy static __filename = 'TestCommand';
        @meta static object = {};
        @method async migrate(options) {
          const result = await super.migrate(options);
          trigger.emit('MIGRATE', options);
          return result;
        }
      }

      facade.addProxy(Test.NS.MIGRATIONS, 'TestMemoryCollection', {
        delegate: 'TestMigration',
        // serializer: 'Serializer',
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.getProxy(Test.NS.MIGRATIONS);

      // @initialize
      // @partOf(Test)
      // class ApplicationMediator extends Test.NS.Mediator {
      //   @nameBy static __filename = 'ApplicationMediator';
      //   @meta static object = {};
      // }

      // @initialize
      // @partOf(Test)
      // class TestApplication extends Test.NS.CoreObject {
      //   @nameBy static __filename = 'TestApplication';
      //   @meta static object = {};
      // }
      // const mediator = ApplicationMediator.new();
      // mediator.setName(Test.NS.APPLICATION_MEDIATOR);
      // mediator.setViewComponent(TestApplication.new());
      // facade.registerMediator(mediator);
      const command = facade.getCommand(Test.NS.MIGRATE);
      // const command = TestCommand.new();
      // command.initializeNotifier(KEY);
      const untilName = '00000000000002_second_migration';
      const promise = new Promise((resolve) => trigger.once('MIGRATE', resolve));
      await command.execute(Test.NS.Notification.new(Test.NS.MIGRATE, {
        until: untilName
      }));
      const options = await promise;
      assert.deepEqual(options, {
        until: untilName
      });
    });
  });
});
