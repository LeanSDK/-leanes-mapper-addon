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

import type { RecordStaticInterface } from '../interfaces/RecordStaticInterface';
import type { JoiT } from '@leansdk/leanes/src/leanes';

export default (Module) => {
  const {
    ArrayTransform,
    assert,
    initialize, partOf, meta, method, nameBy,
    Utils: { _, inflect, moment }
  } = Module.NS;

  @initialize
  @partOf(Module)
  class ComplexArrayTransform extends ArrayTransform {
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

    @method static findRecordByName(asName: string): $Diff<RecordStaticInterface, {}> {
      const [ vsModuleName, vsRecordName ] = this.parseRecordName(asName);
      return this.Module.NS[vsRecordName];
    }

    @method static async normalize(serialized: ?Array): Array {
      if (serialized == null) {
        return [];
      }
      const result = [];
      for (const item of serialized) {
        switch (false) {
          case !(_.isString(item) && moment(item, moment.ISO_8601).isValid()):
            result.push(Module.NS.DateTransform.normalizeSync(item));
            break;
          case !_.isString(item):
            result.push(Module.NS.StringTransform.normalizeSync(item));
            break;
          case !_.isNumber(item):
            result.push(Module.NS.NumberTransform.normalizeSync(item));
            break;
          case !_.isBoolean(item):
            result.push(Module.NS.BooleanTransform.normalizeSync(item));
            break;
          case !(_.isPlainObject(item) && /.{2,}[:][:].{2,}/.test(item.type)):
            const RecordClass = this.findRecordByName(item.type);
            // NOTE: в правильном использовании вторым аргументом должна передаваться ссылка на коллекцию, то тут мы не можем ее получить
            // а так как рекорды в этом случае используются ТОЛЬКО для оформления структуры и хранения данных внутри родительского рекорда, то коллекции физически просто нет.
            const [bh, normalized] = await RecordClass.normalize(item);
            // result.push(await RecordClass.normalize(item));
            result.push(RecordClass.new(normalized));
            break;
          case !_.isPlainObject(item):
            result.push(await Module.NS.ComplexObjectTransform.normalize(item));
            break;
          case !_.isArray(item):
            result.push(await Module.NS.ComplexArrayTransform.normalize(item));
            break;
          default:
            result.push(Module.NS.Transform.normalizeSync(item));
        }
      }
      return result;
    }

    @method static async serialize(deserialized: ?Array): Array {
      if (deserialized == null) {
        return [];
      }
      const result = [];
      for (const item of deserialized) {
        switch (false) {
          case !_.isString(item):
            result.push(Module.NS.StringTransform.serializeSync(item));
            break;
          case !_.isNumber(item):
            result.push(Module.NS.NumberTransform.serializeSync(item));
            break;
          case !_.isBoolean(item):
            result.push(Module.NS.BooleanTransform.serializeSync(item));
            break;
          case !_.isDate(item):
            result.push(Module.NS.DateTransform.serializeSync(item));
            break;
          case !(_.isObject(item) && /.{2,}[:][:].{2,}/.test(item.type)):
            const RecordClass = this.findRecordByName(item.type);
            result.push(await RecordClass.serialize(item));
            break;
          case !_.isPlainObject(item):
            result.push(await Module.NS.ComplexObjectTransform.serialize(item));
            break;
          case !_.isArray(item):
            result.push(await Module.NS.ComplexArrayTransform.serialize(item));
            break;
          default:
            result.push(Module.NS.Transform.serializeSync(item));
        }
      }
      return result;
    }

    @method static objectize(deserialized: ?Array): Array {
      if (deserialized == null) {
        return [];
      }
      const result = [];
      for (const item of deserialized) {
        switch (false) {
          case !_.isString(item):
            result.push(Module.NS.StringTransform.objectize(item));
            break;
          case !_.isNumber(item):
            result.push(Module.NS.NumberTransform.objectize(item));
            break;
          case !_.isBoolean(item):
            result.push(Module.NS.BooleanTransform.objectize(item));
            break;
          case !_.isDate(item):
            result.push(Module.NS.DateTransform.objectize(item));
            break;
          case !(_.isObject(item) && /.{2,}[:][:].{2,}/.test(item.type)):
            const RecordClass = this.findRecordByName(item.type);
            result.push(RecordClass.objectize(item));
            break;
          case !_.isPlainObject(item):
            result.push(Module.NS.ComplexObjectTransform.objectize(item));
            break;
          case !_.isArray(item):
            result.push(Module.NS.ComplexArrayTransform.objectize(item));
            break;
          default:
            result.push(Module.NS.Transform.objectize(item));
        }
      }
      return result;
    }
  }
}
