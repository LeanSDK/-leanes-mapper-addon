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

import _ from 'lodash';
import assert from 'assert';

import type { AttributeOptionsT } from '../types/AttributeOptionsT';
import type { AttributeConfigT } from '../types/AttributeConfigT';

const cpoMetaObject = Symbol.for('~metaObject');

export default function attribute(opts: AttributeOptionsT) {
  return (target, key, descriptor) => {
    const isClass = target[cpoMetaObject] != null;
    assert(!isClass, 'Decorator `attribute` may be used with instance properties only');
    const vcClass = target.constructor;
    assert(vcClass.isExtensible, `Class '${target.name}' has been frozen previously. Property '${key}' can not be declared`);

    assert(opts.type != null, 'option `type` is required');
    assert(vcClass.attributes[key] == null, `attribute \`${key}\` has been defined previously`);

    opts.transform = opts.transform || (function () {
      switch (opts.type) {
        case 'primary_key':
          return () => vcClass.Module.NS.PrimaryKeyTransform;
        case 'string':
        case 'text':
          return () => vcClass.Module.NS.StringTransform;
        case 'date':
          return () => vcClass.Module.NS.DateTransform;
        case 'number':
        case 'decimal':
        case 'float':
        case 'integer':
          return () => vcClass.Module.NS.NumberTransform;
        case 'boolean':
          return () => vcClass.Module.NS.BooleanTransform;
        case 'array':
          return () => vcClass.Module.NS.ArrayTransform;
        case 'hash':
        case 'json':
          return () => vcClass.Module.NS.ObjectTransform;
        default:
          return () => vcClass.Module.NS.Transform;
      }
    })();

    opts.validate = opts.validate || function() {
      return opts.transform.call(this).schema;
    };

    const newDescriptor = (function() {
      if (descriptor.get == null && descriptor.set == null) {
        const initialValue = descriptor.value || descriptor.initializer && descriptor.initializer();
        const pointer = Symbol(`_${key}`);
        Reflect.defineProperty(target, pointer, {
          writable: true,
          enumerable: false,
          value: initialValue
        });
        return {
          configurable: true,
          enumerable: true,
          get: function() {
            return this[pointer];
          },
          set: function(aoData) {
            const {
              value: voData
            } = opts.validate.call(this).validate(aoData);
            this[pointer] = voData;
            return voData;
          },
        };
      } else {
        return {
          configurable: true,
          enumerable: true,
          get: function() {
            const externalGet = descriptor.get;
            if (_.isFunction(externalGet)) {
              return externalGet.call(this);
            }
          },
          set: function(aoData) {
            const {
              value: voData
            } = opts.validate.call(this).validate(aoData);
            const externalSet = descriptor.set;
            if (_.isFunction(externalSet)) {
              return externalSet.call(this, voData);
            }
          },
        };
      }
    })();

    (opts: AttributeConfigT);

    vcClass.metaObject.addMetaData('attributes', key, opts);
    vcClass.metaObject.addMetaData('instanceVariables', key, newDescriptor);

    return newDescriptor;
  };
}
