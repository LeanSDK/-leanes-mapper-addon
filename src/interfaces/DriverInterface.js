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

export interface DriverInterface<R, T, A = Array<?T>> {
  _cleanType: 'adapter';

  getName(): string;

  setName(asName: string): void;

  push(delegate: R, aoRecord: object): Promise<T>;

  remove(delegate: R, id: string | number): Promise<void>;

  take(delegate: R, id: string | number): Promise<?T>;

  takeMany(delegate: R, ids: Array<string | number>): Promise<A>;

  takeAll(delegate: R): Promise<A>;

  override(delegate: R, id: string | number, aoRecord: object): Promise<T>;

  includes(delegate: R, id: string | number): Promise<boolean>;

  length(delegate: R): Promise<number>;
}
