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
import loadMigrations from './decorators/loadMigrations';
import relatedTo from './decorators/relatedTo';

import EditableRecordMixinTF from './mixins/EditableRecordMixin';
import GenerateUuidIdMixinTF from './mixins/GenerateUuidIdMixin';
import HideableRecordMixinTF from './mixins/HideableRecordMixin';
import HttpAdapterMixinTF from './mixins/HttpAdapterMixin';
// import HttpSerializerMixinTF from './mixins/HttpSerializerMixin';
import IterableMixinTF from './mixins/IterableMixin';
// import MemoryCollectionMixinTF from './mixins/MemoryCollectionMixin';
import MemoryAdapterMixinTF from './mixins/MemoryAdapterMixin';
import MemoryMigrationMixinTF from './mixins/MemoryMigrationMixin';
import MigratifyApplicationMediatorMixinTF from './mixins/MigratifyApplicationMediatorMixin';
import MigratifyApplicationMixinTF from './mixins/MigratifyApplicationMixin';
import OwnerableRecordMixinTF from './mixins/OwnerableRecordMixin';
import RelationsMixinTF from './mixins/RelationsMixin';
import SchemaModuleMixinTF from './mixins/SchemaModuleMixin';
import TimestampsRecordMixinTF from './mixins/TimestampsRecordMixin';

import FacadePatchTF from './patches/FacadePatch';

import ArrayTransformTF from './transforms/ArrayTransform';
import BooleanTransformTF from './transforms/BooleanTransform';
import DateTransformTF from './transforms/DateTransform';
import NumberTransformTF from './transforms/NumberTransform';
import ObjectTransformTF from './transforms/ObjectTransform';
import PrimaryKeyTransformTF from './transforms/PrimaryKeyTransform';
import StringTransformTF from './transforms/StringTransform';
import ComplexArrayTransformTF from './transforms/ComplexArrayTransform';
import ComplexObjectTransformTF from './transforms/ComplexObjectTransform';

import CursorTF from './mapper/Cursor';
import TransformTF from './mapper/Transform';
import SerializerTF from './mapper/Serializer';
import ObjectizerTF from './mapper/Objectizer';
import RecordTF from './mapper/Record';
import MigrationTF from './mapper/Migration';
import HttpAdapterTF from './mapper/HttpAdapter';
import MemoryAdapterTF from './mapper/MemoryAdapter';
// import HttpSerializerTF from './mapper/HttpSerializer';

import CollectionTF from './proxies/Collection';
import MigrateCommandTF from './commands/MigrateCommand';
import RollbackCommandTF from './commands/RollbackCommand';

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

export default (Module) => {
  const {
    initializeMixin, meta, constant, method, patch, decorator,
  } = Module.NS;

  return ['MapperAddon', (BaseClass) => {
    @FacadePatchTF
    @CollectionTF
    @MigrateCommandTF
    @RollbackCommandTF

    @HttpAdapterTF
    @MemoryAdapterTF
    // @HttpSerializerTF

    @EditableRecordMixinTF
    @GenerateUuidIdMixinTF
    @HideableRecordMixinTF
    @HttpAdapterMixinTF
    // @HttpSerializerMixinTF
    @IterableMixinTF
    // @MemoryCollectionMixinTF
    @MemoryAdapterMixinTF
    @MemoryMigrationMixinTF
    @MigratifyApplicationMediatorMixinTF
    @MigratifyApplicationMixinTF
    @OwnerableRecordMixinTF
    @RelationsMixinTF
    @SchemaModuleMixinTF
    @TimestampsRecordMixinTF

    @MigrationTF
    @RecordTF
    @ObjectizerTF
    @SerializerTF
    @TransformTF
    @CursorTF

    @ComplexArrayTransformTF
    @ComplexObjectTransformTF
    @ArrayTransformTF
    @BooleanTransformTF
    @DateTransformTF
    @NumberTransformTF
    @ObjectTransformTF
    @PrimaryKeyTransformTF
    @StringTransformTF

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
      @decorator loadMigrations = loadMigrations;
      @decorator relatedTo = relatedTo;

      @method static including() {
        patch(this.NS.FacadePatch)(this.NS.Facade);
      }
    }
    return Mixin;
  }]
}
