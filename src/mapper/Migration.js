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

import type { MigrationInterface } from '../interfaces/MigrationInterface';
import type { RecordInterface } from '../interfaces/RecordInterface';

export default (Module) => {
  const {
    UP, DOWN, SUPPORTED_TYPES, REVERSE_MAP, NON_OVERRIDDEN,
    Record,
    assert,
    initialize, partOf, meta, property, method, nameBy,
    Utils: { _, assign, forEach }
  } = Module.NS;

  @initialize
  @partOf(Module)
  class Migration extends Record implements MigrationInterface<REVERSE_MAP, SUPPORTED_TYPES, UP, DOWN> {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property get steps(): Array<{|args: Array, method: $Keys<typeof REVERSE_MAP> | 'reversible'|}> {
      return assign([], (this._steps && [... this._steps]) || []);
    }

    @property get index(): number {
      const [ index ] = this.id.split('_');
      return index;
    }

    @method static createCollection(
      name: string,
      options: ?object
    ): void {
      this.prototype._steps.push({
        args: [name, options],
        method: 'createCollection'
      });
    }

    @method async createCollection(
      name: string,
      options: ?object
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static createEdgeCollection(
      collection_1: string,
      collection_2: string,
      options: ?object
    ): void {
      this.prototype._steps.push({
        args: [collection_1, collection_2, options],
        method: 'createEdgeCollection'
      });
    }

    @method async createEdgeCollection(
      collection_1: string,
      collection_2: string,
      options: ?object
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static addField(
      collection_name: string,
      field_name: string,
      options: $Values<SUPPORTED_TYPES> | {
        type: $Values<SUPPORTED_TYPES>, 'default': any
      }
    ): void {
      this.prototype._steps.push({
        args: [collection_name, field_name, options],
        method: 'addField'
      });
    }

    @method async addField(
      collection_name: string,
      field_name: string,
      options: $Values<SUPPORTED_TYPES> | {
        type: $Values<SUPPORTED_TYPES>, 'default': any
      }
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static addIndex(
      collection_name: string,
      field_names: string[],
      options: {
        type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
        unique: ?boolean,
        sparse: ?boolean
      }
    ): void {
      this.prototype._steps.push({
        args: [collection_name, field_names, options],
        method: 'addIndex'
      });
    }

    @method async addIndex(
      collection_name: string,
      field_names: string[],
      options: {
        type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
        unique: ?boolean,
        sparse: ?boolean
      }
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static addTimestamps(
      collection_name: string,
      options: ?object
    ): void {
      this.prototype._steps.push({
        args: [collection_name, options],
        method: 'addTimestamps'
      });
    }

    @method async addTimestamps(
      collection_name: string,
      options: ?object
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static changeCollection(
      name: string,
      options: object
    ): void {
      this.prototype._steps.push({
        args: [name, options],
        method: 'changeCollection'
      });
    }

    @method async changeCollection(
      name: string,
      options: object
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static changeField(
      collection_name: string,
      field_name: string,
      options: $Values<SUPPORTED_TYPES> | {
        type: $Values<SUPPORTED_TYPES>
      }
    ): void {
      this.prototype._steps.push({
        args: [collection_name, field_name, options],
        method: 'changeField'
      });
    }

    @method async changeField(
      collection_name: string,
      field_name: string,
      options: $Values<SUPPORTED_TYPES> | {
        type: $Values<SUPPORTED_TYPES>
      }
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static renameField(
      collection_name: string,
      field_name: string,
      new_field_name: string
    ): void {
      this.prototype._steps.push({
        args: [collection_name, field_name, new_field_name],
        method: 'renameField'
      });
    }

    @method async renameField(
      collection_name: string,
      field_name: string,
      new_field_name: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static renameIndex(
      collection_name: string,
      old_name: string,
      new_name: string
    ): void {
      this.prototype._steps.push({
        args: [collection_name, old_name, new_name],
        method: 'renameIndex'
      });
    }

    @method async renameIndex(
      collection_name: string,
      old_name: string,
      new_name: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static renameCollection(
      collection_name: string,
      new_name: string
    ): void {
      this.prototype._steps.push({
        args: [collection_name, new_name],
        method: 'renameCollection'
      });
    }

    @method async renameCollection(
      collection_name: string,
      new_name: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static dropCollection(
      collection_name: string
    ): void {
      this.prototype._steps.push({
        args: [collection_name],
        method: 'dropCollection'
      });
    }

    @method async dropCollection(
      collection_name: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static dropEdgeCollection(
      collection_1: string,
      collection_2: string
    ): void {
      this.prototype._steps.push({
        args: [collection_1, collection_2],
        method: 'dropEdgeCollection'
      });
    }

    @method async dropEdgeCollection(
      collection_1: string,
      collection_2: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static removeField(
      collection_name: string,
      field_name: string
    ): void {
      this.prototype._steps.push({
        args: [collection_name, field_name],
        method: 'removeField'
      });
    }

    @method async removeField(
      collection_name: string,
      field_name: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static removeIndex(
      collection_name: string,
      field_names: string[],
      options: {
        type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
        unique: ?boolean,
        sparse: ?boolean
      }
    ): void {
      this.prototype._steps.push({
        args: [collection_name, field_names, options],
        method: 'removeIndex'
      });
    }

    @method async removeIndex(
      collection_name: string,
      field_names: string[],
      options: {
        type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
        unique: ?boolean,
        sparse: ?boolean
      }
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static removeTimestamps(
      collection_name: string,
      options: ?object
    ): void {
      this.prototype._steps.push({
        args: [collection_name, options],
        method: 'removeTimestamps'
      });
    }

    @method async removeTimestamps(
      collection_name: string,
      options: ?object
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static reversible(
      lambda: ({|up: () => Promise<void>, down: () => Promise<void>|}) => Promise<void>
    ): void {
      this.prototype._steps.push({
        args: [lambda],
        method: 'reversible'
      });
    }

    @method async execute(lambda: Function): Promise<void> {
      await lambda.apply(this, []);
    }

    @method async migrate(direction: UP | DOWN): Promise<void> {
      switch (direction) {
        case UP:
          await this.up();
          break;
        case DOWN:
          await this.down();
      }
    }

    @method static change(): ?Symbol {
      return NON_OVERRIDDEN;
    }

    @method async up(): Promise<void> {
      // const steps = this._steps && [... this._steps] || [];
      await forEach(this.steps, async ({ method: methodName, args }) => {
        if (methodName === 'reversible') {
          const [ lambda ] = args;
          await lambda.call(this, {
            up: async (f) => await f(),
            down: async () => { return; },
          });
        } else {
          await this[methodName](...args);
        }
      });
    }

    @method static up(): ?Symbol {
      return NON_OVERRIDDEN;
    }

    @method async down(): Promise<void> {
      // const steps = this._steps && [... this._steps] || [];
      // steps.reverse();
      await forEach(this.steps.reverse(), async ({ method: methodName, args }) => {
        if (methodName === 'reversible') {
          const [ lambda ] = args;
          await lambda.call(this, {
            up: async () => { return; },
            down: async (f) => await f(),
          });
        } else if (_.includes(['renameField', 'renameIndex'], methodName)) {
          const [ collectionName, oldName, newName ] = args;
          await this[methodName](collectionName, newName, oldName);
        } else if (methodName === 'renameCollection') {
          const [ oldCollectionName, newCollectionName ] = args;
          await this[methodName](newCollectionName, oldCollectionName);
        } else if (methodName === 'addField') {
          const [ collectionName, fieldName ] = args;
          await this[REVERSE_MAP[methodName]](collectionName, fieldName);
        } else {
          await this[REVERSE_MAP[methodName]](...args);
        }
      });
    }

    @method static down(): ?Symbol {
      return NON_OVERRIDDEN;
    }

    @method static async restoreObject() {
      return assert.fail(`restoreObject method not supported for ${this.name}`);
    }

    @method static async replicateObject() {
      return assert.fail(`replicateObject method not supported for ${this.name}`);
    }

    @method static onInitialize(...args) {
      super.onInitialize(...args);
      this.prototype._steps = [];
      if (this === Migration) return;
      const changeReturn = this.change();
      if (changeReturn === NON_OVERRIDDEN) {
        let hasUpDownDeined = 1;
        const upFunctor = this.up();
        const downFunctor = this.down();
        hasUpDownDeined &= upFunctor !== NON_OVERRIDDEN;
        hasUpDownDeined &= downFunctor !== NON_OVERRIDDEN;
        assert(hasUpDownDeined == 1, 'Static `change` method should be defined or direct static methods `up` and `down` should be defined with return lambda functors');
        Reflect.defineProperty(this.prototype, 'up', method(this.prototype, 'up', { value: upFunctor }));
        Reflect.defineProperty(this.prototype, 'down', method(this.prototype, 'down', { value: downFunctor }));
      }
    }
  }
}
