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

import type { SerializerInterface } from '../interfaces/SerializerInterface';
import type { CollectionInterface } from '../interfaces/CollectionInterface';
import type { RecordInterface } from '../interfaces/RecordInterface';
// import type { TransformStaticInterface } from '../interfaces/TransformStaticInterface';

import { injectable, inject } from 'inversify';

export default (Module) => {
  const {
    CoreObject,
    initialize, partOf, meta, property, method, nameBy,
  } = Module.NS;

  @initialize
  @injectable()
  @partOf(Module)
  class Serializer<
    // R = RecordStaticInterface, D = RecordInterface
    R = Class<*>, D = RecordInterface
  > extends CoreObject implements SerializerInterface<R, D> {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property collectionName: string = null;

    @inject('CollectionFactory<*>')
    @property _collectionFactory: (string) => CollectionInterface<D>;

    @inject('RecordFactory<*>')
    @property _recordFactory: (string, object, string) => D;

    @property get collection(): CollectionInterface<D> {
      return this._collectionFactory(this.collectionName)
    }

    @method async normalize(acRecord: R, ahPayload: ?object): Promise<?D> {
      // return await acRecord.normalize(ahPayload, this.collection);
      if (ahPayload == null) return null;
      const [RecordClass, normalized] = await acRecord.normalize(ahPayload, this.collection);
      return this._recordFactory(RecordClass.name, normalized, this.collectionName)
    }

    @method async serialize(aoRecord: ?D, options: ?object = null): Promise<?object> {
      if (aoRecord == null) return null;
      const vcRecord: R = aoRecord.constructor;
      return await vcRecord.serialize(aoRecord, options);
    }

    @method static async restoreObject(acModule: Class<*>, replica: object): Promise<SerializerInterface<D>> {
      if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
        const Facade = acModule.NS.Facade || acModule.NS.ApplicationFacade;
        const facade = Facade.getInstance(replica.multitonKey);
        const collection = facade.getProxy(replica.collectionName);
        return collection.serializer;
      } else {
        return await super.restoreObject(acModule, replica);
      }
    }

    @method static async replicateObject(instance: SerializerInterface<D>): Promise<object> {
      const replica = await super.replicateObject(instance);
      replica.multitonKey = instance.collection._multitonKey;
      replica.collectionName = instance.collection.getName();
      return replica;
    }
  }
}
