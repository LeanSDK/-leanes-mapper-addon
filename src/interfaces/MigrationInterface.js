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

export interface MigrationInterface<
  REVERSE_MAP, SUPPORTED_TYPES, UP, DOWN
> {
  +steps: Array<{|args: Array, method: REVERSE_MAP | 'reversible'|}>;

  createCollection(
    name: string,
    options: ?object
  ): Promise<void>;

  createEdgeCollection(
    collectionName1: string,
    collectionName2: string,
    options: ?object
  ): Promise<void>;

  addField(
    collectionName: string,
    fieldName: string,
    options: SUPPORTED_TYPES | {
      type: SUPPORTED_TYPES, 'default': ?any
    }
  ): Promise<void>;

  addIndex(
    collectionName: string,
    fieldNames: string[],
    options: {
      type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
      unique?: boolean,
      sparse?: boolean
    }
  ): Promise<void>;

  addTimestamps(
    collectionName: string,
    options: ?object
  ): Promise<void>;

  changeCollection(
    name: string,
    options: object
  ): Promise<void>;

  changeField(
    collectionName: string,
    fieldName: string,
    options: SUPPORTED_TYPES | {
      type: SUPPORTED_TYPES
    }
  ): Promise<void>;

  renameField(
    collectionName: string,
    fieldName: string,
    newFieldName: string
  ): Promise<void>;

  renameIndex(
    collectionName: string,
    oldCollectionName: string,
    newCollectionName: string
  ): Promise<void>;

  renameCollection(
    collectionName: string,
    newCollectionName: string
  ): Promise<void>;

  dropCollection(
    collectionName: string
  ): Promise<void>;

  dropEdgeCollection(
    collectionName1: string,
    collectionName2: string
  ): Promise<void>;

  removeField(
    collectionName: string,
    fieldName: string
  ): Promise<void>;

  removeIndex(
    collectionName: string,
    fieldNames: string[],
    options: {
      type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
      unique?: boolean,
      sparse?: boolean
    }
  ): Promise<void>;

  removeTimestamps(
    collectionName: string,
    options: ?object
  ): Promise<void>;

  execute(lambda: Function): Promise<void>;

  migrate(direction: UP | DOWN): Promise<void>;

  up(): Promise<void>;

  down(): Promise<void>;
}
