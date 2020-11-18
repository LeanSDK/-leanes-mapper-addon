const { expect, assert } = require('chai');
const sinon = require('sinon');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, meta, method, property, mixin, plugin
} = LeanES.NS;


describe('Cursor', () => {
  describe('.new', () => {
    it('should create cursor instance', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const Cursor = Test.NS.Cursor;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
        }

        @initialize
        @mixin(Test.NS.MemoryCollectionMixin)
        @mixin(Test.NS.GenerateUuidIdMixin)
        @partOf(Test)
        class MemoryCollection extends Test.NS.Collection {
          @nameBy static __filename = 'MemoryCollection';
          @meta static object = {};
        }
        const voMemoryCollection = MemoryCollection.new();
        voMemoryCollection.setName('MemoryCollection');
        voMemoryCollection.setData({
          delegate: TestRecord
        });
        const array = [{}, {}, {}];
        const cursor = Cursor.new(voMemoryCollection, array);
      }).to.not.throw(Error);
    });
  });
  describe('.setCollection', () => {
    it('should setup record', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const Cursor = Test.NS.Cursor;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
        }

        @initialize
        @mixin(Test.NS.MemoryCollectionMixin)
        @mixin(Test.NS.GenerateUuidIdMixin)
        @partOf(Test)
        class MemoryCollection extends Test.NS.Collection {
          @nameBy static __filename = 'MemoryCollection';
          @meta static object = {};
        }
        const voMemoryCollection = MemoryCollection.new();
        voMemoryCollection.setName('MemoryCollection');
        voMemoryCollection.setData({
          delegate: TestRecord
        });
        const cursor = Cursor.new();
        cursor.setCollection(voMemoryCollection);
      }).to.not.throw(Error);
    });
  });
  describe('next', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should get next values one by one', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      const array = [
        {
          data: 'three',
          type: 'TestRecord'
        },
        {
          data: 'men',
          type: 'TestRecord'
        },
        {
          data: 'in',
          type: 'TestRecord'
        },
        {
          data: 'a boat',
          type: 'TestRecord'
        }
      ];
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      assert.equal((await cursor.next()).data, 'three', 'First item is incorrect');
      assert.equal((await cursor.next()).data, 'men', 'Second item is incorrect');
      assert.equal((await cursor.next()).data, 'in', 'Third item is incorrect');
      assert.equal((await cursor.next()).data, 'a boat', 'Fourth item is incorrect');
      assert.isUndefined(await cursor.next(), 'Unexpected item is present');
    });
  });
  describe('hasNext', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should check if next value is present', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const array = [
        {
          data: 'data',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      assert.isTrue(await cursor.hasNext(), 'There is no next value');
      const data = await cursor.next();
      assert.isFalse(await cursor.hasNext(), 'There is something else');
    });
  });
  describe('toArray', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should get array from cursor', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const array = [
        {
          data: 'three',
          type: 'TestRecord'
        },
        {
          data: 'men',
          type: 'TestRecord'
        },
        {
          data: 'in',
          type: 'TestRecord'
        },
        {
          data: 'a boat',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      const records = await cursor.toArray();

      assert.equal(records.length, array.length, 'Counts of input and output data are different');
      for (let i = 0; i < records.length; i++) {
        let record = records[i];
        assert.instanceOf(record, Test.NS.TestRecord, `Record ${i} is incorrect`);
        assert.equal(record.data, array[i].data, `Record ${i} \`data\` is incorrect`);
      }
    });
  });
  describe('close', () => {
    it('should remove records from cursor', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      const voMemoryCollection = MemoryCollection.new();
      voMemoryCollection.setName('MemoryCollection');
      voMemoryCollection.setData({
        delegate: TestRecord
      });
      const array = [
        {
          data: 'three',
          type: 'TestRecord'
        },
        {
          data: 'men',
          type: 'TestRecord'
        },
        {
          data: 'in',
          type: 'TestRecord'
        },
        {
          data: 'a boat',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      assert.isTrue(await cursor.hasNext(), 'There is no next value');
      await cursor.close();
      assert.isFalse(await cursor.hasNext(), 'There is something else');
    });
  });
  describe('count', () => {
    it('should count records in cursor', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      const voMemoryCollection = MemoryCollection.new();
      voMemoryCollection.setName('MemoryCollection');
      voMemoryCollection.setData({
        delegate: TestRecord
      });
      const array = [
        {
          data: 'three',
          type: 'TestRecord'
        },
        {
          data: 'men',
          type: 'TestRecord'
        },
        {
          data: 'in',
          type: 'TestRecord'
        },
        {
          data: 'a boat',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      assert.equal(await cursor.count(), 4, 'Count works incorrectly');
    });
  });
  describe('forEach', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should call lambda in each record in cursor', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const array = [
        {
          data: 'three',
          type: 'TestRecord'
        },
        {
          data: 'men',
          type: 'TestRecord'
        },
        {
          data: 'in',
          type: 'TestRecord'
        },
        {
          data: 'a boat',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      const spyLambda = sinon.spy(async () => { });
      await cursor.forEach(spyLambda);
      assert.isTrue(spyLambda.called, 'Lambda never called');
      assert.equal(spyLambda.callCount, 4, 'Lambda calls are not match');
      assert.equal(spyLambda.args[0][0].data, 'three', 'Lambda 1st call is not match');
      assert.equal(spyLambda.args[1][0].data, 'men', 'Lambda 2nd call is not match');
      assert.equal(spyLambda.args[2][0].data, 'in', 'Lambda 3rd call is not match');
      assert.equal(spyLambda.args[3][0].data, 'a boat', 'Lambda 4th call is not match');
    });
  });
  describe('map', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should map records using lambda', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const array = [
        {
          data: 'three',
          type: 'TestRecord'
        },
        {
          data: 'men',
          type: 'TestRecord'
        },
        {
          data: 'in',
          type: 'TestRecord'
        },
        {
          data: 'a boat',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      const records = await cursor.map(async (record) => {
        record.data = '+' + record.data + '+';
        return await Promise.resolve(record);
      });
      assert.lengthOf(records, 4, 'Records count is not match');
      assert.equal(records[0].data, '+three+', '1st record is not match');
      assert.equal(records[1].data, '+men+', '2nd record is not match');
      assert.equal(records[2].data, '+in+', '3rd record is not match');
      assert.equal(records[3].data, '+a boat+', '4th record is not match');
    });
  });
  describe('filter', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should filter records using lambda', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const array = [
        {
          data: 'three',
          type: 'TestRecord'
        },
        {
          data: 'men',
          type: 'TestRecord'
        },
        {
          data: 'in',
          type: 'TestRecord'
        },
        {
          data: 'a boat',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      const records = await cursor.filter(async (record) => {
        return await Promise.resolve(record.data.length > 3);
      });
      assert.lengthOf(records, 2, 'Records count is not match');
      assert.equal(records[0].data, 'three', '1st record is not match');
      assert.equal(records[1].data, 'a boat', '2nd record is not match');
    });
  });
  describe('find', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should find record using lambda', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) name = 'Unknown';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const array = [
        {
          name: 'Jerome',
          type: 'TestRecord'
        },
        {
          name: 'George',
          type: 'TestRecord'
        },
        {
          name: 'Harris',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      const record = await cursor.find(async (record) => {
        return await Promise.resolve(record.name === 'George');
      });

      assert.equal(record.name, 'George', 'Record is not match');
    });
  });
  describe('compact', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should get non-empty records from cursor', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const array = [
        null,
        {
          data: 'men',
          type: 'TestRecord'
        },
        void 0,
        {
          data: 'a boat',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      const records = await cursor.compact();
      assert.lengthOf(records, 2, 'Records count not match');
      assert.equal(records[0].data, 'men', '1st record is not match');
      assert.equal(records[1].data, 'a boat', '2nd record is not match');
    });
  });
  describe('reduce', () => {
    let facade = null;
    after(function () {
      typeof facade != "undefined" && facade !== null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    })
    it('should reduce records using lambda', async () => {

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute, Cursor } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance('Test');

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) data = '';
      }

      @initialize
      @mixin(Test.NS.MemoryCollectionMixin)
      @mixin(Test.NS.GenerateUuidIdMixin)
      @partOf(Test)
      class MemoryCollection extends Test.NS.Collection {
        @nameBy static __filename = 'MemoryCollection';
        @meta static object = {};
      }
      facade.addProxy('MemoryCollection', 'MemoryCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER
      });
      const voMemoryCollection = facade.retrieveProxy('MemoryCollection');
      const array = [
        {
          data: 'one',
          type: 'TestRecord'
        },
        {
          data: 'two',
          type: 'TestRecord'
        },
        {
          data: 'three',
          type: 'TestRecord'
        },
        {
          data: 'four',
          type: 'TestRecord'
        }
      ];
      const cursor = Cursor.new();
      cursor.setCollection(voMemoryCollection);
      cursor.setIterable(array);
      const records = await cursor.reduce(async (accumulator, item) => {
        accumulator[item.data] = item;
        return await Promise.resolve(accumulator);
      }, {});
      assert.equal(records['one'].data, 'one', '1st record is not match');
      assert.equal(records['two'].data, 'two', '2nd record is not match');
      assert.equal(records['three'].data, 'three', '3rd record is not match');
      assert.equal(records['four'].data, 'four', '4th record is not match');
    });
  });
});
