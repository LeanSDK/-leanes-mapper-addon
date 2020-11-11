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

export default (Module) => {
  const {
    initializeMixin, meta, property, method,
    Utils: { _ }
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin<
      D = RecordInterface
    > extends BaseClass {
      @meta static object = {};

      // ipoCollection = PointerT(this.protected({
      @property _collection: {[key: string | number]: ?object} = {};//null;

      // @method onRegister() {
      //   super.onRegister(... arguments);
      //   this._collection = {};
      // }

      @method async push(aoRecord: D): Promise<D> {
        const id = aoRecord.id;
        if (id == null) {
          return false;
        }
        this._collection[id] = await this.serializer.serialize(aoRecord);
        return await this.serializer.normalize(
          this.delegate, this._collection[id]
        );
      }

      @method async remove(id: string | number): Promise<void> {
        delete this._collection[id];
      }

      @method async take(id: string | number): Promise<?D> {
        return await this.serializer.normalize(
          this.delegate, this._collection[id]
        );
      }

      @method async takeMany(ids: Array<string | number>): Promise<CursorInterface<CollectionInterface<D>, D>> {
        return Module.NS.Cursor.new(
          this, ids.map((id) => this._collection[id])
        );
      }

      @method async takeAll(): Promise<CursorInterface<CollectionInterface<D>, D>> {
        return Module.NS.Cursor.new(this, _.values(this._collection));
      }

      @method async override(id: string | number, aoRecord: D): Promise<D> {
        this._collection[id] = await this.serializer.serialize(aoRecord);
        return await this.serializer.normalize(
          this.delegate, this._collection[id]
        );
      }

      @method async includes(id: string | number): Promise<boolean> {
        return this._collection[id] != null;
      }

      @method async length(): Promise<number> {
        return Object.keys(this._collection).length;
      }
    }
    return Mixin;
  });
}
