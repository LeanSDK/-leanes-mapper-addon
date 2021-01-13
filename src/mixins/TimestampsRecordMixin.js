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

export default (Module) => {
  const {
    initializeMixin, meta, attribute, method,
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @attribute({ type: 'date' }) createdAt = null;
      @attribute({ type: 'date' }) updatedAt = null;
      @attribute({ type: 'date' }) deletedAt = null;

      @method async beforeCreate(...args) {
        await super.beforeCreate(...args);
        const now = new Date();
        if (this.createdAt == null) {
          this.createdAt = now;
        }
        if (this.updatedAt == null) {
          this.updatedAt = now;
        }
        return args;
      }

      @method async beforeUpdate(...args) {
        await super.beforeUpdate(...args);
        this.updatedAt = new Date();
        return args;
      }

      @method async beforeDelete(...args) {
        await super.beforeDelete(...args);
        const now = new Date();
        this.updatedAt = now;
        this.deletedAt = now;
        return args;
      }

      @method async touch(): Promise<RecordInterface> {
        this.updatedAt = new Date();
        return await this.save();
      }
    }
    return Mixin;
  });
}
