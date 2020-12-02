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

import attribute from './decorators/attribute';
import belongsTo from './decorators/belongsTo';
import computed from './decorators/computed';
import customFilters from './decorators/customFilters';
import hasMany from './decorators/hasMany';
import hasOne from './decorators/hasOne';
import relatedTo from './decorators/relatedTo';
import loadMigrations from './decorators/loadMigrations';
import requireMigrations from './decorators/requireMigrations';

import EditableRecordMixin from './mixins/EditableRecordMixin';
import GenerateUuidIdMixin from './mixins/GenerateUuidIdMixin';
import HideableRecordMixin from './mixins/HideableRecordMixin';
import HttpAdapterMixin from './mixins/HttpAdapterMixin';
// import HttpSerializerMixin from './mixins/HttpSerializerMixin';
import IterableMixin from './mixins/IterableMixin';
// import MemoryCollectionMixin from './mixins/MemoryCollectionMixin';
import MemoryAdapterMixin from './mixins/MemoryAdapterMixin';
import MemoryMigrationMixin from './mixins/MemoryMigrationMixin';
import MigratifyApplicationMediatorMixin from './mixins/MigratifyApplicationMediatorMixin';
import MigratifyApplicationMixin from './mixins/MigratifyApplicationMixin';
import OwnerableRecordMixin from './mixins/OwnerableRecordMixin';
import RelationsMixin from './mixins/RelationsMixin';
import TimestampsRecordMixin from './mixins/TimestampsRecordMixin';

import FacadePatch from './patches/FacadePatch';

import ArrayTransform from './transforms/ArrayTransform';
import BooleanTransform from './transforms/BooleanTransform';
import DateTransform from './transforms/DateTransform';
import NumberTransform from './transforms/NumberTransform';
import ObjectTransform from './transforms/ObjectTransform';
import PrimaryKeyTransform from './transforms/PrimaryKeyTransform';
import StringTransform from './transforms/StringTransform';
import ComplexArrayTransform from './transforms/ComplexArrayTransform';
import ComplexObjectTransform from './transforms/ComplexObjectTransform';

import Cursor from './mapper/Cursor';
import Transform from './mapper/Transform';
import Serializer from './mapper/Serializer';
import Objectizer from './mapper/Objectizer';
import Record from './mapper/Record';
import Migration from './mapper/Migration';
import HttpAdapter from './mapper/HttpAdapter';
import MemoryAdapter from './mapper/MemoryAdapter';
// import HttpSerializer from './mapper/HttpSerializer';

import Collection from './proxies/Collection';
import MigrateCommand from './commands/MigrateCommand';
import RollbackCommand from './commands/RollbackCommand';

import MigratableModule from './MigratableModule';

export type { AttributeConfigT } from './types/AttributeConfigT';
export type { AttributeOptionsT } from './types/AttributeOptionsT';
export type { ComputedConfigT } from './types/ComputedConfigT';
export type { ComputedOptionsT } from './types/ComputedOptionsT';
export type { HttpRequestHashT } from './types/HttpRequestHashT';
export type { HttpRequestParamsT } from './types/HttpRequestParamsT';
export type { RelationConfigT } from './types/RelationConfigT';
export type { RelationInverseT } from './types/RelationInverseT';
export type { RelationOptionsT } from './types/RelationOptionsT';

export type { CollectionInterface } from './interfaces/CollectionInterface';
export type { CursorInterface } from './interfaces/CursorInterface';
export type { DriverInterface } from './interfaces/DriverInterface';
export type { IterableInterface } from './interfaces/IterableInterface';
export type { MigrationInterface } from './interfaces/MigrationInterface';
export type { MigrationStaticInterface } from './interfaces/MigrationStaticInterface';
export type { ObjectizerInterface } from './interfaces/ObjectizerInterface';
export type { RecordInterface } from './interfaces/RecordInterface';
export type { RecordStaticInterface } from './interfaces/RecordStaticInterface';
export type { RelatableStaticInterface } from './interfaces/RelatableStaticInterface';
export type { SerializableInterface } from './interfaces/SerializableInterface';
export type { SerializerInterface } from './interfaces/SerializerInterface';
export type { TransformStaticInterface } from './interfaces/TransformStaticInterface';

export { MigratableModule };
export { loadMigrations };
export { requireMigrations };

export default (Module) => {
  const {
    initializeMixin, meta, constant, method, patch, decorator, plugin,
  } = Module.NS;

  return ['MapperAddon', (BaseClass) => {
    @FacadePatch
    @Collection
    @MigrateCommand
    @RollbackCommand

    @HttpAdapter
    @MemoryAdapter
    // @HttpSerializer

    @EditableRecordMixin
    @GenerateUuidIdMixin
    @HideableRecordMixin
    @HttpAdapterMixin
    // @HttpSerializerMixin
    @IterableMixin
    // @MemoryCollectionMixin
    @MemoryAdapterMixin
    @MemoryMigrationMixin
    @MigratifyApplicationMediatorMixin
    @MigratifyApplicationMixin
    @OwnerableRecordMixin
    @RelationsMixin
    @TimestampsRecordMixin

    @Migration
    @Record
    @Objectizer
    @Serializer
    @Transform
    @Cursor

    @ComplexArrayTransform
    @ComplexObjectTransform
    @ArrayTransform
    @BooleanTransform
    @DateTransform
    @NumberTransform
    @ObjectTransform
    @PrimaryKeyTransform
    @StringTransform

    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @constant HTTP_ADAPTER = 'HTTP_ADAPTER';
      @constant MEMORY_ADAPTER = 'MEMORY_ADAPTER';
      @constant SERIALIZER = 'SERIALIZER';
      @constant HTTP_SERIALIZER = 'HTTP_SERIALIZER';
      @constant RECORD_CHANGED = 'RECORD_CHANGED';
      @constant MIGRATE = 'MIGRATE';
      @constant ROLLBACK = 'ROLLBACK';
      @constant STOPPED_MIGRATE = 'STOPPED_MIGRATE';
      @constant STOPPED_ROLLBACK = 'STOPPED_ROLLBACK';
      @constant MIGRATIONS = 'MigrationsCollection';
      @constant UP = Symbol.for('UP');
      @constant DOWN = Symbol.for('DOWN');
      @constant NON_OVERRIDDEN = Symbol.for('NON_OVERRIDDEN');
      @constant SUPPORTED_TYPES = {
        json:         'json',
        binary:       'binary',
        boolean:      'boolean',
        date:         'date',
        datetime:     'datetime',
        number:       'number',
        decimal:      'decimal',
        float:        'float',
        integer:      'integer',
        primary_key:  'primary_key',
        string:       'string',
        text:         'text',
        time:         'time',
        timestamp:    'timestamp',
        array:        'array',
        hash:         'hash',
      };
      @constant REVERSE_MAP = {
        createCollection: 'dropCollection',
        dropCollection: 'dropCollection',
        createEdgeCollection: 'dropEdgeCollection',
        dropEdgeCollection: 'dropEdgeCollection',
        addField: 'removeField',
        removeField: 'removeField',
        addIndex: 'removeIndex',
        removeIndex: 'removeIndex',
        addTimestamps: 'removeTimestamps',
        removeTimestamps: 'addTimestamps',
        changeCollection: 'changeCollection',
        changeField: 'changeField',
        renameField: 'renameField',
        renameIndex: 'renameIndex',
        renameCollection: 'renameCollection'
      };

      @decorator attribute = attribute;
      @decorator belongsTo = belongsTo;
      @decorator computed = computed;
      @decorator customFilters = customFilters;
      @decorator hasMany = hasMany;
      @decorator hasOne = hasOne;
      @decorator relatedTo = relatedTo;

      @method static including() {
        patch(this.NS.FacadePatch)(this.NS.Facade);
        // plugin(this.NS.SchemaModuleMixin)(this);
      }
    }
    return Mixin;
  }]
}
