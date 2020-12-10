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
// import type { RecordStaticInterface } from '../interfaces/RecordStaticInterface';
import type { RecordInterface } from '../interfaces/RecordInterface';
import type { ObjectizerInterface } from '../interfaces/ObjectizerInterface';

import { injectable, inject } from 'inversify';

export default (Module) => {
  const {
    CoreObject,
    initialize, partOf, meta, property, method, nameBy,
  } = Module.NS;

  @initialize
  @injectable()
  @partOf(Module)
  class Objectizer<
    // R = RecordStaticInterface, D = RecordInterface
    // R = Class<*>, D = RecordInterface
    R = Class<*>
  > extends CoreObject implements ObjectizerInterface<R, RecordInterface> {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property collectionName: string = null;

    @inject('CollectionFactory<*>')
    @property _collectionFactory: (string) => CollectionInterface<RecordInterface>;

    @inject('RecordFactory<*>')
    @property _recordFactory: (string, object, string) => RecordInterface;

    @property get collection(): CollectionInterface<RecordInterface> {
      return this._collectionFactory(this.collectionName)
    }

    @method async recoverize(
      acRecord: R,
      ahPayload: ?object
    ): Promise<?RecordInterface> {
      if (ahPayload == null) return null;
      if (ahPayload.type == null) {
        ahPayload.type = `${acRecord.moduleName()}::${acRecord.name}`;
      }
      // return await acRecord.recoverize(ahPayload, this.collection);
      const [RecordClass, recoverized] = await acRecord.recoverize(ahPayload, this.collection);
      return this._recordFactory(RecordClass.name, recoverized, this.collectionName)
    }

    @method async objectize(aoRecord: ?RecordInterface, options: ?object = null): Promise<?object> {
      if (aoRecord == null) return null;
      const vcRecord = aoRecord.constructor;
      return vcRecord.objectize(aoRecord, options);
    }

    @method static async restoreObject(acModule: Class<*>, replica: object): Promise<ObjectizerInterface<R, RecordInterface>> {
      if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
        const Facade = acModule.NS.ApplicationFacade || acModule.NS.Facade;
        const facade = Facade.getInstance(replica.multitonKey);
        const collection = facade.getProxy(replica.collectionName);
        return collection.objectizer;
      } else {
        return await super.restoreObject(acModule, replica);
      }
    }

    @method static async replicateObject(instance: ObjectizerInterface<R, RecordInterface>): Promise<object> {
      const replica = await super.replicateObject(instance);
      replica.multitonKey = instance.collection._multitonKey;
      replica.collectionName = instance.collection.getName();
      return replica;
    }
  }
}
