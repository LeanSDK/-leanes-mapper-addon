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
  +steps: Array<{|args: Array, method: $Keys<typeof REVERSE_MAP> | 'reversible'|}>;

  createCollection(
    name: string,
    options: ?object
  ): Promise<void>;

  createEdgeCollection(
    collection_1: string,
    collection_2: string,
    options: ?object
  ): Promise<void>;

  addField(
    collection_name: string,
    field_name: string,
    options: $Values<SUPPORTED_TYPES> | {
      type: $Values<SUPPORTED_TYPES>, 'default': any
    }
  ): Promise<void>;

  addIndex(
    collection_name: string,
    field_names: string[],
    options: {
      type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
      unique: ?boolean,
      sparse: ?boolean
    }
  ): Promise<void>;

  addTimestamps(
    collection_name: string,
    options: ?object
  ): Promise<void>;

  changeCollection(
    name: string,
    options: object
  ): Promise<void>;

  changeField(
    collection_name: string,
    field_name: string,
    options: $Values<SUPPORTED_TYPES> | {
      type: $Values<SUPPORTED_TYPES>
    }
  ): Promise<void>;

  renameField(
    collection_name: string,
    field_name: string,
    new_field_name: string
  ): Promise<void>;

  renameIndex(
    collection_name: string,
    old_name: string,
    new_name: string
  ): Promise<void>;

  renameCollection(
    collection_name: string,
    new_name: string
  ): Promise<void>;

  dropCollection(
    collection_name: string
  ): Promise<void>;

  dropEdgeCollection(
    collection_1: string,
    collection_2: string
  ): Promise<void>;

  removeField(
    collection_name: string,
    field_name: string
  ): Promise<void>;

  removeIndex(
    collection_name: string,
    field_names: string[],
    options: {
      type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
      unique: ?boolean,
      sparse: ?boolean
    }
  ): Promise<void>;

  removeTimestamps(
    collection_name: string,
    options: ?object
  ): Promise<void>;

  execute(lambda: Function): Promise<void>;

  migrate(direction: UP | DOWN): Promise<void>;

  up(): Promise<void>;

  down(): Promise<void>;
}
