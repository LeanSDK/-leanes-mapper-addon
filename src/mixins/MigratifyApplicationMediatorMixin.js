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

import type { NotificationInterface } from '@leansdk/leanes/src/leanes';

export default (Module) => {
  const {
    STOPPED_MIGRATE, STOPPED_ROLLBACK, MIGRATE, ROLLBACK,
    initializeMixin, meta, method,
    Utils: { genRandomAlphaNumbers }
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @method listNotificationInterests(...args): string[] {
        const interests = super.listNotificationInterests(...args);
        interests.push(STOPPED_MIGRATE);
        interests.push(STOPPED_ROLLBACK);
        return interests;
      }

      @method handleNotification(aoNotification: NotificationInterface): void {
        const vsName = aoNotification.getName();
        const voBody = aoNotification.getBody();
        const vsType = aoNotification.getType();
        switch (vsName) {
          case STOPPED_MIGRATE:
          case STOPPED_ROLLBACK:
            this.emitter.emit(vsType, voBody);
            break;
          default:
            super.handleNotification(aoNotification);
        }
      }

      @method async migrate(opts: ?{|until: ?string|}): Promise<void> {
        return await new Promise((resolve, reject) => {
          // resolve('async migrate(opts)');
          try {
            const reverse = genRandomAlphaNumbers(32);
            this.emitter.once(reverse, ({ error }) => {
              if (error != null) {
                reject(error);
                return;
              }
              resolve();
            });
            this.send(MIGRATE, opts, reverse);
          } catch (err) {
            reject(err);
          }
        });
      }

      @method async rollback(opts: ?{|steps: ?number, until: ?string|}): Promise<void> {
        return await new Promise((resolve, reject) => {
          // resolve();
          try {
            const reverse = genRandomAlphaNumbers(32);
            this.emitter.once(reverse, ({ error }) => {
              if (error != null) {
                reject(error);
                return;
              }
              resolve();
            });
            this.send(ROLLBACK, opts, reverse);
          } catch (err) {
            reject(err);
          }
        });
      }
    }
    return Mixin;
  });
}
