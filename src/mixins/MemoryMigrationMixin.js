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
        collectionName1: string,
        collectionName2: string,
        options: ?object
      ): Promise<void> {
        return;
      }

      @method async addField(
        collectionName: string,
        fieldName: string,
        options: $Values<SUPPORTED_TYPES> | {
          type: $Values<SUPPORTED_TYPES>, 'default': any
        }
      ): Promise<void> {
        if (_.isString(options)) {
          return;
        }
        const collectionName = `${inflect.camelize(collectionName)}Collection`;
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
          if (doc[fieldName] == null) {
            doc[fieldName] = initial;
          }
        }
      }

      @method async addIndex(
        collectionName: string,
        fieldNames: string[],
        options: {
          type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
          unique: ?boolean,
          sparse: ?boolean
        }
      ): Promise<void> {
        return;
      }

      @method async addTimestamps(
        collectionName: string,
        options: ?object = {}
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collectionName)}Collection`;
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
        collectionName: string,
        fieldName: string,
        options: $Values<SUPPORTED_TYPES> | {
          type: $Values<SUPPORTED_TYPES>
        } = {}
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collectionName)}Collection`;
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
              doc[fieldName] = Boolean(doc[fieldName]);
              break;
            case SUPPORTED_TYPES.decimal:
            case SUPPORTED_TYPES.float:
            case SUPPORTED_TYPES.integer:
            case SUPPORTED_TYPES.number:
              doc[fieldName] = Number(doc[fieldName]);
              break;
            case SUPPORTED_TYPES.string:
            case SUPPORTED_TYPES.text:
            case SUPPORTED_TYPES.primary_key:
            case SUPPORTED_TYPES.binary:
              doc[fieldName] = String(JSON.stringify(doc[fieldName]));
              break;
            case SUPPORTED_TYPES.json:
            case SUPPORTED_TYPES.hash:
            case SUPPORTED_TYPES.array:
              doc[fieldName] = JSON.parse(String(doc[fieldName]));
              break;
            case SUPPORTED_TYPES.date:
            case SUPPORTED_TYPES.datetime:
              doc[fieldName] = new Date(String(doc[fieldName])).toISOString();
              break;
            case SUPPORTED_TYPES.time:
            case SUPPORTED_TYPES.timestamp:
              doc[fieldName] = new Date(String(doc[fieldName])).getTime();
          }
        }
      }

      @method async renameField(
        collectionName: string,
        fieldName: string,
        newFieldName: string
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collectionName)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const collection = memCollection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          doc[newFieldName] = doc[fieldName];
          delete doc[fieldName];
        }
      }

      @method async renameIndex(
        collectionName: string,
        oldCollectionName: string,
        newCollectionName: string
      ): Promise<void> {
        return;
      }

      @method async renameCollection(
        collectionName: string,
        newCollectionName: string
      ): Promise<void> {
        return;
      }

      @method async dropCollection(
        collectionName: string
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collectionName)}Collection`;
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
        collectionName1: string,
        collectionName2: string
      ): Promise<void> {
        const qualifiedName = `${collectionName1}_${collectionName2}`;
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
        collectionName: string,
        fieldName: string
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collectionName)}Collection`;
        const memCollection = this.collection
          .facade
          .retrieveProxy(collectionName);
        const collection = memCollection._collection;
        for (const id in collection) {
          if (!hasProp.call(collection, id)) continue;
          const doc = collection[id];
          delete doc[fieldName];
        }
      }

      @method async removeIndex(
        collectionName: string,
        fieldNames: string[],
        options: {
          type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
          unique: ?boolean,
          sparse: ?boolean
        }
      ): Promise<void> {
        return;
      }

      @method async removeTimestamps(
        collectionName: string,
        options: ?object = {}
      ): Promise<void> {
        const collectionName = `${inflect.camelize(collectionName)}Collection`;
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
