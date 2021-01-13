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

import type { CollectionInterface } from '../interfaces/CollectionInterface';
import type { RecordInterface } from '../interfaces/RecordInterface';
import type { CursorInterface } from '../interfaces/CursorInterface';
import type { DriverInterface } from '../interfaces/DriverInterface';

export default (Module) => {
  const {
    initializeMixin, meta, property, method,
    Utils: { _, assert }
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin<
      R = Class<*>, T = object
      > extends BaseClass implements DriverInterface<R, T> {
      @meta static object = {};

      @property _collection: { [key: string | number]: ?object } = {};

      @method async push(aoRecord: R, snapshot: T): Promise<T> {
        const id = snapshot.id;
        assert(id != null, '`id` should be not null');
        this._collection[id] = snapshot;
        return this._collection[id];
      }

      @method async remove(acRecord: R, id: string | number): Promise<void> {
        delete this._collection[id];
      }

      @method async take(acRecord: R, id: string | number): Promise<?T> {
        return this._collection[id];
      }

      @method async takeMany(acRecord: R, ids: Array<string | number>): Promise<T[]> {
        return ids.map((id) => this._collection[id])
      }

      @method async takeAll(acRecord: R): Promise<T[]> {
        return _.values(this._collection)
      }

      @method async override(acRecord: R, id: string | number, snapshot: T): Promise<T> {
        this._collection[id] = snapshot;
        return this._collection[id]
      }

      @method async includes(acRecord: R, id: string | number): Promise<boolean> {
        return this._collection[id] != null;
      }

      @method async length(acRecord: R): Promise<number> {
        return Object.keys(this._collection).length;
      }
    }
    return Mixin;
  });
}
