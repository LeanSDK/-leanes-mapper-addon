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

import type { RelationConfigT } from '../types/RelationConfigT';
import type { RelationInverseT } from '../types/RelationInverseT';

export default (Module) => {
  const {
    initializeMixin, meta, property, method,
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @method static inverseFor(asAttrName: string): RelationInverseT {
        const opts = this.relations[asAttrName];
        const RecordClass = this.findRecordByName(opts.recordName.call(this));
        const { inverse: attrName } = opts;
        const { relation } = RecordClass.relations[attrName];
        return {
          recordClass: RecordClass,
          attrName,
          relation
        };
      }

      @property static get relations(): {[key: string]: RelationConfigT} {
        return this.metaObject.getGroup('relations', false);
      }
    }
    return Mixin;
  });
}
