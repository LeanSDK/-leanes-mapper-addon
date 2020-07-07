const assert = require('chai');
ES = require('../../src/leanes/es/index');
const {jsonStringify, co} = ES.NS.Utils;

describe('Utils.jsonStringify', () => {
   describe('jsonStringify(object, options)', () => {
    it('should stringify flat object', () => {
      co(function*() {
        let object = {};
        object.x = 'test';
        object.a = 42;
        object.test = false;
        const result = jsonStringify(object);
        assert.equal(result, '{"a":42,"test":false,"x":"test"}');
      });
    });
     it('should stringify nested object', () => {
      co(function*() {
        let object = {};
        object.x = 'test';
        object.a = 42;
        object.test = false;
        object.nested = {};
        object.nested.c = 1;
        object.nested.b = 2;
        object.nested.a = 3;
        constresult = jsonStringify(object);
        assert.equal(result, '{"a":42,"nested":{"a":3,"b":2,"c":1},"test":false,"x":"test"}');
      });
    });
  });
});