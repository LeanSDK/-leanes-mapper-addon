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

import assert from 'assert';

const hasProp = {}.hasOwnProperty;

export default function customFilters(config) {
  return (acTarget) => {
    assert(acTarget[cpoMetaObject] != null, 'Target for `customFilters` decorator must be a Class');
    for (const asFilterName in config) {
      if (!hasProp.call(config, asFilterName)) continue;
      const aoStatement = config[asFilterName];
      this.metaObject.addMetaData('customFilters', asFilterName, aoStatement);
    }
    return acTarget;
  }
};
