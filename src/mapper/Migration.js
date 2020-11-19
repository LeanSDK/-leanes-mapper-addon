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
  const test = 'test';
  // (test: $Keys<typeof SUPPORTED_TYPES>);
  // console.log('>>>>>>>>>>>>>', SUPPORTED_TYPES);

  @initialize
  @partOf(Module)
  class Migration extends Record implements MigrationInterface<$Keys<typeof REVERSE_MAP>, $Keys<typeof SUPPORTED_TYPES>, UP, DOWN> {
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
      collectionName1: string,
      collectionName2: string,
      options: ?object
    ): void {
      this.prototype._steps.push({
        args: [collectionName1, collectionName2, options],
        method: 'createEdgeCollection'
      });
    }

    @method async createEdgeCollection(
      collectionName1: string,
      collectionName2: string,
      options: ?object
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static addField(
      collectionName: string,
      fieldName: string,
      options: $Keys<typeof SUPPORTED_TYPES> | {
        type: $Keys<typeof SUPPORTED_TYPES>, 'default': ?any
      }
    ): void {
      this.prototype._steps.push({
        args: [collectionName, fieldName, options],
        method: 'addField'
      });
    }

    @method async addField(
      collectionName: string,
      fieldName: string,
      options: $Keys<typeof SUPPORTED_TYPES> | {
        type: $Keys<typeof SUPPORTED_TYPES>, 'default': any
      }
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static addIndex(
      collectionName: string,
      fieldNames: string[],
      options: {
        type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
        unique: ?boolean,
        sparse: ?boolean
      }
    ): void {
      this.prototype._steps.push({
        args: [collectionName, fieldNames, options],
        method: 'addIndex'
      });
    }

    @method async addIndex(
      collectionName: string,
      fieldNames: string[],
      options: {
        type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
        unique: ?boolean,
        sparse: ?boolean
      }
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static addTimestamps(
      collectionName: string,
      options: ?object
    ): void {
      this.prototype._steps.push({
        args: [collectionName, options],
        method: 'addTimestamps'
      });
    }

    @method async addTimestamps(
      collectionName: string,
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
      collectionName: string,
      fieldName: string,
      options: $Keys<typeof SUPPORTED_TYPES> | {
        type: $Keys<typeof SUPPORTED_TYPES>
      }
    ): void {
      this.prototype._steps.push({
        args: [collectionName, fieldName, options],
        method: 'changeField'
      });
    }

    @method async changeField(
      collectionName: string,
      fieldName: string,
      options: $Keys<typeof SUPPORTED_TYPES> | {
        type: $Keys<typeof SUPPORTED_TYPES>
      }
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static renameField(
      collectionName: string,
      fieldName: string,
      newFieldName: string
    ): void {
      this.prototype._steps.push({
        args: [collectionName, fieldName, newFieldName],
        method: 'renameField'
      });
    }

    @method async renameField(
      collectionName: string,
      fieldName: string,
      newFieldName: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static renameIndex(
      collectionName: string,
      oldCollectionName: string,
      newCollectionName: string
    ): void {
      this.prototype._steps.push({
        args: [collectionName, oldCollectionName, newCollectionName],
        method: 'renameIndex'
      });
    }

    @method async renameIndex(
      collectionName: string,
      oldCollectionName: string,
      newCollectionName: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static renameCollection(
      collectionName: string,
      newCollectionName: string
    ): void {
      this.prototype._steps.push({
        args: [collectionName, newCollectionName],
        method: 'renameCollection'
      });
    }

    @method async renameCollection(
      collectionName: string,
      newCollectionName: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static dropCollection(
      collectionName: string
    ): void {
      this.prototype._steps.push({
        args: [collectionName],
        method: 'dropCollection'
      });
    }

    @method async dropCollection(
      collectionName: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static dropEdgeCollection(
      collectionName1: string,
      collectionName2: string
    ): void {
      this.prototype._steps.push({
        args: [collectionName1, collectionName2],
        method: 'dropEdgeCollection'
      });
    }

    @method async dropEdgeCollection(
      collectionName1: string,
      collectionName2: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static removeField(
      collectionName: string,
      fieldName: string
    ): void {
      this.prototype._steps.push({
        args: [collectionName, fieldName],
        method: 'removeField'
      });
    }

    @method async removeField(
      collectionName: string,
      fieldName: string
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static removeIndex(
      collectionName: string,
      fieldNames: string[],
      options: {
        type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
        unique: ?boolean,
        sparse: ?boolean
      }
    ): void {
      this.prototype._steps.push({
        args: [collectionName, fieldNames, options],
        method: 'removeIndex'
      });
    }

    @method async removeIndex(
      collectionName: string,
      fieldNames: string[],
      options: {
        type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
        unique: ?boolean,
        sparse: ?boolean
      }
    ): Promise<void> {
      return assert.fail('Not implemented specific method');
    }

    @method static removeTimestamps(
      collectionName: string,
      options: ?object
    ): void {
      this.prototype._steps.push({
        args: [collectionName, options],
        method: 'removeTimestamps'
      });
    }

    @method async removeTimestamps(
      collectionName: string,
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
