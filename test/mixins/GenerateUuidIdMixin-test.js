const chai = require("chai");
const assert = chai.assert;
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, meta, plugin, mixin
} = LeanES.NS;

describe('GenerateUuidIdMixin', () => {
   describe('generateId', () => {
     it('should get generated ID', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static  __filename = 'TestRecord';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestCollection extends Test.NS.Collection {
        @nameBy static  __filename = 'TestCollection';
        @meta static object = {};
      }

      const collection = TestCollection.new('TEST_COLLECTION', {
        delegate: 'TestRecord'
      });
      const mask = /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-4[0-9a-fA-F]{3}\-[0-38-9a-fA-F][0-9a-fA-F]{3}\-[0-9a-fA-F]{12}$/;
      let j;
      for (let i = j = 1; j <= 1000; i = ++j) {
        assert.match(await collection.generateId(), mask);
      }
    });
  });
});
