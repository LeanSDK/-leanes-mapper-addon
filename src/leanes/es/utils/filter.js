// This file is part of LeanES.
//
// LeanES is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// LeanES is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with LeanES.  If not, see <https://www.gnu.org/licenses/>.

export default async function filter(items, lambda, context) {
  const result = [];
  for (const index in items) {
    const item = items[index];
    await (async (item, index, items, context) => {
      if (await lambda.call(context, item, index, items)) {
        result.push(item);
      }
    })(item, index, items, context);
  }
  return result;
}
