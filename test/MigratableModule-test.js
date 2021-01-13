const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const path = process.env.ENV === 'build' ? "../lib/index.dev" : "../src/index.js";
const MapperAddon = require(path).default;
const { MigratableModule, loadMigrations } = require(path);
const LeanES = require('@leansdk/leanes/src').default;
const FsUtilsAddon = require('@leansdk/leanes-fs-utils-addon/src').default;
const {
  initialize, partOf, nameBy, resolver, meta, mixin, constant, plugin
} = LeanES.NS;

describe('MigratableModule', () => {
  describe('.loadMigrations', () => {
    it('should load migration names in a folder', () => {

      @initialize
      @loadMigrations
      @plugin(MigratableModule)
      @plugin(MapperAddon)
      @plugin(FsUtilsAddon)
      @resolver(require, name => require(name))
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      Test.requireMigrations();
      assert.deepEqual(Test.NS.MIGRATION_NAMES, ['migration_1', 'migration_2', 'migration_3']);
      assert.instanceOf(Test.NS.Migration1.prototype, Test.NS.Migration);
      assert.instanceOf(Test.NS.Migration2.prototype, Test.NS.Migration);
      assert.instanceOf(Test.NS.Migration3.prototype, Test.NS.Migration);
    });
  });
});
