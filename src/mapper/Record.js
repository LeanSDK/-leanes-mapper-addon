// This file is part of leanes-mapper-addon.
//
// leanes-mapper-addon is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// leanes-mapper-addon is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with leanes-mapper-addon.  If not, see <https://www.gnu.org/licenses/>.

// console.log('>?>?>??? 000');
import type { CollectionInterface } from '../interfaces/CollectionInterface';
// console.log('>?>?>??? 111');
import type { RecordInterface } from '../interfaces/RecordInterface';
// console.log('>?>?>??? 222');
// import type { RecordStaticInterface } from '../interfaces/RecordStaticInterface';
// console.log('>?>?>??? 333');
// import type { TransformStaticInterface } from '../interfaces/TransformStaticInterface';
// console.log('>?>?>??? 444');
import type { AttributeConfigT } from '../types/AttributeConfigT';
// console.log('>?>?>??? 666');
import type { ComputedConfigT } from '../types/ComputedConfigT';
// console.log('>?>?>??? 777');
import type { JoiT } from '../types/JoiT';

const hasProp = {}.hasOwnProperty;

export default (Module) => {
  const {
    CoreObject,
    assert,
    initialize, partOf, meta, property, method, nameBy, attribute, chains,
    Utils: { _, joi, inflect }
  } = Module.NS;

  const schemas = new Map;

  @initialize
  @chains([
    'create', 'update', 'delete', 'destroy'
  ], function () {
    this.beforeHook('beforeCreate', {
      only: ['create']
    });
    this.beforeHook('beforeUpdate', {
      only: ['update']
    });
    this.afterHook('afterUpdate', {
      only: ['update']
    });
    this.afterHook('afterCreate', {
      only: ['create']
    });
    this.beforeHook('beforeDelete', {
      only: ['delete']
    });
    this.afterHook('afterDelete', {
      only: ['delete']
    });
    this.beforeHook('beforeDestroy', {
      only: ['destroy']
    });
    this.afterHook('afterDestroy', {
      only: ['destroy']
    });
  })
  @partOf(Module)
  class Record extends CoreObject implements RecordInterface {
    @nameBy static  __filename = __filename;
    @meta static object = {};
    // ipoInternalRecord = PointerT(Record.protected({
    @property _internalRecord: ?object = null;
    // ipoSchemas = PointerT(Record.protected(Record.static({
    @property static get _schemas() { return schemas }

    @property collection: ?CollectionInterface<Record> = null;

    @property static get schema(): JoiT {
      const existedSchema = this._schemas.get(this);
      if (existedSchema != null) return existedSchema;

      const vhAttrs = {};
      const voAttrs = this.attributes;
      for (const vsAttr in voAttrs) {
        if (!hasProp.call(voAttrs, vsAttr)) continue;
        const vhAttrValue = voAttrs[vsAttr];
        vhAttrs[vsAttr] = _.isFunction(vhAttrValue.validate)
          ? vhAttrValue.validate.call(this)
          : vhAttrValue.validate;
      }
      const voComps = this.computeds;
      for (const vsComp in voComps) {
        if (!hasProp.call(voComps, vsComp)) continue;
        const vhCompValue = voComps[vsComp];
        vhAttrs[vsComp] = _.isFunction(vhCompValue.validate)
          ? vhCompValue.validate.call(this)
          : vhCompValue.validate;
      }
      this._schemas.set(this, joi.object(vhAttrs));
      return this._schemas.get(this);
    }

    @method static async normalize(ahPayload: ?object, aoCollection: ?CollectionInterface<RecordInterface>): Promise<?[Class<*>, object]> {
      if (ahPayload == null) return null;
      const vhAttributes = {};
      assert(ahPayload.type != null, 'Attribute `type` is required and format \'ModuleName::RecordClassName\'');
      const RecordClass = this.name === ahPayload.type.split('::')[1] ? this : this.findRecordByName(ahPayload.type);
      const voAttrs = RecordClass.attributes;
      for (const asAttr in voAttrs) {
        if (!hasProp.call(voAttrs, asAttr)) continue;
        const { transform } = voAttrs[asAttr];
        // const vcTransform: TransformStaticInterface = transform.call(RecordClass);
        const vcTransform: Class<*> = transform.call(RecordClass);
        vhAttributes[asAttr] = await vcTransform.normalize(
          ahPayload[asAttr]
        );
      }
      vhAttributes.type = ahPayload.type;
      // NOTE: vhAttributes processed before new - it for StateMachine in record (when it has)
      const voRecord = RecordClass.new(vhAttributes, aoCollection);
      vhAttributes._internalRecord = voRecord.constructor.makeSnapshot(voRecord);
      return [RecordClass, vhAttributes]
    }

    @method static async serialize(aoRecord: ?RecordInterface): Promise<?object> {
      if (aoRecord == null) return null;
      assert(aoRecord.type != null, 'Attribute `type` is required and format \'ModuleName::RecordClassName\'');
      const vhResult = {};
      const voAttrs = aoRecord.constructor.attributes;
      for (const asAttr in voAttrs) {
        if (!hasProp.call(voAttrs, asAttr)) continue;
        const { transform } = voAttrs[asAttr];
        // const vcTransform: TransformStaticInterface = transform.call(this);
        const vcTransform: Class<*> = transform.call(this);
        vhResult[asAttr] = await vcTransform.serialize(
          aoRecord[asAttr]
        );
      }
      return vhResult;
    }

    @method static async recoverize(ahPayload: ?object, aoCollection: ?CollectionInterface<RecordInterface>): Promise<?[Class<*>, object]> {
      if (ahPayload == null) return null;
      const vhAttributes = {};
      assert(ahPayload.type != null, 'Attribute `type` is required and format \'ModuleName::RecordClassName\'');
      const RecordClass = this.name === ahPayload.type.split('::')[1] ? this : this.findRecordByName(ahPayload.type);
      const voAttrs = RecordClass.attributes;
      for (const asAttr in voAttrs) {
        if (!hasProp.call(voAttrs, asAttr)) continue;
        const { transform } = voAttrs[asAttr];
        // const vcTransform: TransformStaticInterface = transform.call(RecordClass);
        const vcTransform: Class<*> = transform.call(RecordClass);
        if (asAttr in ahPayload) {
          vhAttributes[asAttr] = await vcTransform.normalize(
            ahPayload[asAttr]
          );
        }
      }
      vhAttributes.type = ahPayload.type;
      // NOTE: vhAttributes processed before new - it for StateMachine in record (when it has)
      // return RecordClass.new(vhAttributes, aoCollection);
      return [RecordClass, vhAttributes]
    }

    @method static objectize(aoRecord: ?RecordInterface): ?object {
      if (aoRecord == null) return null;
      assert(aoRecord.type != null, 'Attribute `type` is required and format \'ModuleName::RecordClassName\'');
      const vhResult = {};
      const voAttrs = aoRecord.constructor.attributes;
      for (const asAttr in voAttrs) {
        if (!hasProp.call(voAttrs, asAttr)) continue;
        const { transform: attrTransform } = voAttrs[asAttr];
        // const vcAttrTransform: TransformStaticInterface = attrTransform.call(this);
        const vcAttrTransform: Class<*> = attrTransform.call(this);
        vhResult[asAttr] = vcAttrTransform.objectize(
          aoRecord[asAttr]
        );
      }
      const voComps = aoRecord.constructor.computeds;
      for (const asComp in voComps) {
        if (!hasProp.call(voComps, asComp)) continue;
        const { transform: compTransform } = voComps[asComp];
        // const vcCompTransform: TransformStaticInterface = compTransform.call(this);
        const vcCompTransform: Class<*> = compTransform.call(this);
        vhResult[asComp] = vcCompTransform.objectize(
          aoRecord[asComp]
        );
      }
      return vhResult;
    }

    @method static makeSnapshot(aoRecord: ?RecordInterface): ?object {
      if (aoRecord == null) return null;
      assert(aoRecord.type != null, 'Attribute `type` is required and format \'ModuleName::RecordClassName\'');
      const vhResult = {};
      const voAttributes = aoRecord.constructor.attributes;
      for (const asAttr in voAttributes) {
        if (!hasProp.call(voAttributes, asAttr)) continue;
        const { transform } = voAttributes[asAttr];
        // const vcTransform: TransformStaticInterface = transform.call(this);
        const vcTransform: Class<*> = transform.call(this);
        vhResult[asAttr] = vcTransform.objectize(
          aoRecord[asAttr]
        );
      }
      return vhResult;
    }

    @method static parseRecordName(asName: string): [string, string] {
      let vsModuleName, vsRecordName;
      if (/.*[:][:].*/.test(asName)) {
        [vsModuleName, vsRecordName] = asName.split('::');
      } else {
        [vsModuleName, vsRecordName] = [this.moduleName(), inflect.camelize(inflect.underscore(inflect.singularize(asName)))];
      }
      if (!/(Record$)|(Migration$)/.test(vsRecordName)) {
        vsRecordName += 'Record';
      }
      return [vsModuleName, vsRecordName];
    }

    @method parseRecordName(...args) {
      return this.constructor.parseRecordName(...args);
    }

    // @method static findRecordByName(asName: string): RecordStaticInterface {
    @method static findRecordByName(asName: string): Class<*> {
      const [ vsModuleName, vsRecordName ] = this.parseRecordName(asName);
      return this.Module.NS[vsRecordName] || this;
    }

    // @method findRecordByName(asName: string): RecordStaticInterface {
    @method findRecordByName(asName: string): Class<*> {
      return this.constructor.findRecordByName(asName);
    }

    /*
    // At End of SomeRecord class definition
    SomeRecord.customFilters = {
      reason: {
        '$eq': (value) => {
          // string of some aql/sql code for example
        },
        '$neq': (value) => {
          // string of some aql/sql code for example
        },
      },
    };
    */
    @property static get customFilters(): object {
      return this.metaObject.getGroup('customFilters', false);
    }

    // @property static set customFilters(config): void {
    //   for (const asFilterName in config) {
    //     if (!hasProp.call(config, asFilterName)) continue;
    //     const aoStatement = config[asFilterName];
    //     this.metaObject.addMetaData('customFilters', asFilterName, aoStatement);
    //   }
    // }

    // @method static parentClassNames(AbstractClass: ?(RecordStaticInterface | Class<Object>) = null): string[] {
    @method static parentClassNames(AbstractClass: ?Class<*> = null): string[] {
      if (AbstractClass == null) {
        AbstractClass = this;
      }
      const SuperClass = Reflect.getPrototypeOf(AbstractClass);
      const fromSuper = !_.isEmpty(
        SuperClass != null ? SuperClass.name : undefined
      ) ?
        this.parentClassNames(SuperClass)
      :
        undefined;
      return _.uniq([].concat(fromSuper || [])).concat([AbstractClass.name]);
    }

    @property static get attributes(): {[key: string]: AttributeConfigT} {
      return this.metaObject.getGroup('attributes', false);
    }

    @property static get computeds(): {[key: string]: ComputedConfigT} {
      return this.metaObject.getGroup('computeds', false);
    }

    @method static 'new'(aoAttributes: ?object, aoCollection: CollectionInterface<Record>): RecordInterface {
      if (aoAttributes == null) {
        aoAttributes = {};
      }
      assert(aoAttributes.type != null, 'Attribute `type` is required and format \'ModuleName::RecordClassName\'');
      if (this.name === aoAttributes.type.split('::')[1]) {
        return super.new(aoAttributes, aoCollection);
      } else {
        const RecordClass = this.findRecordByName(aoAttributes.type);
        if (RecordClass === this) {
          return super.new(aoAttributes, aoCollection);
        } else {
          return RecordClass.new(aoAttributes, aoCollection);
        }
      }
    }

    @method async save(): Promise<RecordInterface> {
      // console.log(':::::LLLL Record::save enter');
      const result = (await this.isNew()) ? (await this.create()) : (await this.update());
      return result;
    }

    @method async create(): Promise<RecordInterface> {
      if (this.collection == null) return this;
      // console.log(':::::LLLL Record::create enter');
      // console.log '>>??? create push ', @, @collection
      const response = await this.collection.push(this);
      // response = await @collection.push.body.call @collection, @
      // console.log '>>>>?????????????????????', response, response.collection
      // console.log '>>>>????????????????????? is', CollectionInterface.is response.collection
      if (response != null) {
        const voAttributes = this.constructor.attributes;
        for (const asAttr in voAttributes) {
          if (!hasProp.call(voAttributes, asAttr)) continue;
          this[asAttr] = response[asAttr];
        }
        this._internalRecord = response._internalRecord;
      }
      return this;
    }

    @method async update(): Promise<RecordInterface> {
      if (this.collection == null) return this;
      const response = await this.collection.override(this.id, this);
      if (response != null) {
        const voAttributes = this.constructor.attributes;
        for (const asAttr in voAttributes) {
          if (!hasProp.call(voAttributes, asAttr)) continue;
          this[asAttr] = response[asAttr];
        }
        this._internalRecord = response._internalRecord;
      }
      return this;
    }

    @method async 'delete'(): Promise<void> {
      if (this.collection == null) return;
      if (await this.isNew()) {
        assert.fail('Document is not exist in collection');
      }
      // this.isHidden = true;
      // this.updatedAt = new Date();
      // return await this.save();
      await this.collection.remove(this.id);
    }

    @method async destroy(): Promise<void> {
      if (this.collection == null) return;
      if (await this.isNew()) {
        assert.fail('Document is not exist in collection');
      }
      await this.collection.remove(this.id);
    }

    @attribute({ type: 'primary_key' }) id: ?(string | number) = null;
    // @attribute({ type: 'string' }) rev = null;
    @attribute({ type: 'string' }) type = null;
    // @attribute({
    //   type: 'boolean',
    //   validate: () => joi.boolean().empty(null).default(false)
    // }) isHidden = false;
    // @attribute({ type: 'date' }) createdAt = null;
    // @attribute({ type: 'date' }) updatedAt = null;
    // @attribute({ type: 'date' }) deletedAt = null;

    @method async beforeCreate(...args) {
      if (this.collection == null) return args;
      if (this.id == null) {
        this.id = await this.collection.generateId();
      }
      // const now = new Date();
      // if (this.createdAt == null) {
      //   this.createdAt = now;
      // }
      // if (this.updatedAt == null) {
      //   this.updatedAt = now;
      // }
      return args;
    }

    @method async afterCreate(aoRecord: RecordInterface): Promise<RecordInterface> {
      if (this.collection == null) return this;
      this.collection.recordHasBeenChanged('createdRecord', aoRecord);
      return this;
    }

    @method async beforeUpdate(...args) {
      // this.updatedAt = new Date();
      return args;
    }

    @method async afterUpdate(aoRecord: RecordInterface): Promise<RecordInterface> {
      if (this.collection == null) return this;
      this.collection.recordHasBeenChanged('updatedRecord', aoRecord);
      return this;
    }

    @method async beforeDelete(...args) {
      // this.isHidden = true;
      // const now = new Date();
      // this.updatedAt = now;
      // this.deletedAt = now;
      return args;
    }

    @method async afterDelete(aoRecord: RecordInterface): Promise<RecordInterface> {
      if (this.collection == null) return this;
      this.collection.recordHasBeenChanged('deletedRecord', aoRecord);
      return this;
    }

    @method async beforeDestroy(...args) {
      return args;
    }

    @method async afterDestroy() {
      if (this.collection == null) return;
      this.collection.recordHasBeenChanged('destroyedRecord', this);
    }

    // NOTE: метод должен вернуть список атрибутов данного рекорда.
    @method attributes(): object {
      return Object.keys(this.constructor.attributes);
    }

    // NOTE: в оперативной памяти создается клон рекорда, НО с другим id
    @method async clone(): Promise<RecordInterface> {
      const vhAttributes = {};
      const vlAttributes = Object.keys(this.constructor.attributes);
      for (const key of vlAttributes) {
        vhAttributes[key] = this[key];
      }
      const voRecord = this.constructor.new(vhAttributes, this.collection);
      voRecord.id = await this.collection.generateId();
      // return await this.collection.clone(this);
      return voRecord;
    }

    // NOTE: в коллекции создается копия рекорда, НО с другим id
    @method async copy(): Promise<RecordInterface> {
      // return await this.collection.copy(this);
      const voRecord = await this.clone();
      await voRecord.save();
      return voRecord;
    }

    @method async decrement(asAttribute: string, step: ?number = 1): Promise<RecordInterface> {
      assert(_.isNumber(this[asAttribute]), `doc.attribute \`${asAttribute}\` is not Number`);
      this[asAttribute] -= step;
      return await this.save();
    }

    @method async increment(asAttribute: string, step: ?number = 1): Promise<RecordInterface> {
      assert(_.isNumber(this[asAttribute]), `doc.attribute \`${asAttribute}\` is not Number`);
      this[asAttribute] += step;
      return await this.save();
    }

    @method async toggle(asAttribute: string): Promise<RecordInterface> {
      assert(_.isBoolean(this[asAttribute]), `doc.attribute \`${asAttribute}\` is not Boolean`);
      this[asAttribute] = !this[asAttribute];
      return await this.save();
    }

    // @method async touch(): Promise<RecordInterface> {
    //   this.updatedAt = new Date();
    //   return await this.save();
    // }

    @method async updateAttribute(name: string, value: ?any): Promise<RecordInterface> {
      this[name] = value;
      return await this.save();
    }

    @method async updateAttributes(aoAttributes: object): Promise<RecordInterface> {
      for (const vsAttrName in aoAttributes) {
        if (!hasProp.call(aoAttributes, vsAttrName)) continue;
        const voAttrValue = aoAttributes[vsAttrName];
        this[vsAttrName] = voAttrValue;
      }
      return await this.save();
    }

    @method async isNew(): Promise<boolean> {
      if (this.collection == null) return true;
      // console.log(':::::LLLL Record::isNew enter', this.collection.delegate.name);
      if (this.id == null) {
        return true;
      }
      return !(await this.collection.includes(this.id));
    }

    // TODO: надо реализовать, НО пока не понятно как перезагрузить все атрибуты этого же рекорда новыми значениями из базы данных?
    @method async reload(): Promise<RecordInterface> {
      return assert.fail('not supported yet')
    }

    // TODO: не учтены установки значений, которые раньше не были установлены
    @method async changedAttributes(): Promise<{[key: string]: [?any, ?any]}> {
      const vhResult = {};
      const voAttributes = this.constructor.attributes;
      for (const vsAttrName in voAttributes) {
        if (!hasProp.call(voAttributes, vsAttrName)) continue;
        const { transform } = voAttributes[vsAttrName];
        const internalRecord = this._internalRecord;
        const voOldValue = internalRecord && internalRecord[vsAttrName] || undefined;
        // const vcTransform: TransformStaticInterface = transform.call(this.constructor);
        const vcTransform: Class<*> = transform.call(this.constructor);
        const voNewValue = vcTransform.objectize(
          this[vsAttrName]
        );
        if (!_.isEqual(voNewValue, voOldValue)) {
          vhResult[vsAttrName] = [voOldValue, voNewValue];
        }
      }
      return vhResult;
    }

    @method async resetAttribute(asAttribute: string): Promise<void> {
      if (this._internalRecord != null) {
        const attrConf = this.constructor.attributes[asAttribute];
        if (attrConf != null) {
          const { transform } = attrConf;
          // const vcTransform: TransformStaticInterface = transform.call(this.constructor);
          const vcTransform: Class<*> = transform.call(this.constructor);
          this[asAttribute] = await vcTransform.normalize(
            this._internalRecord[asAttribute]
          );
        }
      }
    }

    @method async rollbackAttributes(): Promise<void> {
      if (this._internalRecord != null) {
        const voAttributes = this.constructor.attributes;
        for (const vsAttrName in voAttributes) {
          if (!hasProp.call(voAttributes, vsAttrName)) continue;
          const { transform } = voAttributes[vsAttrName];
          const voOldValue = this._internalRecord[vsAttrName];
          // const vcTransform: TransformStaticInterface = transform.call(this.constructor);
          const vcTransform: Class<*> = transform.call(this.constructor);
          this[vsAttrName] = await vcTransform.normalize(
            voOldValue
          );
        }
      }
    }

    @method static async restoreObject(acModule: Class<Module>, replica: object): Promise<RecordInterface> {
      if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
        const Facade = acModule.NS.ApplicationFacade || acModule.NS.Facade;
        const facade = Facade.getInstance(replica.multitonKey);
        const voCollection = facade.retrieveProxy(replica.collectionName);
        if (replica.isNew) {
          // NOTE: оставлено временно для обратной совместимости. Понятно что в будущем надо эту ветку удалить.
          return await voCollection.build(replica.attributes);
        } else {
          return await voCollection.find(replica.id);
        }
      } else {
        return await super.restoreObject(acModule, replica);
      }
    }

    @method static async replicateObject(instance: RecordInterface): Promise<object> {
      const replica = await super.replicateObject(instance);
      replica.multitonKey = instance.collection._multitonKey;
      replica.collectionName = instance.collection.getName();
      replica.isNew = await instance.isNew();
      assert(!replica.isNew, 'Replicating record is `new`. It must be seved previously');
      const changedAttributes = await instance.changedAttributes();
      const changedKeys = Object.keys(changedAttributes);
      assert(changedKeys.length <= 0, `Replicating record has changedAttributes ${changedKeys}`);
      replica.id = instance.id;
      return replica;
    }

    constructor(aoProperties: object, aoCollection: ?CollectionInterface<Record>) {
      super(... arguments);
      this.collection = aoCollection;
      for (const vsAttrName in aoProperties) {
        if (!hasProp.call(aoProperties, vsAttrName)) continue;
        const voAttrValue = aoProperties[vsAttrName];
        this[vsAttrName] = voAttrValue;
      }
      // this._internalRecord = this.constructor.makeSnapshot(this);
    }

    @method toJSON() {
      return this.constructor.objectize(this);
    }
  }
}
