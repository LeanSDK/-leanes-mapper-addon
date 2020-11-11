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

const hasProp = {}.hasOwnProperty;

export default (Module) => {
  const {
    UP, DOWN, SUPPORTED_TYPES,
    initializeMixin, meta, property, method,
    Utils: { _, inflect }
  } = Module.NS;


  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @method async createCollection(
        name: string,
        options: ?object
      ): Promise<void> {
        return;
      }

      @method async createEdgeCollection(
        collection_1: string,
        collection_2: string,
        options: ?object
      ): Promise<void> {
        return;
      }

      @method async addField(
        collection_name: string,
        field_name: string,
        options: $Values<SUPPORTED_TYPES> | {
          type: $Values<SUPPORTED_TYPES>, 'default': any
        }
      ): Promise<void> {
        if (_.isString(options)) {
          return;
        }
        const collectionName = `${inflect.camelize(collection_name)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const initial = options.default != null
          ? _.isNumber(options.default) || _.isBoolean(options.default)
            ? options.default
            : _.isDate(options.default)
              ? options.default.toISOString()
              : _.isString(options.default)
                ? `${options.default}`
                : null
          : null;
        const collection = memCollection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          if (doc[field_name] == null) {
            doc[field_name] = initial;
          }
        }
      }

      @method async addIndex(
        collection_name: string,
        field_names: string[],
        options: {
          type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
          unique: ?boolean,
          sparse: ?boolean
        }
      ): Promise<void> {
        return;
      }

      @method async addTimestamps(
        collection_name: string,
        options: ?object = {}
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collection_name)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const collection = memCollection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          if (doc.createdAt == null) {
            doc.createdAt = null;
          }
          if (doc.updatedAt == null) {
            doc.updatedAt = null;
          }
          if (doc.deletedAt == null) {
            doc.deletedAt = null;
          }
        }
      }

      @method async changeCollection(
        name: string,
        options: object
      ): Promise<void> {
        return;
      }

      @method async changeField(
        collection_name: string,
        field_name: string,
        options: $Values<SUPPORTED_TYPES> | {
          type: $Values<SUPPORTED_TYPES>
        } = {}
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collection_name)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const type = _.isString(options) ? options : options.type;
        const collection = memCollection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          switch (type) {
            case SUPPORTED_TYPES.boolean:
              doc[field_name] = Boolean(doc[field_name]);
              break;
            case SUPPORTED_TYPES.decimal:
            case SUPPORTED_TYPES.float:
            case SUPPORTED_TYPES.integer:
            case SUPPORTED_TYPES.number:
              doc[field_name] = Number(doc[field_name]);
              break;
            case SUPPORTED_TYPES.string:
            case SUPPORTED_TYPES.text:
            case SUPPORTED_TYPES.primary_key:
            case SUPPORTED_TYPES.binary:
              doc[field_name] = String(JSON.stringify(doc[field_name]));
              break;
            case SUPPORTED_TYPES.json:
            case SUPPORTED_TYPES.hash:
            case SUPPORTED_TYPES.array:
              doc[field_name] = JSON.parse(String(doc[field_name]));
              break;
            case SUPPORTED_TYPES.date:
            case SUPPORTED_TYPES.datetime:
              doc[field_name] = new Date(String(doc[field_name])).toISOString();
              break;
            case SUPPORTED_TYPES.time:
            case SUPPORTED_TYPES.timestamp:
              doc[field_name] = new Date(String(doc[field_name])).getTime();
          }
        }
      }

      @method async renameField(
        collection_name: string,
        field_name: string,
        new_field_name: string
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collection_name)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const collection = memCollection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          doc[new_field_name] = doc[field_name];
          delete doc[field_name];
        }
      }

      @method async renameIndex(
        collection_name: string,
        old_name: string,
        new_name: string
      ): Promise<void> {
        return;
      }

      @method async renameCollection(
        collection_name: string,
        new_name: string
      ): Promise<void> {
        return;
      }

      @method async dropCollection(
        collection_name: string
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collection_name)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const collection = this.collection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          delete memCollection._collection[id];
        }
        memCollection._collection = {};
      }

      @method async dropEdgeCollection(
        collection_1: string,
        collection_2: string
      ): Promise<void> {
        const qualifiedName = `${collection_1}_${collection_2}`;
        const collectionName = `${inflect.camelize(qualifiedName)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const collection = this.collection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          delete memCollection._collection[id];
        }
        memCollection._collection = {};
      }

      @method async removeField(
        collection_name: string,
        field_name: string
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collection_name)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const collection = memCollection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          delete doc[field_name];
        }
      }

      @method async removeIndex(
        collection_name: string,
        field_names: string[],
        options: {
          type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
          unique: ?boolean,
          sparse: ?boolean
        }
      ): Promise<void> {
        return;
      }

      @method async removeTimestamps(
        collection_name: string,
        options: ?object = {}
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collection_name)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const collection = memCollection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          delete doc.createdAt;
          delete doc.updatedAt;
          delete doc.deletedAt;
        }
      }
    }
    return Mixin;
  });
}
