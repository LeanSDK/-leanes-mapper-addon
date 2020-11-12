const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const _ = require('lodash');
const LeanES = require("../../../src/leanes/index.js").default;
const {
  initialize, partOf, nameBy, resolver, meta, attribute, mixin, constant, method, property
} = LeanES.NS;

describe('IterableMixin', () => {
  describe('.new', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should create iterable instance', async () => {
      const KEY = 'TEST_ITERABLE_MIXIN_001';
      facade = LeanES.NS.Facade.getInstance(KEY);
      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static  __filename = 'TestRecord';
        @meta static object = {};
        @attribute({type: 'string'}) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }

      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.IterableMixin)
      @partOf(Test)
      class Iterable extends LeanES.NS.Collection {
        @nameBy static  __filename = 'Iterable';
        @meta static object = {};
        @property delegate = TestRecord;
        @method async takeAll() {
          return await Promise.resolve(LeanES.NS.Cursor.new(this, this.getData()));
        }
      }
      const array = [{}, {}, {}];
      const collectionName = 'TestsCollection';
      // const collection = Iterable.new(collectionName, array);
      const collection = Iterable.new();
      collection.setName(collectionName);
      collection.setData(array);
      facade.registerProxy(collection);
      const iterable = facade.retrieveProxy(collectionName);
      const cursor = await iterable.takeAll();
      assert.equal(await cursor.count(), 3, 'Records length does not match');
    });
  });
  describe('.forEach', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should call lambda in each record in iterable', async () => {
      const KEY = 'TEST_ITERABLE_MIXIN_002';
      facade = LeanES.NS.Facade.getInstance(KEY);
      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }
      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static  __filename = 'TestRecord';
        @meta static object = {};
        @attribute({type: 'string'}) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }
      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.IterableMixin)
      @partOf(Test)
      class Iterable extends LeanES.NS.Collection {
        @nameBy static  __filename = 'Iterable';
        @meta static object = {};
        @property delegate = TestRecord;
        @method async takeAll() {
          return await Promise.resolve(LeanES.NS.Cursor.new(this, this.getData()));
        }
      }
      const array = [
        {
          test: 'three',
          type: 'TestRecord'
        },
        {
          test: 'men',
          type: 'TestRecord'
        },
        {
          test: 'in',
          type: 'TestRecord'
        },
        {
          test: 'a boat',
          type: 'TestRecord'
        }
      ];
      const collectionName = 'TestsCollection';
      // const collection = Iterable.new(collectionName, array);
      const collection = Iterable.new();
      collection.setName(collectionName);
      collection.setData(array);
      facade.registerProxy(collection);
      const iterable = facade.retrieveProxy(collectionName);
      const spyLambda = sinon.spy(async () => {});
      await iterable.forEach(spyLambda);
      assert.isTrue(spyLambda.called, 'Lambda never called');
      assert.equal(spyLambda.callCount, 4, 'Lambda calls are not match');
      assert.equal(spyLambda.args[0][0].test, 'three', 'Lambda 1st call is not match');
      assert.equal(spyLambda.args[1][0].test, 'men', 'Lambda 2nd call is not match');
      assert.equal(spyLambda.args[2][0].test, 'in', 'Lambda 3rd call is not match');
      assert.equal(spyLambda.args[3][0].test, 'a boat', 'Lambda 4th call is not match');
    });
  });
  describe('.map', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should map records using lambda', async () => {
      const KEY = 'TEST_ITERABLE_MIXIN_003';
      facade = LeanES.NS.Facade.getInstance(KEY);
      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }
      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static  __filename = 'TestRecord';
        @meta static object = {};
        @attribute({type: 'string'}) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }
      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.IterableMixin)
      @partOf(Test)
      class Iterable extends LeanES.NS.Collection {
        @nameBy static  __filename = 'Iterable';
        @meta static object = {};
        @property delegate = TestRecord;
        @method async takeAll() {
          return await Promise.resolve(LeanES.NS.Cursor.new(this, this.getData()));
        }
      }
      const array = [
        {
          test: 'three',
          type: 'TestRecord'
        },
        {
          test: 'men',
          type: 'TestRecord'
        },
        {
          test: 'in',
          type: 'TestRecord'
        },
        {
          test: 'a boat',
          type: 'TestRecord'
        }
      ];
      const collectionName = 'TestsCollection';
      // const collection = Iterable.new(collectionName, array);
      const collection = Iterable.new();
      collection.setName(collectionName);
      collection.setData(array);
      facade.registerProxy(collection);
      const iterable = facade.retrieveProxy(collectionName);
      const records = await iterable.map(async (record) => {
        record.test = '+' + record.test + '+';
        return await Promise.resolve(record);
      });
      assert.lengthOf(records, 4, 'Records count is not match');
      assert.equal(records[0].test, '+three+', '1st record is not match');
      assert.equal(records[1].test, '+men+', '2nd record is not match');
      assert.equal(records[2].test, '+in+', '3rd record is not match');
      assert.equal(records[3].test, '+a boat+', '4th record is not match');
    });
  });
  describe('.filter', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should filter records using lambda', async () => {
      const KEY = 'TEST_ITERABLE_MIXIN_004';
      facade = LeanES.NS.Facade.getInstance(KEY);
      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }
      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static  __filename = 'TestRecord';
        @meta static object = {};
        @attribute({type: 'string'}) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }
      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.IterableMixin)
      @partOf(Test)
      class Iterable extends LeanES.NS.Collection {
        @nameBy static  __filename = 'Iterable';
        @meta static object = {};
        @property delegate = TestRecord;
        @method async takeAll() {
          return await Promise.resolve(LeanES.NS.Cursor.new(this, this.getData()));
        }
      }
      const array = [
        {
          test: 'three',
          type: 'TestRecord'
        },
        {
          test: 'men',
          type: 'TestRecord'
        },
        {
          test: 'in',
          type: 'TestRecord'
        },
        {
          test: 'a boat',
          type: 'TestRecord'
        }
      ];
      const collectionName = 'TestsCollection';
      // const collection = Iterable.new(collectionName, array);
      const collection = Iterable.new();
      collection.setName(collectionName);
      collection.setData(array);
      facade.registerProxy(collection);
      const iterable = facade.retrieveProxy(collectionName);
      const records = await iterable.filter(async (record) => {
        return await Promise.resolve(record.test.length > 3);
      });
      assert.lengthOf(records, 2, 'Records count is not match');
      assert.equal(records[0].test, 'three', '1st record is not match');
      assert.equal(records[1].test, 'a boat', '2nd record is not match');
    });
  });
  describe('.reduce', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should reduce records using lambda', async () => {
      const KEY = 'TEST_ITERABLE_MIXIN_005';
      facade = LeanES.NS.Facade.getInstance(KEY);
      @initialize
      class Test extends LeanES {
        @nameBy static  __filename = 'Test';
        @meta static object = {};
      }
      @initialize
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static  __filename = 'TestRecord';
        @meta static object = {};
        @attribute({type: 'string'}) test;
        constructor() {
          super(...arguments);
          this.type = 'TestRecord';
        }
      }
      @initialize
      @mixin(LeanES.NS.MemoryCollectionMixin)
      @mixin(LeanES.NS.IterableMixin)
      @partOf(Test)
      class Iterable extends LeanES.NS.Collection {
        @nameBy static  __filename = 'Iterable';
        @meta static object = {};
        @property delegate = TestRecord;
        @method async takeAll() {
          return await Promise.resolve(LeanES.NS.Cursor.new(this, this.getData()));
        }
      }
      const array = [
        {
          test: 'three',
          type: 'TestRecord'
        },
        {
          test: 'men',
          type: 'TestRecord'
        },
        {
          test: 'in',
          type: 'TestRecord'
        },
        {
          test: 'a boat',
          type: 'TestRecord'
        }
      ];
      const collectionName = 'TestsCollection';
      // const collection = Iterable.new(collectionName, array);
      const collection = Iterable.new();
      collection.setName(collectionName);
      collection.setData(array);
      facade.registerProxy(collection);
      const iterable = facade.retrieveProxy(collectionName);
      const records = await iterable.reduce(async (accumulator, item) => {
        accumulator[item.test] = item;
        return await Promise.resolve(accumulator);
      }, {});
      assert.equal(records['three'].test, 'three', '1st record is not match');
      assert.equal(records['men'].test, 'men', '2nd record is not match');
      assert.equal(records['in'].test, 'in', '3rd record is not match');
      assert.equal(records['a boat'].test, 'a boat', '4th record is not match');
    });
  });
});
