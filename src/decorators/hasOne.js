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

import assert from 'assert';
import type { RecordInterface } from '../interfaces/RecordInterface';
import type { RelationOptionsT } from '../types/RelationOptionsT';
import type { RelationConfigT } from '../types/RelationConfigT';

const cpoMetaObject = Symbol.for('~metaObject');

export default function hasOne(opts: RelationOptionsT) {
  return (target, key, descriptor) => {
    const isClass = target[cpoMetaObject] != null;
    assert(!isClass, 'Decorator `hasOne` may be used with instance properties only');
    const vcClass = target.constructor;
    assert(vcClass.isExtensible, `Class '${target.name}' has been frozen previously. Property '${key}' can not be declared`);

    const { _, joi, inflect } = vcClass.Module.NS.Utils;

    opts.refKey = opts.refKey || 'id';
    opts.inverse = opts.inverse || `${inflect.singularize(
      inflect.camelize(this.name.replace(/Record$/, ''), false)
    )}Id`;
    opts.inverseType = opts.inverseType || null;
    opts.recordName = opts.recordName || function(recordType: ?string = null): string {
      let vsModuleName, vsRecordName;
      if (recordType != null) {
        const recordClass = this.findRecordByName(recordType);
        const classNames = _.filter(
          recordClass.parentClassNames(), (name) => /.*Record$/.test(name)
        );
        vsRecordName = classNames[1];
      } else {
        [ vsModuleName, vsRecordName ] = this.parseRecordName(key);
      }
      return vsRecordName;
    };
    opts.collectionName = opts.collectionName || function(recordType: ?string = null): string {
      return `${inflect.pluralize(
        opts.recordName.call(this, recordType).replace(/Record$/, '')
      )}Collection`;
    };

    opts.relation = 'hasOne';

    const newDescriptor = {
      configurable: true,
      enumerable: true,
      get: async function(): Promise<RecordInterface> {
        const HasOneCollection = this.collection
          .facade
          .retrieveProxy(collectionName.call(this));
        // NOTE: может быть ситуация, что hasOne связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)
        if (!opts.through) {
          const query = {
            [`@doc.${opts.inverse}`]: this[opts.refKey]
          };
          if (opts.inverseType != null) {
            query[`@doc.${opts.inverseType}`] = this.type;
          }
          return await (
            await HasOneCollection.takeBy(query, { $limit: 1 })
          ).first();
        } else {
          const embeddings = this.constructor.embeddings;
          const throughEmbed = embeddings && embeddings[opts.through[0]] || this.constructor.relations[opts.through[0]];
          const ThroughCollection = this.collection
            .facade
            .retrieveProxy(throughEmbed.collectionName.call(this));
          const ThroughRecord = this.findRecordByName(throughEmbed.recordName.call(this));
          const inverse = ThroughRecord.relations[opts.through[1].by];
          const oneId = (
            await (
              await ThroughCollection.takeBy({
                [`@doc.${throughEmbed.inverse}`]: this[opts.refKey]
              }, {
                $limit: 1
              })
            ).first()
          )[opts.through[1].by];
          return await (
            await HasOneCollection.takeBy({
              [`@doc.${inverse.refKey}`]: oneId
            }, {
              $limit: 1
            })
          ).first();
        }
      }
    };

    (opts: RelationConfigT);

    vcClass.metaObject.addMetaData('relations', key, opts);
    vcClass.metaObject.addMetaData('instanceVariables', key, newDescriptor);

    return newDescriptor;
  };
}
