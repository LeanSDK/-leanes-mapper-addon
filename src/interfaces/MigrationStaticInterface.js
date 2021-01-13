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

import type { CollectionInterface } from './CollectionInterface';
import type { RecordInterface } from './RecordInterface';

export interface MigrationStaticInterface<
  SUPPORTED_TYPES, NON_OVERRIDDEN
> {
  createCollection(
    name: string,
    options: ?object
  ): void;

  createEdgeCollection(
    collectionName1: string,
    collectionName2: string,
    options: ?object
  ): void;

  addField(
    collectionName: string,
    fieldName: string,
    options: $Values<SUPPORTED_TYPES> | {
      type: $Values<SUPPORTED_TYPES>, 'default': any
    }
  ): void;

  addIndex(
    collectionName: string,
    fieldNames: string[],
    options: {
      type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
      unique: ?boolean,
      sparse: ?boolean
    }
  ): void;

  addTimestamps(
    collectionName: string,
    options: ?object
  ): void;

  changeCollection(
    name: string,
    options: object
  ): void;

  changeField(
    collectionName: string,
    fieldName: string,
    options: $Values<SUPPORTED_TYPES> | {
      type: $Values<SUPPORTED_TYPES>
    }
  ): void;

  renameField(
    collectionName: string,
    fieldName: string,
    newFieldName: string
  ): void;

  renameIndex(
    collectionName: string,
    oldCollectionName: string,
    newCollectionName: string
  ): void;

  renameCollection(
    collectionName: string,
    newCollectionName: string
  ): void;

  dropCollection(
    collectionName: string
  ): void;

  dropEdgeCollection(
    collectionName1: string,
    collectionName2: string
  ): void;

  removeField(
    collectionName: string,
    fieldName: string
  ): void;

  removeIndex(
    collectionName: string,
    fieldNames: string[],
    options: {
      type: 'hash' | 'skiplist' | 'persistent' | 'geo' | 'fulltext',
      unique: ?boolean,
      sparse: ?boolean
    }
  ): void;

  removeTimestamps(
    collectionName: string,
    options: ?object
  ): void;

  reversible(
    lambda: ({|up: () => Promise<void>, down: () => Promise<void>|}) => Promise<void>
  ): void;

  change(): ?NON_OVERRIDDEN;

  up(): ?NON_OVERRIDDEN;

  down(): ?NON_OVERRIDDEN;

  (aoAttributes: object, aoCollection: CollectionInterface): RecordInterface;
}
