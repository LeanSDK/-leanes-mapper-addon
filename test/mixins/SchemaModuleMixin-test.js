const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const LeanES = require("../../../src/leanes/index.js").default;
const {
  initialize, partOf, nameBy, resolver, meta, attribute, mixin, constant
} = LeanES.NS;

describe('SchemaModuleMixin', () => {
  describe('.defineMigrations', () => {
    it('should create configuration instance', () => {

      const cphMigrationsMap = Symbol.for('~migrationsMap');

      @initialize
      @mixin(LeanES.NS.SchemaModuleMixin)
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
      assert.instanceOf(Test.NS.Migration1.prototype, LeanES.NS.Migration);
      assert.instanceOf(Test.NS.Migration2.prototype, LeanES.NS.Migration);
      assert.instanceOf(Test.NS.Migration3.prototype, LeanES.NS.Migration);
    });
  });
});
