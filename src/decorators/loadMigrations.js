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

export default function loadMigrations(Module) {
  assert(Module[cpoMetaObject] != null, 'Target for `loadMigrations` decorator must be a Class');
  const {
    FsUtils
  } = Module.NS;
  assert(FsUtils != null, 'Target for `loadMigrations` decorator should has FsUtilsAddon');
  const {
    Utils: { filesListSync }
  } = FsUtils.NS;

  (filesListSync: (string, ?object) => string[]);

  const vsRoot = Module.prototype.ROOT != null ? Module.prototype.ROOT : '.';
  const vsMigratonsDir = `${vsRoot}/migrations`;
  const files = filesListSync(vsMigratonsDir);
  const migrationsMap = (files != null ? files : []).reduce((mp, i) => {
    const vsPathMatch = i.match(/([\w\-\_]+)\.js$/);
    const [blackhole, migrationName] = vsPathMatch != null ? vsPathMatch : [];
    if (migrationName != null && migrationName !== 'BaseMigration' && !/^\./.test(i)) {
      mp[migrationName] = `${vsMigratonsDir}/${migrationName.replace(/\.js/, '')}`;
    }
    return mp;
  }, {});
  Reflect.defineProperty(Module, cphMigrationsMap, {
    enumerable: true,
    writable: true,
    value: migrationsMap
  });
  return Module;
}
