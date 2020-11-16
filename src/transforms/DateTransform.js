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

import type { JoiT } from '../types/JoiT';

export default (Module) => {
  const {
    CoreObject,
    assert,
    initialize, partOf, meta, property, method, nameBy,
    Utils: { _, joi }
  } = Module.NS;


  @initialize
  @partOf(Module)
  class DateTransform extends CoreObject {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property static get schema(): JoiT {
      return joi.date().iso().allow(null).optional();
    }

    @method static async normalize(...args) {
      return this.normalizeSync(...args);
    }

    @method static async serialize(...args) {
      return this.serializeSync(...args);
    }

    @method static normalizeSync(serialized: ?string): ?date {
      return (_.isNil(serialized) ? null : new Date(serialized));
    }

    @method static serializeSync(deserialized: ?date): ?string {
      if (_.isDate(deserialized) && !_.isNaN(deserialized)) {
        return deserialized.toISOString();
      } else {
        return null;
      }
    }

    @method static objectize(deserialized: ?date): ?string {
      if (_.isDate(deserialized) && !_.isNaN(deserialized)) {
        return deserialized.toISOString();
      } else {
        return null;
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
