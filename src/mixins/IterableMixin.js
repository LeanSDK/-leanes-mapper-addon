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

import type { IterableInterface } from '../interfaces/IterableInterface';
import type { RecordInterface } from '../interfaces/RecordInterface';

export default (Module) => {
  const {
    assert,
    initializeMixin, meta, method,
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass implements IterableInterface<RecordInterface> {
      @meta static object = {};

      @method async forEach(lambda: (RecordInterface, number) => Promise<void>): Promise<void> {
        const cursor = await this.takeAll();
        await cursor.forEach(async (item, index) => {
          await lambda(item, index);
        });
      }

      @method async filter(lambda: (RecordInterface, number) => Promise<boolean>): Promise<RecordInterface[]> {
        const cursor = await this.takeAll();
        return await cursor.filter(async (item, index) =>
          await lambda(item, index)
        );
      }

      @method async map<R>(lambda: (RecordInterface, number) => Promise<R>): Promise<R[]> {
        const cursor = await this.takeAll();
        return await cursor.map(async (item, index) =>
          await lambda(item, index)
        );
      }

      @method async reduce<I>(lambda: (I, RecordInterface, number) => Promise<I>, initialValue: I): Promise<I> {
        const cursor = await this.takeAll();
        return await cursor.reduce((async (prev, item, index) =>
          await lambda(prev, item, index)
        ), initialValue);
      }
    }
    return Mixin;
  });
}
