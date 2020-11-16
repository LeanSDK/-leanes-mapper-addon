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

import type { CollectionInterface } from '../interfaces/CollectionInterface';
import type { RecordInterface } from '../interfaces/RecordInterface';
import type { NotificationInterface } from '../interfaces/NotificationInterface';

export default (Module) => {
  const {
    APPLICATION_MEDIATOR, STOPPED_MIGRATE, MIGRATIONS, UP,
    Command,
    initialize, partOf, meta, property, method, nameBy, mixin,
    Utils: { _, inflect }
  } = Module.NS;

  @initialize
  @partOf(Module)
  class MigrateCommand<
    D = RecordInterface
  > extends Command {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property migrationsCollection: CollectionInterface<D> = null;

    @property get migrationNames(): string[] {
      const app = this.facade
        .getMediator(APPLICATION_MEDIATOR)
        .getViewComponent();
      return app.Module.NS.MIGRATION_NAMES || [];
    }

    // @property get migrationsDir(): string {
    //   return `${this.configs.ROOT}/migrations`;
    // }

    @method initializeNotifier(...args) {
      super.initializeNotifier(...args);
      this.migrationsCollection = this.facade.getProxy(MIGRATIONS);
    }

    @method async execute(aoNotification: NotificationInterface) {
      const voBody = aoNotification.getBody();
      const vsType = aoNotification.getType();
      const error = await this.migrate(voBody || {});
      this.send(STOPPED_MIGRATE, { error }, vsType);
    }

    @method async migrate(options: {|until: ?string|}): ?Error {
      let voMigration = null;
      let err = null;
      const app = this.facade
        .getMediator(APPLICATION_MEDIATOR)
        .getViewComponent();
      for (const migrationName of this.migrationNames) {
        if (!(await this.migrationsCollection.includes(migrationName))) {
          const id = String(migrationName);
          const clearedMigrationName = migrationName.replace(/^\d{14}[_]/, '');
          const migrationClassName = inflect.camelize(clearedMigrationName);
          const vcMigration = app.Module.NS[migrationClassName];
          const type = `${app.Module.name}::${migrationClassName}`;
          try {
            voMigration = (await this.migrationsCollection.find(id));
            if (voMigration == null) {
              voMigration = vcMigration.new({id, type}, this.migrationsCollection);
              await voMigration.migrate(UP);
              await voMigration.save();
            }
          } catch (error) {
            err = error;
            const msg = `!!! Error in migration ${migrationName}`;
            console.error(msg, error.message, error.stack);
            break;
          }
        }
        if (((options != null ? options.until : undefined) != null) && options.until === migrationName) {
          break;
        }
      }
      return err;
    }
  }
}
