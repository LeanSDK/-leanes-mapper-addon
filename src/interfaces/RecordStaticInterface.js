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
import type { JoiT } from '@leansdk/leanes/src/leanes';

export interface RecordStaticInterface<
  R = RecordInterface, C = CollectionInterface<R>
> {
  +schema: JoiT;

  // normalize(ahPayload: ?object, aoCollection: C): Promise<R>;
  normalize(ahPayload: ?object, aoCollection: ?C): Promise<?[Class<*>, object]>;

  serialize(aoRecord: ?R): Promise<?object>;

  // recoverize(ahPayload: ?object, aoCollection: C): Promise<?R>;
  recoverize(ahPayload: ?object, aoCollection: ?C): Promise<?[Class<*>, object]>;

  objectize(aoRecord: ?R): ?object;

  makeSnapshot(aoRecord: ?R): ?object;

  parseRecordName(asName: string): [string, string];
  findRecordByName(asName: string): RecordStaticInterface;

  parentClassNames(AbstractClass: ?RecordStaticInterface): string[];

  +attributes: {[key: string]: AttributeConfigT};
  +computeds: {[key: string]: ComputedConfigT};

  new(aoAttributes: object, aoCollection: C): R;
  (aoAttributes: object, aoCollection: C): R;
}
