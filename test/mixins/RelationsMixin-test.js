const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const LeanES = require("../../../src/leanes/index.js").default;
const {
  Record,
  initialize, partOf, nameBy, meta, constant, mixin, method, hasOne, belongsTo, relatedTo, hasMany
} = LeanES.NS;

describe('RelationsMixin', () => {
  describe('.new', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should create item with record mixin', () => {
      expect(() => {
        const collectionName = 'TestsCollection';
        const KEY = 'TEST_RELATIONS_MIXIN_001';
        facade = LeanES.NS.Facade.getInstance(KEY);

        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.MemoryCollectionMixin)
        @mixin(LeanES.NS.GenerateUuidIdMixin)
        @partOf(Test)
        class TestsCollection extends Test.NS.Collection {
          @nameBy static __filename = 'TestsCollection';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.RelationsMixin)
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
        }
        const collection = TestsCollection.new();
        collection.setName(collectionName);
        collection.setData({
          delegate: 'TestRecord'
        });
        facade.registerProxy(collection);
        const record = TestRecord.new({
          type: 'Test::TestRecord'
        }, collection);
        assert.instanceOf(record, TestRecord, 'record is not a TestRecord instance')
      }).to.not.throw(Error);
    });
  });
  describe('.relatedTo', () => {
    it('relatedTo: should define one-to-one or one-to-many optional relation for class', () => {
      expect(() => {
        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.RelationsMixin)
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @relatedTo({
            attr: 'relation_attr',
            refKey: 'id',
            recordName: () => ('TestRecord'),
            collectionName: () => ('TestsCollection'),
            through: ['tomatosRels', {by: 'cucumberId'}],
            inverse: 'test'
          }) relation;
        }
        const {
          relation: relationData
        } = TestRecord.relations;

        assert.equal(relationData.refKey, 'id', 'Value of `refKey` is incorrect');
        assert.equal(relationData.attr, 'relation_attr', 'Value of `attr` is incorrect');
        assert.equal(relationData.inverse, 'test', 'Value of `inverse` is incorrect');
        assert.equal(relationData.relation, 'relatedTo', 'Value of `relation` is incorrect');
        assert.deepEqual(relationData.through, [
          'tomatosRels',
          {
            by: 'cucumberId'
          }
        ], 'Value of `through` is incorrect');
        assert.isArray(relationData.through, 'Value of `through` isn`t array');
        assert.isString(relationData.through[0], 'Value of `through[0]` isn`t string');
        assert.isObject(relationData.through[1], 'Value of `through[1]` isn`t object');
        assert.isString(relationData.through[1].by, 'Value of `through[1].by` isn`t string');
        assert.equal(relationData.recordName.call(TestRecord), 'TestRecord', 'Value of `recordName` is incorrect');
        assert.equal(relationData.collectionName.call(TestRecord), 'TestsCollection', 'Value of `collectionName` is incorrect');
      }).to.not.throw(Error);
    });
    it('relatedTo: should define options automatically', () => {
      expect(() => {
        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.RelationsMixin)
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @relatedTo({}) cucumber;
        }
        const {
          cucumber: relationData
        } = TestRecord.relations;

        assert.equal(relationData.attr, 'cucumberId', 'Value of `attr` is incorrect');
        assert.equal(relationData.recordName.call(TestRecord), 'CucumberRecord', 'Value of `recordName` is incorrect');
        assert.equal(relationData.collectionName.call(TestRecord), 'CucumbersCollection', 'Value of `collectionName` is incorrect');
        assert.equal(relationData.inverse, 'tests', 'Value of `inverse` is incorrect');
      }).to.not.throw(Error);
    });
  });
  describe('.belongsTo', () => {
    it('belongsTo: should define one-to-one or one-to-many parent relation for class', () => {
      expect(() => {
        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.RelationsMixin)
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @belongsTo({
            attr: 'relation_attr',
            refKey: 'id',
            recordName: () => ('TestRecord'),
            collectionName: () => ('TestsCollection'),
            through: ['tomatosRels', {by: 'cucumberId'}],
            inverse: 'test'
          }) relation;
        }
        const {
          relation: relationData
        } = TestRecord.relations;

        assert.equal(relationData.refKey, 'id', 'Value of `refKey` is incorrect');
        assert.equal(relationData.attr, 'relation_attr', 'Value of `attr` is incorrect');
        assert.equal(relationData.inverse, 'test', 'Value of `inverse` is incorrect');
        assert.equal(relationData.relation, 'belongsTo', 'Value of `relation` is incorrect');
        assert.deepEqual(relationData.through, [
          'tomatosRels',
          {
            by: 'cucumberId'
          }
        ], 'Value of `through` is incorrect');
        assert.isArray(relationData.through, 'Value of `through` isn`t array');
        assert.isString(relationData.through[0], 'Value of `through[0]` isn`t string');
        assert.isObject(relationData.through[1], 'Value of `through[1]` isn`t object');
        assert.isString(relationData.through[1].by, 'Value of `through[1].by` isn`t string');
        assert.equal(relationData.recordName.call(TestRecord), 'TestRecord', 'Value of `recordName` is incorrect');
        assert.equal(relationData.collectionName.call(TestRecord), 'TestsCollection', 'Value of `collectionName` is incorrect');
      }).to.not.throw(Error);
    });
    it('belongsTo: should define options automatically', () => {
      expect(() => {
        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.RelationsMixin)
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @belongsTo({}) cucumber;
        }
        const {
          cucumber: relationData
        } = TestRecord.relations;

        assert.equal(relationData.attr, 'cucumberId', 'Value of `attr` is incorrect');
        assert.equal(relationData.recordName.call(TestRecord), 'CucumberRecord', 'Value of `recordName` is incorrect');
        assert.equal(relationData.collectionName.call(TestRecord), 'CucumbersCollection', 'Value of `collectionName` is incorrect');
        assert.equal(relationData.inverse, 'tests', 'Value of `inverse` is incorrect');
      }).to.not.throw(Error);
    });
  });
  describe('.hasMany', () => {
    it('hasMany: should define one-to-one or one-to-many relation for class', () => {
      expect(() => {
        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.RelationsMixin)
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @hasMany({
            refKey: 'id',
            recordName: () => ('TestRecord'),
            collectionName: () => ('TestsCollection'),
            through: ['tomatosRels', {by: 'cucumberId'}],
            inverse: 'test'
          }) manyRelation;
        }
        const {
          manyRelation: relationData
        } = TestRecord.relations;

        assert.equal(relationData.refKey, 'id', 'Value of `refKey` is incorrect');
        assert.equal(relationData.inverse, 'test', 'Value of `inverse` is incorrect');
        assert.equal(relationData.relation, 'hasMany', 'Value of `relation` is incorrect');
        assert.deepEqual(relationData.through, [
          'tomatosRels',
          {
            by: 'cucumberId'
          }
        ], 'Value of `through` is incorrect');
        assert.isArray(relationData.through, 'Value of `through` isn`t array');
        assert.isString(relationData.through[0], 'Value of `through[0]` isn`t string');
        assert.isObject(relationData.through[1], 'Value of `through[1]` isn`t object');
        assert.isString(relationData.through[1].by, 'Value of `through[1].by` isn`t string');
        assert.equal(relationData.recordName.call(TestRecord), 'TestRecord', 'Value of `recordName` is incorrect');
        assert.equal(relationData.collectionName.call(TestRecord), 'TestsCollection', 'Value of `collectionName` is incorrect');
      }).to.not.throw(Error);
    });
  });
  describe('.hasOne', () => {
    it('hasOne: should define many-to-one or many-to-one relation for class', () => {
      expect(() => {
        @initialize
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }

        @initialize
        @mixin(LeanES.NS.RelationsMixin)
        @partOf(Test)
        class TestRecord extends LeanES.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @hasOne({
            refKey: 'id',
            recordName: () => ('TestRecord'),
            collectionName: () => ('TestsCollection'),
            through: ['tomatosRels', {by: 'cucumberId'}],
            inverse: 'test'
          }) oneRelation;
        }
        const {
          oneRelation: relationData
        } = TestRecord.relations;

        assert.equal(relationData.refKey, 'id', 'Value of `refKey` is incorrect');
        assert.equal(relationData.inverse, 'test', 'Value of `inverse` is incorrect');
        assert.equal(relationData.relation, 'hasOne', 'Value of `relation` is incorrect');
        assert.deepEqual(relationData.through, [
          'tomatosRels',
          {
            by: 'cucumberId'
          }
        ], 'Value of `through` is incorrect');
        assert.isArray(relationData.through, 'Value of `through` isn`t array');
        assert.isString(relationData.through[0], 'Value of `through[0]` isn`t string');
        assert.isObject(relationData.through[1], 'Value of `through[1]` isn`t object');
        assert.isString(relationData.through[1].by, 'Value of `through[1].by` isn`t string');
        assert.equal(relationData.recordName.call(TestRecord), 'TestRecord', 'Value of `recordName` is incorrect');
        assert.equal(relationData.collectionName.call(TestRecord), 'TestsCollection', 'Value of `collectionName` is incorrect');
      }).to.not.throw(Error);
    });
  });
  describe('.inverseFor', () => {
    it('should get inverse info', () => {

      @initialize
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }

      @initialize
      @mixin(LeanES.NS.RelationsMixin)
      @partOf(Test)
      class RelationRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'RelationRecord';
        @meta static object = {};
        @hasOne({inverse: 'relation_attr'}) test = null;
      }

      @initialize
      @mixin(LeanES.NS.RelationsMixin)
      @partOf(Test)
      class TestRecord extends LeanES.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @belongsTo({
          attr: 'relation_attr',
          refKey: 'id',
          inverse: 'test'
        }) relation = null;
      }
      const inverseInfo = TestRecord.inverseFor('relation');
      assert.equal(inverseInfo.recordClass, RelationRecord, 'Record class is incorrect');
      assert.equal(inverseInfo.attrName, 'test', 'Record class is incorrect');
      assert.equal(inverseInfo.relation, 'hasOne', 'Record class is incorrect');
    });
  });
});
