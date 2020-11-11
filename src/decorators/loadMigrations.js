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

const cpoMetaObject = Symbol.for('~metaObject');
const cphMigrationsMap = Symbol.for('~migrationsMap');

export default function loadMigrations({ filesTreeSync }) {
  (filesTreeSync: (string, ?object) => string[]);
  return target => {
    assert(target[cpoMetaObject] != null, 'Target for `loadMigrations` decorator must be a Class');
    const vsRoot = target.prototype.ROOT != null ? target.prototype.ROOT : '.';
    const vsMigratonsDir = `${vsRoot}/migrations`;
    const files = filesListSync(vsMigratonsDir);
    const migrationsMap = (files != null ? files : []).reduce((mp, i) => {
      const vsPathMatch = i.match(/([\w\-\_]+)\.js$/);
      const [blackhole, migrationName] = vsPathMatch != null ? vsPathMatch : [];
      if (migrationName != null && migrationName !== 'BaseMigration' && !/^\./.test(i)) {
        mp[migrationName] = `${vsMigratonsDir}/${migrationName}`;
      }
      return mp;
    }, {});
    Reflect.defineProperty(target, cphMigrationsMap, {
      enumerable: true,
      writable: true,
      value: migrationsMap
    });
    return target;
  }
};
