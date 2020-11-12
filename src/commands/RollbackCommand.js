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

import type { NotificationInterface } from '@leansdk/leanes/src/leanes';

export default (Module) => {
  const {
    APPLICATION_MEDIATOR, STOPPED_ROLLBACK, MIGRATIONS, DOWN,
    Command,
    // ConfigurableMixin,
    initialize, partOf, meta, property, method, nameBy, mixin,
    Utils: { _, inflect }
  } = Module.NS;


  @initialize
  @partOf(Module)
  // @mixin(ConfigurableMixin)
  class RollbackCommand<
    D = RecordInterface
  > extends Command {
  // > extends SimpleCommand {
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
      const error = (await this.rollback(voBody || {}));
      this.send(STOPPED_ROLLBACK, { error }, vsType);
    }

    @method async rollback(options: ?{|steps: ?number, until: ?string|}): ?Error {
      let executedMigrations = null;
      let err = null;
      if (((options != null ? options.steps : undefined) != null) && !_.isNumber(options.steps)) {
        throw new Error('Not valid steps params');
        return;
      }
      executedMigrations = await (
        await this.migrationsCollection.takeAll()
      ).toArray();
      executedMigrations = _.orderBy(executedMigrations, ['id'], ['desc']);
      executedMigrations = executedMigrations.slice(0, (options.steps || 1));
      for (const executedMigration of executedMigrations) {
        try {
          await executedMigration.migrate(DOWN);
          await executedMigration.destroy();
        } catch (error) {
          err = error;
          const msg = `!!! Error in migration ${executedMigration}`;
          console.error(msg, error.message, error.stack);
          break;
        }
        if (((options != null ? options.until : undefined) != null) && options.until === executedMigration.id) {
          break;
        }
      }
      return err;
    }
  }
}
