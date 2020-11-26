const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, resolver, meta, mixin, constant, plugin
} = LeanES.NS;

describe('SchemaModuleMixin', () => {
  describe('.defineMigrations', () => {
    it('should create configuration instance', () => {

      const cphMigrationsMap = Symbol.for('~migrationsMap');

      @initialize
      @plugin(MapperAddon)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }

      Reflect.defineProperty(Test, cphMigrationsMap, {
        enumerable: true,
        writable: true,
        value: {
          'migration_1': `${__dirname}/config/root/migrations/migration_1`,
          'migration_2': `${__dirname}/config/root/migrations/migration_2`,
          'migration_3': `${__dirname}/config/root/migrations/migration_3`
        }
      });
      Test.requireMigrations();
      assert.deepEqual(Test.NS.MIGRATION_NAMES, ['migration_1', 'migration_2', 'migration_3']);
      assert.instanceOf(Test.NS.Migration1.prototype, Test.NS.Migration);
      assert.instanceOf(Test.NS.Migration2.prototype, Test.NS.Migration);
      assert.instanceOf(Test.NS.Migration3.prototype, Test.NS.Migration);
    });
  });
});
