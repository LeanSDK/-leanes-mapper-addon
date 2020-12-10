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

export default (Module) => {
  const {
    HTTP_ADAPTER, HTTP_SERIALIZER, SERIALIZER, MEMORY_ADAPTER,
    initializeMixin, meta, method,
    Utils: { _ }
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @method initializeFacade(): void {
        super.initializeFacade(... arguments)
        if (!this.isBound('CollectionFactory<*>')) {
          this.bind('CollectionFactory<*>').toFactory((context) => {
            return (collectionName: string) => {
              return this.get(`Factory<${collectionName}>`)()
            }
          });
        }
        if (!this.isBound(SERIALIZER)) {
          this.bind(SERIALIZER).to(this.Module.NS.Serializer);
        }
        if (!this.isBound('SerializerFactory<*>')) {
          this.bind('SerializerFactory<*>').toFactory((context) => {
            return (name: string, customSerializer: ?string = SERIALIZER) => {
              const serializer = this.get(customSerializer);
              serializer.collectionName = name;
              return serializer;
            }
          });
        }
        if (!this.isBound('Objectizer')) {
          this.bind('Objectizer').to(this.Module.NS.Objectizer);
        }
        if (!this.isBound('ObjectizerFactory<*>')) {
          this.bind('ObjectizerFactory<*>').toFactory((context) => {
            return (name: string, customObjectizer: ?string = 'Objectizer') => {
              const objectizer = this.get(customObjectizer);
              objectizer.collectionName = name;
              return objectizer;
            }
          });
        }
        if (!this.isBound('RecordNewable<*>')) {
          this.bind('RecordNewable<*>').toFactory((context) => {
            return (delegate: string) => {
              if (!this.isBound(`Newable<${delegate}>`)) {
                const RecordClass = this.ApplicationModule.NS[delegate];
                this.bind(`Newable<${delegate}>`).toConstructor(RecordClass);
              }
              return this.get(`Newable<${delegate}>`);
            }
          });
        }
        if (!this.isBound('RecordFactory<*>')) {
          this.bind('RecordFactory<*>').toFactory((context) => {
            return (recordClass: string, payload: object, collectionName: string) => {
              const RecordClass = this.get('RecordNewable<*>')(recordClass);
              const collection = this.get('CollectionFactory<*>')(collectionName);
              // payload._container = this._container;
              // return RecordClass.new(payload, collection);
              const record = RecordClass.new(payload, collection);
              Reflect.defineProperty(record, '_container', {
                configurable: true,
                enumerable: true,
                get: () => this._container,
              });
              return record;
            }
          });
        }
        if (!this.isBound('Cursor')) {
          this.bind('Cursor').to(this.Module.NS.Cursor);
        }
        if (!this.isBound('CursorFactory<*>')) {
          this.bind('CursorFactory<*>').toFactory((context) => {
            return (name: ?string, list, customCursor: ?string = 'Cursor') => {
              const cursor = this.get(customCursor);
              cursor.collectionName = name;
              cursor.setIterable(list);
              return cursor;
            }
          });
        }
        this.addAdapter(MEMORY_ADAPTER, 'MemoryAdapter');
        this.addAdapter(HTTP_ADAPTER, 'HttpAdapter');
        if (!this.isBound('AdapterFactory<*>')) {
          this.bind('AdapterFactory<*>').toFactory((context) => {
            return (name: ?string, customAdapter: ?string = MEMORY_ADAPTER) => {
              return this.get(`Factory<${customAdapter}>`)();
            }
          });
        }
      }
    }
    return Mixin;
  });
}
