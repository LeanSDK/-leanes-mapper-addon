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
    HTTP_ADAPTER, HTTP_SERIALIZER,
    initializePatch, meta, method,
    Utils: { _ }
  } = Module.NS;

  Module.definePatch(__filename, (BaseClass) => {
    @initializePatch
    class Patch extends BaseClass {
      @meta static object = {};

      @method initializeFacade(): void {
        super.initializeFacade(... arguments)
        if (!this.container.isBound('CollectionFactory<*>')) {
          this.container.bind('CollectionFactory<*>').toFactory((context) => {
            return (collectionName: string) => {
              return this.container.get(`Factory<${collectionName}>`)()
            }
          });
        }
        if (!this.container.isBound(HTTP_SERIALIZER)) {
          this.container.bind(HTTP_SERIALIZER).to(this.Module.NS.HttpSerializer);
        }
        if (!this.container.isBound('SerializerFactory<*>')) {
          this.container.bind('SerializerFactory<*>').toFactory((context) => {
            return (name: string, customSerializer: ?string = HTTP_SERIALIZER) => {
              const serializer = this.container.get(customSerializer);
              serializer.collectionName = name;
              return serializer;
            }
          });
        }
        if (!this.container.isBound('Objectizer')) {
          this.container.bind('Objectizer').to(this.Module.NS.Objectizer);
        }
        if (!this.container.isBound('ObjectizerFactory<*>')) {
          this.container.bind('ObjectizerFactory<*>').toFactory((context) => {
            return (name: string, customObjectizer: ?string = 'Objectizer') => {
              const objectizer = this.container.get(customObjectizer);
              objectizer.collectionName = name;
              return objectizer;
            }
          });
        }
        if (!this.container.isBound('RecordNewable<*>')) {
          this.container.bind('RecordNewable<*>').toFactory((context) => {
            return (delegate: string) => {
              if (!this.container.isBound(`Newable<${delegate}>`)) {
                const RecordClass = this.ApplicationModule.NS[delegate];
                this.container.bind(`Newable<${delegate}>`).toConstructor(RecordClass);
              }
              return this.container.get(`Newable<${delegate}>`);
            }
          });
        }
        if (!this.container.isBound('RecordFactory<*>')) {
          this.container.bind('RecordFactory<*>').toFactory((context) => {
            return (recordClass: string, payload: object, collectionName: string) => {
              const RecordClass = this.container.get('RecordNewable<*>')(recordClass);
              const collection = this.container.get('CollectionFactory<*>')(collectionName);
              return RecordClass.new(payload, collection);
            }
          });
        }
        if (!this.container.isBound('Cursor')) {
          this.container.bind('Cursor').to(this.Module.NS.Cursor);
        }
        if (!this.container.isBound('CursorFactory<*>')) {
          this.container.bind('CursorFactory<*>').toFactory((context) => {
            return (name: ?string, list, customCursor: ?string = 'Cursor') => {
              const cursor = this.container.get(customCursor);
              cursor.collectionName = name;
              cursor.setIterable(list);
              return cursor;
            }
          });
        }
        this.addAdapter(HTTP_ADAPTER, 'HttpAdapter');
        if (!this.container.isBound('AdapterFactory<*>')) {
          this.container.bind('AdapterFactory<*>').toFactory((context) => {
            return (name: ?string, customAdapter: ?string = HTTP_ADAPTER) => {
              return this.container.get(customAdapter);
            }
          });
        }
      }
    }
    return Patch;
  });
}
