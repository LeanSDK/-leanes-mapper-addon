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
    initializeMixin, meta, attribute, method,
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @attribute({
        type: 'boolean',
        validate: () => joi.boolean().empty(null).default(false)
      }) isHidden = false;

      @method async beforeDelete(...args) {
        await super.beforeDelete(...args);
        this.isHidden = true;
        return args;
      }

      @method async 'delete'(): Promise<void> {
        if (await this.isNew()) {
          assert.fail('Document is not exist in collection');
        }
        await this.save();
      }
    }
    return Mixin;
  });
}
