/* eslint no-param-reassign: ["error", {
  "props": true, "ignorePropertyModificationsFor": ["properties"]
}] */

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
// import type { RecordStaticInterface } from '../interfaces/RecordStaticInterface';
import type { CursorInterface } from '../interfaces/CursorInterface';
import type { SerializerInterface } from '../interfaces/SerializerInterface';
import type { ObjectizerInterface } from '../interfaces/ObjectizerInterface';
import type { DriverInterface } from '../interfaces/DriverInterface';
import type { SerializableInterface } from '../interfaces/SerializableInterface';

import { injectable, inject } from 'inversify';

const hasProp = {}.hasOwnProperty;

export default (Module) => {
  const {
    RECORD_CHANGED,
    Proxy,
    assert,
    initialize, partOf, meta, property, method, nameBy, mixin,
    Utils: { _, inflect }
  } = Module.NS;

  @initialize
  @injectable()
  @partOf(Module)
  class Collection<
    // D = RecordInterface, R = RecordStaticInterface
    D = RecordInterface, R = Class<*>
  > extends Proxy implements CollectionInterface<D>, SerializableInterface<D> {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @inject('SerializerFactory<*>')
    @property _serializerFactory: (string, ?string) => SerializerInterface<D>;

    @inject('ObjectizerFactory<*>')
    @property _objectizerFactory: (string, ?string) => ObjectizerInterface<R, D>;

    @inject('AdapterFactory<*>')
    @property _adapterFactory: () => DriverInterface<Class<*>, object>;

    @inject('RecordNewable<*>')
    @property _recordNewable: (string) => R;

    @inject('CursorFactory<*>')
    @property _cursorFactory: (?string, array, ?string) => CursorInterface<CollectionInterface<D>, D>;

    @property get delegate(): R {
      const proxyData = this.getData();
      const delegate = proxyData != null ? proxyData.delegate : undefined;
      (delegate: ?(string | Function | R));
      if (_.isString(delegate)) {
        return this._recordNewable(delegate);
      } else if (!/Migration$|Record$/.test(delegate.name)) {
        return typeof delegate === 'function' ? delegate() : undefined;
      }
      return delegate;
    }

    @property get serializer(): SerializerInterface<D> {
      const proxyData = this.getData();
      const serializer = proxyData != null ? proxyData.serializer : undefined;
      (serializer: ?string);
      return this._serializerFactory(this.getName(), serializer);
    }

    @property get objectizer(): ObjectizerInterface<R, D> {
      const proxyData = this.getData();
      const objectizer = proxyData != null ? proxyData.objectizer : undefined;
      (objectizer: ?string);
      return this._objectizerFactory(this.getName(), objectizer);
    }

    @property get adapter(): DriverInterface<Class<*>, object> {
      const proxyData = this.getData();
      const adapter = proxyData != null ? proxyData.adapter : undefined;
      (adapter: ?string);
      return this._adapterFactory(this.getName(), adapter);
    }

    @method collectionName(): string {
      return inflect.pluralize(inflect.underscore((this.getName() || '').replace(/Collection$/, '')));
    }

    @method collectionPrefix(): string {
      return `${inflect.underscore(this.ApplicationModule.name)}_`;
    }

    @method collectionFullName(asName: ?string = null): string {
      return inflect.underscore(`${this.collectionPrefix()}${asName || this.collectionName()}`);
    }

    @method recordHasBeenChanged(asType: string, aoData: object): void {
      this.send(RECORD_CHANGED, aoData, asType);
    }

    @method async generateId(): Promise<string | number> { return; }

    @method async build(properties: object): Promise<D> {
      return await this.objectizer.recoverize(this.delegate, properties);
    }

    @method async create(properties: object): Promise<D> {
      const voRecord = await this.build(properties);
      return await voRecord.save();
    }

    @method async push(aoRecord: D): Promise<D> {
      const snapshot = await this.serialize(aoRecord);
      const result = await this.adapter.push(this.delegate, snapshot);
      return await this.normalize(result);
    }

    @method async 'delete'(id: string | number): Promise<void> {
      const voRecord = await this.find(id);
      await voRecord.delete();
    }

    @method async destroy(id: string | number): Promise<void> {
      const voRecord = await this.find(id);
      await voRecord.destroy();
    }

    @method async remove(id: string | number): Promise<void> {
      await this.adapter.remove(this.delegate, id);
    }

    @method async find(id: string | number): Promise<?D> {
      return await this.take(id);
    }

    @method async findMany(ids: Array<string | number>): Promise<CursorInterface<CollectionInterface<D>, D>> {
      return await this.takeMany(ids);
    }

    @method async take(id: string | number): Promise<?D> {
      const result = await this.adapter.take(this.delegate, id);
      if (result == null) return null;
      return await this.normalize(result);
    }

    @method async takeMany(ids: Array<string | number>): Promise<CursorInterface<CollectionInterface<D>, D>> {
      const result = await this.adapter.takeMany(this.delegate, ids);
      return this._cursorFactory(this.getName(), result);
    }

    @method async takeAll(): Promise<CursorInterface<CollectionInterface<D>, D>> {
      const result = await this.adapter.takeAll(this.delegate);
      return this._cursorFactory(this.getName(), result);
    }

    @method async update(id: string | number, properties: object): Promise<D> {
      properties.id = id;
      const existedRecord = await this.find(id);
      const receivedRecord = await this.objectizer.recoverize(this.delegate, properties);
      for (const key in properties) {
        if (!hasProp.call(properties, key)) continue;
        existedRecord[key] = receivedRecord[key];
      }
      return await existedRecord.save();
    }

    @method async override(id: string | number, aoRecord: D): Promise<D> {
      const snapshot = await this.serialize(aoRecord);
      const result = await this.adapter.override(this.delegate, id, snapshot);
      return await this.normalize(result);
    }

    @method async clone(aoRecord: D): Promise<D> {
      return await aoRecord.clone()
    }

    @method async copy(aoRecord: D): Promise<D> {
      return await aoRecord.copy()
    }

    @method async includes(id: string | number): Promise<boolean> {
      return await this.adapter.includes(this.delegate, id);
    }

    @method async length(): Promise<number> {
      return await this.adapter.length(this.delegate);
    }

    @method async normalize(ahData: ?object): Promise<?D> {
      return await this.serializer.normalize(this.delegate, ahData);
    }

    @method async serialize(aoRecord: ?D, ahOptions: ?object): Promise<?object> {
      return await this.serializer.serialize(aoRecord, ahOptions);
    }
  }
}
