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
// import type { TransformStaticInterface } from '../interfaces/TransformStaticInterface';

export default (Module) => {
  const {
    initializeMixin, meta, method,
    Utils: { _, inflect, assert }
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      // @method async normalize(acRecord: TransformStaticInterface, ahPayload: ?any): Promise<?RecordInterface> {
      @method async normalize(acRecord: Class<*>, ahPayload: ?any): Promise<?RecordInterface> {
        if (ahPayload == null) return null;
        assert(_.isString(ahPayload), 'Payload should be a string');
        return await super.normalize(acRecord, JSON.parse(ahPayload));
      }

      @method async serialize(aoRecord: ?RecordInterface, options: ?object = null): Promise<?any> {
        if (aoRecord == null) return null;
        const vcRecord = aoRecord.constructor;
        const recordName = vcRecord.name.replace(/Record$/, '');
        const singular = inflect.singularize(inflect.underscore(recordName));
        return {
          [`${singular}`]: await super.serialize(aoRecord, options)
        };
      }
    }
    return Mixin;
  });
}