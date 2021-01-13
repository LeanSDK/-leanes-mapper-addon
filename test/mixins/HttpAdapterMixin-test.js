const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, meta, mixin, constant, method, property, plugin
} = LeanES.NS;

const commonServerInitializer = require('../common/server');
const server = commonServerInitializer({
  fixture: 'HttpAdapterMixin'
});

describe('HttpAdapterMixin', () => {
  describe('.new', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should create HTTP collection instance', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_000';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      })
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection, 'The `collection` is not an instance of HttpCollection')
    });
  });
  describe('.sendRequest', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should make simple request', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_001';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      })
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection, 'The `collection` is not an instance of HttpCollection');
      const data = await collection.adapter.sendRequest(
        'GET',
        'http://localhost:8000',
        {
          responseType: 'json',
          headers: {}
        }
      );
      assert.equal(data.status, 200);
      assert.equal((data.body != null ? data.body.message : ''), 'OK')
    });
  });
  describe('.requestHashToArguments, .makeRequest', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should make simple request', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_002';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      })
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection);
      const hash = collection.adapter.requestHashToArguments({
        method: 'GET',
        url: 'http://localhost:8000',
        headers: {},
        data: null
      });
      assert.equal(hash[0], 'GET', 'Method is incorrect');
      assert.equal(hash[1], 'http://localhost:8000', 'URL is incorrect');
      assert.equal(hash[2] != null ? hash[2].responseType : void 0, 'json', 'JSON option is not set');
      const data = await collection.adapter.makeRequest({
        method: 'GET',
        url: 'http://localhost:8000',
        headers: {},
        data: null
      });
      assert.equal(data.status, 200, 'Request received not OK status');
      assert.equal(data != null ? data.body != null ? data.body.message : void 0 : void 0, 'OK', 'Incorrect body');
    });
  });
  describe('.methodForRequest', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get method name from request params', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_003';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends Test.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      })
      const collection = facade.getProxy(collectionName);
      let method = collection.adapter.methodForRequest({
        requestType: 'takeAll',
        recordName: 'TestRecord'
      });
      assert.equal(method, 'GET', 'Replace method is incorrect');
      method = collection.adapter.methodForRequest({
        requestType: 'take',
        recordName: 'TestRecord'
      });
      assert.equal(method, 'GET', 'Find method is incorrect');
      method = collection.adapter.methodForRequest({
        requestType: 'push',
        recordName: 'TestRecord'
      });
      assert.equal(method, 'POST', 'Insert method is incorrect');
      method = collection.adapter.methodForRequest({
        requestType: 'remove',
        recordName: 'TestRecord'
      });
      assert.equal(method, 'DELETE', 'Update method is incorrect');
      method = collection.adapter.methodForRequest({
        requestType: 'override',
        recordName: 'TestRecord'
      });
      assert.equal(method, 'PUT', 'Replace method is incorrect');
      method = collection.adapter.methodForRequest({
        requestType: 'someOther',
        recordName: 'TestRecord'
      });
      assert.equal(method, 'GET', 'Any other method is incorrect');
    });
  });
  describe('.urlPrefix', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url prefix', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_004';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      })
      const collection = facade.getProxy(collectionName)
      let url = collection.adapter.urlPrefix('Test', 'Tests');
      assert.equal(url, 'Tests/Test');
      url = collection.adapter.urlPrefix('/Test');
      assert.equal(url, 'http://localhost:8000/Test');
      url = collection.adapter.urlPrefix();
      assert.equal(url, 'http://localhost:8000/v1');
    });
  });
  describe('.makeURL', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get new url by options', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_005';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.makeURL('Test', null, null, true);
      assert.equal(url, 'http://localhost:8000/v1/tests');
      url = collection.adapter.makeURL('Test', null, '123', false);
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
    });
  });
  describe('.pathForType', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url for type', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_006';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.pathForType('Type');
      assert.equal(url, 'types');
      url = collection.adapter.pathForType('TestRecord');
      assert.equal(url, 'tests');
      url = collection.adapter.pathForType('test-info');
      assert.equal(url, 'test_infos');
    });
  });
  describe('.urlForTakeAll', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url for `take all` request', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_007';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.urlForTakeAll('Test', null);
      assert.equal(url, 'http://localhost:8000/v1/tests');
      url = collection.adapter.urlForTakeAll('TestRecord', null);
      assert.equal(url, 'http://localhost:8000/v1/tests');
    });
  });
  describe('.urlForTake', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url for `take` request', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_008';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.urlForTake('Test', '123');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.urlForTake('TestRecord', '123');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
    });
  });
  describe('.urlForPush', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url for `push` request', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_009';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.urlForPush('Test', {});
      assert.equal(url, 'http://localhost:8000/v1/tests');
      url = collection.adapter.urlForPush('TestRecord', {});
      assert.equal(url, 'http://localhost:8000/v1/tests');
    });
  });
  describe('.urlForRemove', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url for `remove` request', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_010';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);


      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.urlForRemove('Test', '123');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.urlForRemove('TestRecord', '123');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
    });
  });
  describe('.urlForOverride', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url for `override` request', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_011';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);


      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.urlForOverride('Test', {}, '123');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.urlForOverride('TestRecord', {}, '123');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
    });
  });
  describe('.buildURL', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url from request params', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_012';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);


      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
        @method urlForSomeRequest() {
          return '';
        }
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.buildURL('Test', {}, null, 'takeAll', null);
      assert.equal(url, 'http://localhost:8000/v1/tests');
      url = collection.adapter.buildURL('Test', {}, '123', 'take');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.buildURL('Test', {
        a: '1'
      }, null, 'push');
      assert.equal(url, 'http://localhost:8000/v1/tests');
      url = collection.adapter.buildURL('Test', {}, '123', 'remove');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.buildURL('Test', {}, '123', 'override');
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.buildURL('Test', {}, null, 'someRequest', null);
      assert.isString(url);
    });
  });
  describe('.urlForRequest', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get url from request params', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_013';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
        @method urlForTest(recordName, query, snapshot, id) {
          return `TEST_${recordName != null ? recordName : 'RECORD_NAME'}_${id != null ? id : 'RECORD_ID'}_${JSON.stringify(snapshot) != null ? JSON.stringify(snapshot) : 'SNAPSHOT'}_${JSON.stringify(query) != null ? JSON.stringify(query) : 'QUERY'}`;
        }
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let url = collection.adapter.urlForRequest({
        recordName: 'Test',
        snapshot: {},
        requestType: 'takeAll',
        query: {},
        id: '123'
      });
      assert.equal(url, 'http://localhost:8000/v1/tests');
      url = collection.adapter.urlForRequest({
        recordName: 'Test',
        snapshot: {},
        requestType: 'take',
        query: {},
        id: '123'
      });
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.urlForRequest({
        recordName: 'Test',
        snapshot: {},
        requestType: 'push',
        query: {},
        id: '123'
      });
      assert.equal(url, 'http://localhost:8000/v1/tests');
      url = collection.adapter.urlForRequest({
        recordName: 'Test',
        snapshot: {},
        requestType: 'remove',
        query: {},
        id: '123'
      });
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.urlForRequest({
        recordName: 'Test',
        snapshot: {},
        requestType: 'override',
        query: {},
        id: '123'
      });
      assert.equal(url, 'http://localhost:8000/v1/tests/123');
      url = collection.adapter.urlForRequest({
        recordName: 'Test',
        snapshot: {},
        requestType: 'test',
        query: {},
        id: '123'
      });
      assert.equal(url, 'TEST_Test_123_{}_{}');
    });
  });
  describe('.headersForRequest', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get headers for collection', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_HTTP_COLLECTION_014';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      collection.initializeNotifier(KEY);
      let headers = collection.adapter.headersForRequest({
        requestType: 'takeAll',
        recordName: 'test'
      });
      assert.deepEqual(headers, {
        'Accept': 'application/json'
      });
      headers = collection.adapter.headersForRequest({
        requestType: 'take',
        recordName: 'test'
      });
      assert.deepEqual(headers, {
        'Accept': 'application/json'
      });
      headers = collection.adapter.headersForRequest({
        requestType: 'push',
        recordName: 'test'
      });
      assert.deepEqual(headers, {
        'Accept': 'application/json'
      });
      headers = collection.adapter.headersForRequest({
        requestType: 'remove',
        recordName: 'test'
      });
      assert.deepEqual(headers, {
        'Accept': 'application/json'
      });
      headers = collection.adapter.headersForRequest({
        requestType: 'override',
        recordName: 'test'
      });
      assert.deepEqual(headers, {
        'Accept': 'application/json'
      });
      collection.adapter.headers = {
        'Allow': 'GET'
      };
      headers = collection.adapter.headersForRequest({
        requestType: 'test',
        recordName: 'test'
      });
      assert.deepEqual(headers, {
        'Accept': 'application/json',
        'Allow': 'GET'
      });
    });
  });
  describe('.dataForRequest', () => {
    let facade = null;
    afterEach(async () => {
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get data for request', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_HTTP_COLLECTION_015';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      let data = collection.adapter.dataForRequest({
        requestType: 'push',
        recordName: 'TestRecord',
        snapshot: {
          name: 'test1'
        }
      });
      assert.deepEqual(data, {
        name: 'test1'
      });
      data = collection.adapter.dataForRequest({
        requestType: 'override',
        recordName: 'TestRecord',
        snapshot: {
          name: 'test2'
        }
      });
      assert.deepEqual(data, {
        name: 'test2'
      });
    });
  });
  describe('.requestFor', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    // let facade = null;
    // afterEach(async () => {
    //   facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    // });
    it('should request params', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_HTTP_COLLECTION_016';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const sampleData = {
        name: 'test'
      };
      let request = collection.adapter.requestFor({
        recordName: 'TestRecord',
        snapshot: void 0,
        requestType: 'takeAll',
        query: {}
      });
      assert.deepEqual(request, {
        method: 'GET',
        url: 'http://localhost:8000/v1/tests',
        headers: {
          'Accept': 'application/json'
        },
        data: void 0
      });
      request = collection.adapter.requestFor({
        recordName: 'TestRecord',
        snapshot: sampleData,
        requestType: 'push'
      });
      assert.deepEqual(request, {
        method: 'POST',
        url: 'http://localhost:8000/v1/tests',
        headers: {
          'Accept': 'application/json'
        },
        data: sampleData
      });
      request = collection.adapter.requestFor({
        recordName: 'TestRecord',
        snapshot: sampleData,
        requestType: 'override',
        id: '123'
      });
      assert.deepEqual(request, {
        method: 'PUT',
        url: 'http://localhost:8000/v1/tests/123',
        headers: {
          'Accept': 'application/json'
        },
        data: sampleData
      });
      request = collection.adapter.requestFor({
        recordName: 'TestRecord',
        requestType: 'remove',
        query: {},
        id: '123'
      });
      assert.deepEqual(request, {
        method: 'DELETE',
        url: 'http://localhost:8000/v1/tests/123',
        headers: {
          'Accept': 'application/json'
        },
        data: void 0
      });
      request = collection.adapter.requestFor({
        recordName: 'TestRecord',
        snapshot: void 0,
        requestType: 'take',
        id: '123'
      });
      assert.deepEqual(request, {
        method: 'GET',
        url: 'http://localhost:8000/v1/tests/123',
        headers: {
          'Accept': 'application/json'
        },
        data: void 0
      });
    });
  });
  describe('.push', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should put data into collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_017';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }

      facade.addAdapter('TestAdapter', 'TestAdapter')
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection);
      const spyPush = sinon.spy(collection, 'push');
      const spySendRequest = sinon.spy(collection.adapter, 'sendRequest');
      const record = await collection.create({
        test: 'test1'
      });
      assert.equal(record, spyPush.args[0][0]);
      assert.equal(spySendRequest.args[0][0], 'POST');
      assert.equal(spySendRequest.args[0][1], 'http://localhost:8000/v1/tests');
      assert.equal(spySendRequest.args[0][2].body.test.test, 'test1');
      assert.equal(spySendRequest.args[0][2].body.test.type, 'Test::TestRecord');
      assert.deepEqual(spySendRequest.args[0][2].headers, {
        'Accept': 'application/json'
      });
    });
  });
  describe('.remove', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should remove data from collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_018';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
        @method generateId() {
          return Test.NS.Utils.uuid.v4();
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      const spySendRequest = sinon.spy(collection.adapter, 'sendRequest');
      assert.instanceOf(collection, HttpCollection);
      const record = await collection.create({
        test: 'test1'
      });
      const resp = await record.destroy();
      assert.equal(spySendRequest.lastCall.args[0], 'DELETE');
      assert.equal(spySendRequest.lastCall.args[1], `http://localhost:8000/v1/tests/${record.id}`);
      assert.deepEqual(spySendRequest.lastCall.args[2].headers, {
        'Accept': 'application/json'
      });
    });
  });
  describe('.take', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get data item by id from collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_019';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
        @method generateId() {
          return Test.NS.Utils.uuid.v4();
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection);
      const record = await collection.create({
        test: 'test1'
      });
      const recordDuplicate = await collection.take(record.id);
      assert.notEqual(record, recordDuplicate);
      const ref = Test.NS.TestRecord.attributes;
      for (let j = 0; j < ref.length; j++) {
        const attribute = ref[j];
        assert.equal(record[attribute], recordDuplicate[attribute]);
      }
    });
  });
  describe('.takeMany', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get data items by id list from collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_020';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
        @method generateId() {
          return Test.NS.Utils.uuid.v4();
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection);
      const originalRecords = [];
      for (let i = 1; i <= 5; i++) {
        originalRecords.push(await collection.create({
          test: 'test1'
        }));
      }
      const ids = originalRecords.map((item) => {
        return item.id;
      });
      const recordDuplicates = await (await collection.takeMany(ids)).toArray();
      assert.equal(originalRecords.length, recordDuplicates.length);
      const count = originalRecords.length;
      let k;
      for (let i = k = 1; (1 <= count ? k <= count : k >= count); i = 1 <= count ? ++k : --k) {
        const ref1 = Test.NS.TestRecord.attributes;
        for (let l = 0; l < ref1.length; l++) {
          const attribute = ref1[l];
          assert.equal(originalRecords[i][attribute], recordDuplicates[i][attribute]);
        }
      }
    });
  });
  describe('.takeAll', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should get all data items from collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_021';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
        @method generateId() {
          return Test.NS.Utils.uuid.v4();
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection);
      const originalRecords = [];
      for (let i = 1; i <= 5; i++) {
        originalRecords.push(await collection.create({
          test: 'test1'
        }));
      }
      const ids = originalRecords.map(function (item) {
        return item.id;
      });
      const recordDuplicates = await (await collection.takeAll()).toArray();
      assert.equal(originalRecords.length, recordDuplicates.length);
      const count = originalRecords.length;
      let k;
      for (let i = k = 1; (1 <= count ? k <= count : k >= count); i = 1 <= count ? ++k : --k) {
        const ref1 = Test.NS.TestRecord.attributes;
        for (let l = 0; l < ref1.length; l++) {
          const attribute = ref1[l];
          assert.equal(originalRecords[i][attribute], recordDuplicates[i][attribute]);
        }
      }
    });
  });
  describe('.override', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should replace data item by id in collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_022';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) name;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
        @method generateId() {
          return Test.NS.Utils.uuid.v4();
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection);
      const record = await collection.create({
        name: 'test1'
      });
      const updatedRecord = await collection.override(record.id, await collection.build({
        name: 'test2'
      }));
      assert.isDefined(updatedRecord);
      assert.equal(record.id, updatedRecord.id);
      assert.propertyVal(record, 'name', 'test1');
      assert.propertyVal(updatedRecord, 'name', 'test2');
    });
  });
  describe('.includes', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should test if item is included in the collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_023';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
        @method generateId() {
          return Test.NS.Utils.uuid.v4();
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection);
      const record = await collection.create({
        test: 'test1'
      });
      assert.isDefined(record);
      const includes = await collection.includes(record.id);
      assert.isTrue(includes);
    });
  });
  describe('.length', () => {
    let facade = null;
    before(() => {
      server.listen(8000);
    });
    afterEach(async () => {
      await new Promise((resolve) => server.close(resolve))
      facade != null ? typeof facade.remove === "function" ? await facade.remove() : void 0 : void 0;
    });
    it('should count items in the collection', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'FACADE_TEST_HTTP_COLLECTION_024';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
        @constant ROOT = `${__dirname}/config/root`;
      }
      const { attribute } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      class TestRecord extends Test.NS.Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
        constructor() {
          super(...arguments);
          this.type = 'Test::TestRecord';
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class HttpCollection extends Test.NS.Collection {
        @nameBy static __filename = 'HttpCollection';
        @meta static object = {};
        @method generateId() {
          return Test.NS.Utils.uuid.v4();
        }
      }

      @initialize
      @partOf(Test)
      @mixin(Test.NS.HttpAdapterMixin)
      class TestAdapter extends LeanES.NS.Adapter {
        @nameBy static __filename = 'TestAdapter';
        @meta static object = {};
        @property host = 'http://localhost:8000';
        @property namespace = 'v1';
      }
      facade.addAdapter('TestAdapter', 'TestAdapter');
      facade.addProxy(collectionName, 'HttpCollection', {
        delegate: 'TestRecord',
        adapter: 'TestAdapter'
      });
      const collection = facade.getProxy(collectionName);
      assert.instanceOf(collection, HttpCollection);
      const count = 11;
      let j;
      for (let i = j = 1; (1 <= count ? j <= count : j >= count); i = 1 <= count ? ++j : --j) {
        await collection.create({
          test: 'test1'
        });
      }
      const length = await collection.length();
      assert.equal(count, length);
    });
  });
});
