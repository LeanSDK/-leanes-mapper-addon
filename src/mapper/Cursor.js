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

import type { RecordInterface } from '../interfaces/RecordInterface';
// import type { CollectionInterface } from '../../interfaces/CollectionInterface';
import type { CursorInterface } from '../interfaces/CursorInterface';

import { injectable, inject } from 'inversify';

export default (Module) => {
  const {
    CoreObject,
    assert,
    initialize, partOf, meta, property, method, nameBy,
    Utils: { _ }
  } = Module.NS;

  @initialize
  @injectable()
  @partOf(Module)
  class Cursor<
    C = { normalize: (ahData: any) => Promise<RecordInterface> }, T = Array<?object>
    > extends CoreObject implements CursorInterface<C, RecordInterface, T> {
    @nameBy static __filename = __filename;
    @meta static object = {};

    @property _currentIndex: number = 0;

    @property _array: T;

    @property _collection: ?C;

    @property isClosed: boolean = false;

    @method setCollection(aoCollection: C): CursorInterface<C, RecordInterface, T> {
      this._collection = aoCollection;
      return this;
    }

    @method setIterable(alArray: T): CursorInterface<C, RecordInterface, T> {
      this._array = alArray;
      return this;
    }

    @property collectionName: ?string = null;

    @inject('CollectionFactory<*>')
    @property _collectionFactory: (string) => C;

    @property get collection(): ?C {
      if (this.collectionName != null) {
        return this._collectionFactory(this.collectionName)
      } else {
        return this._collection
      }
    }

    @method async toArray(): Promise<Array<?RecordInterface>> {
      const results = [];
      while ((await this.hasNext())) {
        results.push(await this.next());
      }
      return results;
    }

    @method async next(): Promise<?RecordInterface> {
      const data = (await (this._array[this._currentIndex]));
      this._currentIndex++;
      return await (this.collection != null ? this.collection.normalize(data) : data);
    }

    @method async hasNext(): Promise<boolean> {
      if (_.isNil(this._array)) return false;
      return (await (!_.isNil(this._array[this._currentIndex])));
    }

    @method async close(): Promise<void> {
      let j;
      for (let i = j = 0, len = this._array.length; j < len; i = ++j) {
        delete this._array[i];
      }
      delete this._array;
    }

    @method async count(): Promise<number> {
      const array = this._array || [];
      const length = typeof array.length === "function" ?
        array.length()
        :
        undefined;
      return (await (length || array.length));
    }

    @method async forEach(lambda: (RecordInterface, number) =>?Promise<void>): Promise<void> {
      let index = 0;
      try {
        while (await this.hasNext()) {
          await lambda((await this.next()), index++);
        }
      } catch (error) {
        await this.close();
        throw error;
      }
    }

    @method async map<R>(lambda: (RecordInterface, number) => R | Promise<R>): Promise<Array<?R>> {
      let index = 0;
      try {
        const results = [];
        while (await this.hasNext()) {
          results.push(await lambda((await this.next()), index++));
        }
        return results;
      } catch (error) {
        await this.close();
        throw error;
      }
    }

    @method async filter(lambda: (RecordInterface, number) => boolean | Promise<boolean>): Promise<Array<?RecordInterface>> {
      let index = 0;
      const records = [];
      try {
        while (await this.hasNext()) {
          const record = (await this.next());
          if (await lambda(record, index++)) {
            records.push(record);
          }
        }
        return records;
      } catch (error) {
        await this.close();
        throw error;
      }
    }

    @method async find(lambda: (RecordInterface, number) => boolean | Promise<boolean>): Promise<?RecordInterface> {
      let index = 0;
      let _record = null;
      try {
        while ((await this.hasNext())) {
          const record = (await this.next());
          if ((await lambda(record, index++))) {
            _record = record;
            break;
          }
        }
        return _record;
      } catch (error) {
        await this.close();
        throw error;
      }
    }

    @method async compact(): Promise<Array<?RecordInterface>> {
      const results = [];
      try {
        while (this._currentIndex < (await this.count())) {
          const rawResult = this._array[this._currentIndex];
          ++this._currentIndex;
          if (!_.isEmpty(rawResult)) {
            const result = await (this.collection != null ? this.collection.normalize(rawResult) : rawResult);
            results.push(result);
          }
        }
        return results;
      } catch (error) {
        await this.close();
        throw error;
      }
    }

    @method async reduce<I>(lambda: (I, RecordInterface, number) => I | Promise<I>, initialValue: I): Promise<I> {
      try {
        let index = 0;
        let _initialValue = initialValue;
        while (await this.hasNext()) {
          _initialValue = await lambda(_initialValue, (await this.next()), index++);
        }
        return _initialValue;
      } catch (error) {
        await this.close();
        throw error;
      }
    }

    @method async first(): Promise<?RecordInterface> {
      try {
        const result = (await this.hasNext()) ? (await this.next()) : null;
        await this.close();
        return result;
      } catch (error) {
        await this.close();
        throw error;
      }
    }

    @method static async restoreObject() {
      assert.fail(`restoreObject method not supported for ${this.name}`);
    }

    @method static async replicateObject() {
      assert.fail(`replicateObject method not supported for ${this.name}`);
    }
  }
}
