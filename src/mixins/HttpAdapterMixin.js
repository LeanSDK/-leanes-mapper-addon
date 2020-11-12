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

import type { HttpRequestParamsT } from '../types/HttpRequestParamsT';
import type { HttpRequestHashT } from '../types/HttpRequestHashT';

import type {
  RequestArgumentsT, LegacyResponseInterface, AxiosResponse,
} from '@leansdk/leanes/src/leanes/leanes/types/RequestT';

export default (Module) => {
  const {
    assert,
    initializeMixin, meta, property, method,
    Utils: {_, inflect, request}
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin<
      R = Class<{name: string}>, T = object
    > extends BaseClass implements DriverInterface<R, T> {
      @meta static object = {};

      // ipsRecordMultipleName = PointerT(_Class.private({
      @property _recordMultipleName: ?string = null;

      // ipsRecordSingleName = PointerT(_Class.private({
      @property _recordSingleName: ?string = null;

      @property headers: ?{[key: string]: string} = null;

      @property host: string = 'http://localhost';

      @property namespace: string = '';

      @method recordMultipleName(delegateName): string {
        if (this._recordMultipleName == null) {
          this._recordMultipleName = inflect.pluralize(
            this.recordSingleName(delegateName)
          );
        }
        return this._recordMultipleName;
      }

      @method recordSingleName(delegateName): string {
        if (this._recordSingleName == null) {
          this._recordSingleName = inflect.underscore(
            delegateName.replace(/Record$/, '')
          );
        }
        return this._recordSingleName;
      }

      @method async push(acRecord: R, snapshot: T): Promise<T> {
        const params = {};
        params.requestType = 'push';
        params.recordName = acRecord.name;
        params.snapshot = snapshot;
        const requestObj = this.requestFor(params);
        const res = await this.makeRequest(requestObj);
        assert(res.status < 400, `Request failed with status ${res.status} ${res.message}`);
        let { body } = res;
        if ((body != null) && body !== '') {
          if (_.isString(body)) {
            body = JSON.parse(body);
          }
          return body[this.recordSingleName(acRecord.name)];
        } else {
          assert.fail("Record payload has not existed in response body.");
        }
      }

      @method async remove(acRecord: R, id: string | number): Promise<void> {
        const params = {};
        params.requestType = 'remove';
        params.recordName = acRecord.name;
        params.id = id;
        const requestObj = this.requestFor(params);
        const res = await this.makeRequest(requestObj);
        assert(res.status < 400, `Request failed with status ${res.status} ${res.message}`);
      }

      @method async take(acRecord: R, id: string | number): Promise<?T> {
        const params = {};
        params.requestType = 'take';
        params.recordName = acRecord.name;
        params.id = id;
        const requestObj = this.requestFor(params);
        const res = await this.makeRequest(requestObj);
        assert(res.status < 400, `Request failed with status ${res.status} ${res.message}`);
        let { body } = res;
        if ((body != null) && body !== '') {
          if (_.isString(body)) {
            body = JSON.parse(body);
          }
          return body[this.recordSingleName(acRecord.name)];
        } else {
          assert.fail("Record payload has not existed in response body.");
        }
      }

      @method async takeMany(acRecord: R, ids: Array<string | number>): Promise<T[]> {
        return await Promise.all(ids.map((id) => this.take(acRecord, id)));
      }

      @method async takeAll(acRecord: R): Promise<T[]> {
        const params = {};
        params.requestType = 'takeAll';
        params.recordName = acRecord.name;
        const requestObj = this.requestFor(params);
        const res = await this.makeRequest(requestObj);
        assert(res.status < 400, `Request failed with status ${res.status} ${res.message}`);
        let { body } = res;
        if ((body != null) && body !== '') {
          if (_.isString(body)) {
            body = JSON.parse(body);
          }
          return body[this.recordMultipleName(acRecord.name)];
        } else {
          assert.fail("Record payload has not existed in response body.");
        }
      }

      @method async override(acRecord: R, id: string | number, snapshot: T): Promise<T> {
        const params = {};
        params.requestType = 'override';
        params.recordName = acRecord.name;
        params.snapshot = snapshot;
        params.id = id;
        const requestObj = this.requestFor(params);
        const res = await this.makeRequest(requestObj);
        assert(res.status < 400, `Request failed with status ${res.status} ${res.message}`);
        let { body } = res;
        if ((body != null) && body !== '') {
          if (_.isString(body)) {
            body = JSON.parse(body);
          }
          return body[this.recordSingleName(acRecord.name)];
        } else {
          assert.fail("Record payload has not existed in response body.");
        }
      }

      @method async includes(acRecord: R, id: string | number): Promise<boolean> {
        const record = await this.take(acRecord, id);
        return record != null;
      }

      @method async length(acRecord: R): Promise<number> {
        const items = await this.takeAll(acRecord);
        return items.length;
      }

      @method headersForRequest(params: ?HttpRequestParamsT = {}): {[key: string]: string} {
        const headers = this.headers || {};
        headers['Accept'] = 'application/json';
        return headers;
      }

      @method methodForRequest(params: HttpRequestParamsT): string {
        const { requestType } = params;
        switch (requestType) {
          case 'takeAll':
            return 'GET';
          case 'take':
            return 'GET';
          case 'push':
            return 'POST';
          case 'override':
            return 'PUT';
          case 'remove':
            return 'DELETE';
          default:
            return 'GET';
        }
      }

      @method dataForRequest(params: HttpRequestParamsT): ?object {
        const { recordName, snapshot, requestType, query } = params;
        if ((snapshot != null) && (requestType === 'push' || requestType === 'override')) {
          return snapshot;
        } else {

        }
      }

      @method urlForRequest(params: HttpRequestParamsT): string {
        const { recordName, snapshot, id, requestType, query } = params;
        return this.buildURL(recordName, snapshot, id, requestType, query);
      }

      @method pathForType(recordName: string): string {
        return inflect.pluralize(
          inflect.underscore(recordName.replace(/Record$/, ''))
        );
      }

      @method urlPrefix(path: ?string, parentURL: ?string): string {
        if (!this.host || this.host === '/') {
          this.host = '';
        }
        if (path) {
          // Protocol relative url
          if (/^\/\//.test(path) || /http(s)?:\/\//.test(path)) {
            // Do nothing, the full @host is already included.
            return path;
          // Absolute path
          } else if (path.charAt(0) === '/') {
            return `${this.host}${path}`;
          } else {
            // Relative path
            return `${parentURL}/${path}`;
          }
        }
        // No path provided
        const url = [];
        if (this.host) {
          url.push(this.host);
        }
        if (this.namespace) {
          url.push(this.namespace);
        }
        return url.join('/');
      }

      @method makeURL(recordName: string, query: ?object, id: ?(number | string), isQueryable: ?boolean): string {
        const url = [];
        const prefix = this.urlPrefix();
        if (recordName) {
          const path = this.pathForType(recordName);
          if (path) {
            url.push(path);
          }
        }
        if (prefix) {
          url.unshift(prefix);
        }
        if (id != null) {
          url.push(id);
        }
        let vsUrl = url.join('/');
        if (!this.host && vsUrl && vsUrl.charAt(0) !== '/') {
          vsUrl = '/' + vsUrl;
        }
        return vsUrl;
      }

      @method urlForTakeAll(recordName: string, query: ?object): string {
        return this.makeURL(recordName, query, null, false);
      }

      @method urlForTake(recordName: string, id: number | string): string {
        return this.makeURL(recordName, null, id, false);
      }

      @method urlForPush(recordName: string, snapshot: object): string {
        return this.makeURL(recordName, null, null, false);
      }

      @method urlForRemove(recordName: string, id: number | string): string {
        return this.makeURL(recordName, null, id, false);
      }

      @method urlForOverride(recordName: string, snapshot: object, id: number | string): string {
        return this.makeURL(recordName, null, id, false);
      }

      @method buildURL(
        recordName: string,
        snapshot: ?object,
        id: ?string,
        requestType: string,
        query: ?object
      ): string {
        switch (requestType) {
          case 'takeAll':
            return this.urlForTakeAll(recordName, query);
          case 'take':
            return this.urlForTake(recordName, id);
          case 'push':
            return this.urlForPush(recordName, snapshot);
          case 'remove':
            return this.urlForRemove(recordName, id);
          case 'override':
            return this.urlForOverride(recordName, snapshot, id);
          default:
            const vsMethod = `urlFor${inflect.camelize(requestType)}`;
            return typeof this[vsMethod] === "function" ? this[vsMethod](recordName, query, snapshot, id) : undefined;
        }
      }

      @method requestFor(params: HttpRequestParamsT): HttpRequestHashT {
        const method = this.methodForRequest(params);
        const url = this.urlForRequest(params);
        const headers = this.headersForRequest(params);
        const data = this.dataForRequest(params);
        return { method, url, headers, data };
      }

      @method async sendRequest<
        T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
      >(...args: RequestArgumentsT<T, R>): Promise<L> {
        const [ method, url, options ] = args;
        return await request(method, url, options);
      }

      @method requestHashToArguments<T = any, R = T>(
        hash: HttpRequestHashT
      ): RequestArgumentsT<T, R> {
        const { method, url, headers, data } = hash;
        const options = {
          responseType: 'json',
          headers
        };
        if (data != null) {
          options.body = data;
        }
        return [ method, url, options ];
      }

      @method async makeRequest<
        T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
      >(requestObj: HttpRequestHashT): Promise<L> { // result of requestFor
        const {
          LogMessage: { SEND_TO_LOG, LEVELS, DEBUG }
        } = Module.NS.Pipes.NS;
        const hash = this.requestHashToArguments(requestObj);
        this.send(SEND_TO_LOG, `HttpCollectionMixin::makeRequest hash ${JSON.stringify(hash)}`, LEVELS[DEBUG]);
        return await this.sendRequest(...hash);
      }
    }
    return Mixin;
  });
}
