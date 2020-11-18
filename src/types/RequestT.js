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

export interface LegacyResponseInterface<T = AxiosResponse> {
  body: ?$PropertyType<T, 'data'>,
  headers: $PropertyType<T, 'headers'>,
  status: $PropertyType<T, 'status'>,
  message: $PropertyType<T, 'statusText'>
};

// export type LegacyResponseInterface = LegacyResponseInterface;

export interface AxiosResponse<T = any, R = T> {
  data: R;
  status: number;
  statusText: string;
  headers: ?object;
  config: Config<T, R>;
  request: ?any;
};

export interface AxiosTransformer<T> {
  (data: T, headers?: object): object;
};

export interface AxiosBasicCredentials {
  username: string;
  password: string;
};

export interface AxiosProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password:string;
  };
  protocol?: string;
};

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH';

export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

export type RequestArgumentsT<T, R = T> = [string, string, ?Config<T, R>];

// export type AxiosPromise<T = any, R = T> = Promise<AxiosResponse<T, R>>;

export interface Config<T, R = T> {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: AxiosTransformer<T> | Array<AxiosTransformer<T>> | {[key: number]: AxiosTransformer<T>};
  transformResponse?: AxiosTransformer<R> | Array<AxiosTransformer<R>> | {[key: number]: AxiosTransformer<T>};
  headers?: object;
  params?: object;
  paramsSerializer?: (params: object) => string;
  data?: any;
  body?: any;
  form?: any;
  timeout?: number;
  withCredentials?: boolean;
  adapter?: <T, R>(config: Config<T, R>) => Promise<AxiosResponse<T, R>>;
  auth?: AxiosBasicCredentials;
  responseType?: ResponseType;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: (status: number) => boolean;
  followRedirect?: boolean,
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: mixed;
  httpsAgent?: mixed;
  proxy?: AxiosProxyConfig | false;
  cancelToken?: CancelToken;
};

export interface LegacyRequestInterface {
  <
    T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
  >(method: string, url: string, options: ?Config<T, R>): Promise<L>,

  head<
    T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
  >(url: string, options: ?Config<T, R>): Promise<L>,

  options<
    T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
  >(url: string, options: ?Config<T, R>): Promise<L>,

  get<
    T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
  >(url: string, options: ?Config<T, R>): Promise<L>,

  post<
    T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
  >(url: string, options: ?Config<T, R>): Promise<L>,

  put<
    T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
  >(url: string, options: ?Config<T, R>): Promise<L>,

  patch<
    T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
  >(url: string, options: ?Config<T, R>): Promise<L>,

  'delete'<
    T = any, R = T, L = LegacyResponseInterface<AxiosResponse<T, R>>
  >(url: string, options: ?Config<T, R>): Promise<L>,
};

// export type LegacyRequestInterface = LegacyRequestInterface;

export interface Cancel {
  // constructor(message?: string): Cancel;
  message: string;
};

export interface Canceler {
  (message?: string): void;
};

export interface CancelTokenStatic {
  new (executor: (cancel: Canceler) => void): CancelToken;
  source(): CancelTokenSource;
};

export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
};

export interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
};

export interface AxiosInterceptorManager<V> {
  use(
    onFulfilled?: (value: V) => V | Promise<V>,
    onRejected?: (error: mixed) => mixed
  ): number;
  eject(id: number): void;
};

export interface RequestT extends LegacyRequestInterface {
  defaults: { headers: object } & Config<*, *>,
  interceptors: {
    request: AxiosInterceptorManager<Config<*, *>>,
    response: AxiosInterceptorManager<AxiosResponse<mixed>>
  },
  // Cancel: Class<Cancel>;
  CancelToken: CancelTokenStatic,
  // isCancel(value: any): boolean;
  create: (config: Config<*, *>) => LegacyRequestInterface,
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
};

// export type RequestT = RequestT;
