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

// import type { RecordStaticInterface } from '../interfaces/RecordStaticInterface';
import type { JoiT } from '../types/JoiT';

const hasProp = {}.hasOwnProperty;

export default (Module) => {
  const {
    ObjectTransform,
    assert,
    initialize, partOf, meta, property, method, nameBy,
    Utils: { _, inflect, moment }
  } = Module.NS;

  @initialize
  @partOf(Module)
  class ComplexObjectTransform extends ObjectTransform {
    @nameBy static  __filename = __filename;
    @meta static object = {};

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

    // @method static findRecordByName(asName: string): RecordStaticInterface {
    @method static findRecordByName(asName: string): Class<*> {
      const [ vsModuleName, vsRecordName ] = this.parseRecordName(asName);
      return this.Module.NS[vsRecordName];
    }

    @method static async normalize(serialized: ?object): object {
      if (serialized == null) {
        return {};
      }
      const result = {};
      for (const key in serialized) {
        if (!hasProp.call(serialized, key)) continue;
        const value = serialized[key];
        result[key] = await (async () => {
          switch (false) {
            case !(_.isString(value) && moment(value, moment.ISO_8601).isValid()):
              return Module.NS.DateTransform.normalizeSync(value);
            case !_.isString(value):
              return Module.NS.StringTransform.normalizeSync(value);
            case !_.isNumber(value):
              return Module.NS.NumberTransform.normalizeSync(value);
            case !_.isBoolean(value):
              return Module.NS.BooleanTransform.normalizeSync(value);
            case !(_.isPlainObject(value) && /.{2,}[:][:].{2,}/.test(value.type)):
              const RecordClass = this.findRecordByName(value.type);
              // NOTE: в правильном использовании вторым аргументом должна передаваться ссылка на коллекцию, то тут мы не можем ее получить
              // а так как рекорды в этом случае используются ТОЛЬКО для оформления структуры и хранения данных внутри родительского рекорда, то коллекции физически просто нет.
              const [bh, normalized] = await RecordClass.normalize(item);
              // return await RecordClass.normalize(value);
              return await RecordClass.new(normalized);
            case !_.isPlainObject(value):
              return await Module.NS.ComplexObjectTransform.normalize(value);
            case !_.isArray(value):
              return await Module.NS.ComplexArrayTransform.normalize(value);
            default:
              return Module.NS.Transform.normalizeSync(value);
          }
        })();
      }
      return result;
    }

    @method static async serialize(deserialized: ?object): object {
      if (deserialized == null) {
        return {};
      }
      const result = {};
      for (const key in deserialized) {
        if (!hasProp.call(deserialized, key)) continue;
        const value = deserialized[key];
        result[key] = await (async () => {
          switch (false) {
            case !_.isString(value):
              return Module.NS.StringTransform.serializeSync(value);
            case !_.isNumber(value):
              return Module.NS.NumberTransform.serializeSync(value);
            case !_.isBoolean(value):
              return Module.NS.BooleanTransform.serializeSync(value);
            case !_.isDate(value):
              return Module.NS.DateTransform.serializeSync(value);
            case !(_.isObject(value) && /.{2,}[:][:].{2,}/.test(value.type)):
              const RecordClass = this.findRecordByName(value.type);
              return await RecordClass.serialize(value);
            case !_.isPlainObject(value):
              return await Module.NS.ComplexObjectTransform.serialize(value);
            case !_.isArray(value):
              return await Module.NS.ComplexArrayTransform.serialize(value);
            default:
              return Module.NS.Transform.serializeSync(value);
          }
        })();
      }
      return result;
    }

    @method static objectize(deserialized: ?object): object {
      if (deserialized == null) {
        return {};
      }
      const result = {};
      for (const key in deserialized) {
        if (!hasProp.call(deserialized, key)) continue;
        const value = deserialized[key];
        result[key] = (() => {
          switch (false) {
            case !_.isString(value):
              return Module.NS.StringTransform.objectize(value);
            case !_.isNumber(value):
              return Module.NS.NumberTransform.objectize(value);
            case !_.isBoolean(value):
              return Module.NS.BooleanTransform.objectize(value);
            case !_.isDate(value):
              return Module.NS.DateTransform.objectize(value);
            case !(_.isObject(value) && /.{2,}[:][:].{2,}/.test(value.type)):
              const RecordClass = this.findRecordByName(value.type);
              return RecordClass.objectize(value);
            case !_.isPlainObject(value):
              return Module.NS.ComplexObjectTransform.objectize(value);
            case !_.isArray(value):
              return Module.NS.ComplexArrayTransform.objectize(value);
            default:
              return Module.NS.Transform.objectize(value);
          }
        })();
      }
      return result;
    }
  }
}
