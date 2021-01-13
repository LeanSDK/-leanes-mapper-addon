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
    initializeMixin, meta, property, method, constant,
    Utils: { _ }
  } = Module.NS;

  const cpoMigrationsNames = Symbol.for('~migrationsNames');
  const cphMigrationsMap = Symbol.for('~migrationsMap');
  const cpoMigrations = Symbol.for('~migrations');
  const cphPathMap = Symbol.for('~pathMap');
  const cpmMigrationsHandler = Symbol.for('~migrationsHandler');

  return ['MigratableModule', (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @property get Migrations() {
        const MClass = this.constructor;
        return MClass[cpoMigrations] != null ? MClass[cpoMigrations] : MClass[cpoMigrations] = new Proxy(MClass, MClass[cpmMigrationsHandler]);
      }

      @constant get MIGRATION_NAMES() {
        const MClass = this.constructor;
        // console.log('SchemaModuleMixin::MIGRATION_NAMES', MClass, MClass[cphMigrationsMap]);
        return MClass[cpoMigrationsNames] != null
          ? MClass[cpoMigrationsNames]
          : MClass[cpoMigrationsNames] = _.orderBy(Object.keys(MClass[cphMigrationsMap] || {}));
      }

      @method static requireMigrations(): void {
        this.prototype.MIGRATION_NAMES.forEach((migrationName) => {
          this.prototype.Migrations[migrationName];
        });
      }
    }

    Reflect.defineProperty(Mixin, cpoMigrationsNames, {
      enumerable: true,
      writable: true,
      value: null
    });

    // Reflect.defineProperty(Mixin, cphMigrationsMap, {
    //   enumerable: true,
    //   writable: true,
    //   value: null
    // });

    Reflect.defineProperty(Mixin, cpoMigrations, {
      enumerable: true,
      writable: true,
      value: null
    });

    Reflect.defineProperty(Mixin, cpmMigrationsHandler, {
      enumerable: true,
      value: {
        // ownKeys: (aoTarget) =>
        //   Reflect.ownKeys(aoTarget.migrations),
        // has: (aoTarget, asName) =>
        //   indexOf.call(aoTarget.migrations, asName) >= 0,
        // set: (aoTarget, asName, aValue, aoReceiver) => {
        //   if (!Reflect.get(aoTarget, asName)) {
        //     aoTarget.metaObject.addMetaData('migrations', asName, aValue);
        //     Reflect.defineProperty(aoTarget, asName, {
        //       configurable: false,
        //       enumerable: true,
        //       writable: false,
        //       value: aValue
        //     });
        //     return aValue
        //   }
        // },
        get: (aoTarget, asName) => {
          if (!Reflect.get(aoTarget.prototype, asName)) {
            // if (aoTarget[cphMigrationsMap] == null) {
            //   const migrationsMap = {};
            //   for (const vsName in aoTarget[cphPathMap]) {
            //     const vsPath = aoTarget[cphPathMap][vsName];
            //     // console.log('<><><><> Migrations.get', vsName, vsPath);
            //     if (
            //       _.includes(vsPath, '/migrations/')
            //     &&
            //       vsName !== 'BaseMigration'
            //     &&
            //       /^\.|\.md$/.test(vsPath)
            //     ) {
            //       migrationsMap[vsName] = vsPath;
            //     }
            //   }
            //   aoTarget[cphMigrationsMap] = migrationsMap;
            // }
            const vsPath = aoTarget[cphMigrationsMap][asName];
            if (vsPath) {
              aoTarget.resolve(vsPath);
            }
          }
          return Reflect.get(aoTarget.prototype, asName);
        }
      }
    });
    Reflect.defineProperty(Mixin, 'onMetalize', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function(...args) {
        Reflect.getPrototypeOf(Mixin).onMetalize.apply(this, args);
        this[cpoMigrationsNames] = undefined;
        // this[cphMigrationsMap] = undefined;
        this[cpoMigrations] = undefined;
        return;
      }
    });
    return Mixin;
  }]
}
