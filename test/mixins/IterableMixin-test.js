const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, resolver, meta, mixin, constant, method, property, plugin
} = LeanES.NS;

describe('IterableMixin', () => {
  describe('.new', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should create iterable instance', async () => {
      const KEY = 'Test';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
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
      @mixin(Test.NS.IterableMixin)
      class Iterable extends Test.NS.Collection {
        @nameBy static __filename = 'Iterable';
        @meta static object = {};
      }
      const payload = {
        0: {},
        1: {},
        2: {}
      };
      const collectionName = 'TestsCollection';
      facade.addProxy(collectionName, 'Iterable', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const iterable = facade.retrieveProxy(collectionName);
      const tmpAdapter = iterable.adapter;
      tmpAdapter._collection = payload;
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

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
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
      @mixin(Test.NS.IterableMixin)
      @partOf(Test)
      class Iterable extends Test.NS.Collection {
        @nameBy static __filename = 'Iterable';
        @meta static object = {};
      }
      const payload = {
        0: {
          test: 'three',
          type: 'Test::TestRecord'
        },
        1: {
          test: 'men',
          type: 'Test::TestRecord'
        },
        2: {
          test: 'in',
          type: 'Test::TestRecord'
        },
        3: {
          test: 'a boat',
          type: 'Test::TestRecord'
        }
      };
      const collectionName = 'TestsCollection';
      facade.addProxy(collectionName, 'Iterable', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const iterable = facade.retrieveProxy(collectionName);
      const tmpAdapter = iterable.adapter;
      tmpAdapter._collection = payload;
      const spyLambda = sinon.spy(async () => { });
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

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
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
      @mixin(Test.NS.IterableMixin)
      @partOf(Test)
      class Iterable extends Test.NS.Collection {
        @nameBy static __filename = 'Iterable';
        @meta static object = {};
      }
      const payload = {
        0: {
          test: 'three',
          type: 'TestRecord'
        },
        1: {
          test: 'men',
          type: 'TestRecord'
        },
        2: {
          test: 'in',
          type: 'TestRecord'
        },
        3: {
          test: 'a boat',
          type: 'TestRecord'
        }
      };
      const collectionName = 'TestsCollection';
      facade.addProxy(collectionName, 'Iterable', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const iterable = facade.retrieveProxy(collectionName);
      const tmpAdapter = iterable.adapter;
      tmpAdapter._collection = payload;
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

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
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
      @mixin(Test.NS.IterableMixin)
      @partOf(Test)
      class Iterable extends Test.NS.Collection {
        @nameBy static __filename = 'Iterable';
        @meta static object = {};
      }
      const payload = {
        0: {
          test: 'three',
          type: 'TestRecord'
        },
        1: {
          test: 'men',
          type: 'TestRecord'
        },
        2: {
          test: 'in',
          type: 'TestRecord'
        },
        3: {
          test: 'a boat',
          type: 'TestRecord'
        }
      };
      const collectionName = 'TestsCollection';
      facade.addProxy(collectionName, 'Iterable', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const iterable = facade.retrieveProxy(collectionName);
      const tmpAdapter = iterable.adapter;
      tmpAdapter._collection = payload;
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

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
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
      @mixin(Test.NS.IterableMixin)
      class Iterable extends Test.NS.Collection {
        @nameBy static __filename = 'Iterable';
        @meta static object = {};
      }
      const payload = {
        0: {
          test: 'three',
          type: 'TestRecord'
        },
        1: {
          test: 'men',
          type: 'TestRecord'
        },
        2: {
          test: 'in',
          type: 'TestRecord'
        },
        3: {
          test: 'a boat',
          type: 'TestRecord'
        }
      };
      const collectionName = 'TestsCollection';
      facade.addProxy(collectionName, 'Iterable', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const iterable = facade.retrieveProxy(collectionName);
      const tmpAdapter = iterable.adapter;
      tmpAdapter._collection = payload;
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
