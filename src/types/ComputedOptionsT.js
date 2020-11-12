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

import type { TransformStaticInterface } from '../interfaces/TransformStaticInterface';
import type { JoiT } from '@leansdk/leanes/src/leanes';

export type ComputedOptionsT = {
  type: (
    'json' |
    'binary' |
    'boolean' |
    'date' |
    'datetime' |
    'number' |
    'decimal' |
    'float' |
    'integer' |
    'primary_key' |
    'string' |
    'text' |
    'time' |
    'timestamp' |
    'array' |
    'hash'
  ),
  transform?: () => $Diff<TransformStaticInterface, {}>,
  validate?: () => JoiT
}
