const http = require('http');
const URL = require('url');
const querystring = require('querystring');
const _ = require('lodash');
const inflect = require('i')();
const LeanES = require('@leansdk/leanes/src').default;

module.exports = function (options) {
  const server = {
    data: {}
  };
  const FIXTURE_NAME = `${__dirname}/fixtures/${options.fixture}.json`;
  let ref = null;
  const FIXTURE = (ref = ((function () {
    try {
      return require(FIXTURE_NAME);
    } catch (error) {
      const err = error;
      console.log(err);
    }
  })())) != null ? ref : {
      "/": {
        "OPTIONS": {
          "headers": {
            "Allow": "HEAD, OPTIONS"
          },
          "statusCode": 200,
          "statusMessage": "OK"
        },
        "HEAD": {
          "statusCode": 200,
          "statusMessage": "OK"
        }
      }
    };

  for (const pathName in FIXTURE) {
    if (!{}.hasOwnProperty.call(FIXTURE, pathName)) continue;
    const methods = FIXTURE[pathName];
    for (const methodName in methods) {
      if (!{}.hasOwnProperty.call(methods, methodName)) continue;
      const methodConfig = methods[methodName];
      if (methodName === '*' || [].indexOf.call(methodName, ',') >= 0) {
        const names = methodName === '*' ? ['HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'] : methodName.split(',');
        delete methods[methodName];
        for (const name of names) {
          if (!_.isEmpty(name)) {
            methods[name] = methodConfig;

          }
        }
      }
    }
  }
  server.server = http.createServer(function (req, res) {
    res.setHeader('Content-Type', (req.headers['accept']) != null ? req.headers['accept'] : 'text/plain');
    const url = URL.parse(req.url);
    req.rawBody = Buffer.from([]);
    req.on('data', function (chunk) {
      req.rawBody = Buffer.concat([req.rawBody, chunk], req.rawBody.length + chunk.length);
    });
    req.on('end', function () {
      req.body = req.rawBody.toString('utf8');
      let ref2 = null;
      let response = '';
      const body = _.isEmpty(req.body) ? {} : (ref2 = ((function () {
        try {
          return JSON.parse(req.body);
        } catch (error) { }
      })())) != null ? ref2 : {};
      const pathname = _.findKey(FIXTURE, function (value, key) {
        if (/\:/.test(key)) {
          const mask = key.replace(/(\:[\w\_]+)/g, '([\\w\\-]+)');
          const regExp = new RegExp(mask);
          const matches = regExp.test(url.pathname);
          if (matches) {
            const list1 = key.split('/');
            const list2 = url.pathname.split('/');
            let l;
            for (let i = l = 0; (0 <= list1.length ? l < list1.length : l > list1.length); i = 0 <= list1.length ? ++l : --l) {
              if (list1[i] !== list2[i]) {
                if (url.params == null) {
                  url.params = {};
                }
                url.params[list1[i]] = list2[i];
              }
            }
          }
          return matches;
        } else {
          return key === url.pathname;
        }
      });
      const path = FIXTURE[pathname != null ? pathname : url.pathname];
      if (path != null) {
        const method = path[req.method];
        if (method != null) {
          if (method.redirect != null) {
            res.statusCode = 302;
            res.statusMessage = 'Found';
            res.setHeader('Location', method.redirect);
          } else {
            res.statusCode = method.statusCode;
            if (res.statusCode == null) {
              res.statusCode = req.method === 'DELETE' ? 202 : 200;
            }
            res.statusMessage = method.statusMessage;
            if (res.statusMessage == null) {
              res.statusMessage = req.method === 'DELETE' ? 'No Content' : 'OK';
            }
            if (method.headers != null) {
              const ref3 = method.headers;
              for (headerName in ref3) {
                if (!{}.hasOwnProperty.call(ref3, headerName)) continue;
                headerValue = ref3[headerName];
                res.setHeader(headerName, headerValue);
              }
            }
            if (method.data != null) {
              switch (method.data) {
                case 'SELF':
                  let resp;
                  if (req.method === 'POST') {
                    if (body[`${path.single}`].id == null) {
                      body[`${path.single}`].id = LeanES.NS.Utils.uuid.v4();
                    }
                    resp = {
                      [`${path.single}`]: body[`${path.single}`]
                    };
                    const base = server.data;
                    const name1 = `test_${path.plural}`;
                    if (base[name1] == null) {
                      base[name1] = [];
                    }
                    server.data[`test_${path.plural}`].push(body[`${path.single}`]);
                  } else {
                    if (!_.isArray(body)) {
                      body = [body];
                    }
                    resp = {
                      [`${path.plural}`]: body
                    };
                  }
                  response = JSON.stringify(resp);
                  break;
                case 'GET':
                  let key = Object.keys(url.params)[0];
                  let collectionId = inflect.pluralize(key.replace(/(^\:|_id$)/g, ''));
                  const ref4 = server.data[`test_${path.plural}`];
                  let collection = ref4 != null ? ref4 : [];

                  let record = _.find(collection, {
                    id: url.params[key]
                  });
                  if (record != null) {
                    response = JSON.stringify({
                      [`${path.single}`]: record
                    });
                  } else {
                    res.statusCode = 404;
                    res.statusMessage = 'Not Found';
                  }
                  break;
                case 'DELETE':
                  key = Object.keys(url.params)[0];
                  collectionId = inflect.pluralize(key.replace(/(^\:|_id$)/g, ''));
                  const ref5 = server.data[`test_${path.plural}`];
                  collection = ref5 != null ? ref5 : [];
                  record = _.find(collection, {
                    id: url.params[key]
                  });
                  if (record != null) {
                    response = JSON.stringify({
                      [`${path.single}`]: record
                    });
                    _.remove(collection, {
                      id: url.params[key]
                    });
                  } else {
                    res.statusCode = 404;
                    res.statusMessage = 'Not Found';
                  }
                  break;
                case 'PUT':
                case 'PATCH':
                  key = Object.keys(url.params)[0];
                  collectionId = inflect.pluralize(key.replace(/(^\:|_id$)/g, ''));
                  const ref6 = server.data[`test_${path.plural}`];
                  collection = ref6 != null ? ref6 : [];
                  record = _.find(collection, {
                    id: url.params[key]
                  });
                  if (record != null) {
                    for (const key in body[`${path.single}`]) {
                      const value = body[`${path.single}`][key];
                      if (value != null) {
                        record[key] = value;
                      }
                    }
                    response = JSON.stringify({
                      [`${path.single}`]: record
                    });
                  } else {
                    res.statusCode = 404;
                    res.statusMessage = 'Not Found';
                  }
                  break;
                case 'QUERY':
                  let query;
                  ({ query } = querystring.parse(url.query));
                  if (!_.isEmpty(query)) {
                    query = JSON.parse(query);
                  }
                  if (body.query != null) {
                    if (query == null) {
                      query = body.query;
                    }
                  }
                  let ref7 = null;
                  let ref8 = null;
                  let ref9 = null;
                  collection = (ref7 = server.data[(ref8 = query != null ? (ref9 = query['$forIn']) != null ? ref9['@doc'] : void 0 : void 0) != null ? ref8 : `test_${path.plural}`]) != null ? ref7 : [];
                  const filter = function (item) {
                    if ((query != null ? query.$filter : void 0) != null) {
                      const ref10 = query.$filter;
                      for (const k in ref10) {
                        const v = ref10[k];
                        key = k.replace('@doc.', '');
                        if (key === '_key') {
                          key = 'id';
                        }
                        const property = _.get(item, key);
                        if (_.isString(v)) {
                          if (property !== v) {
                            return false;
                          }
                        } else {
                          for (const type in v) {
                            const cond = v[type];
                            switch (type) {
                              case '$eq':
                                if (property !== cond) {
                                  return false;
                                }
                                break;
                              case '$in':
                                if ([].indexOf.call(cond, property) < 0) {
                                  return false;
                                }
                                break;
                              default:
                                return false;
                            }
                          }
                        }
                      }
                    }
                    return true;
                  };
                  let records = [];
                  switch (req.method) {
                    case 'POST':
                      if (query['$insert'] != null) {
                        collection.push(query['$insert']);
                        response = JSON.stringify({
                          [`${path.plural}`]: [query['$insert']]
                        });
                      } else if ((query['$update'] != null) || (query['$replace'] != null)) {
                        records = _.filter(collection, filter);
                        const newBody = (ref10 = query['$update']) != null ? ref10 : query['$replace'];
                        for (let l = 0; l < records.length; l++) {
                          record = records[l];
                          for (key in newBody) {
                            const value = newBody[key];
                            if (key !== '_key' && key !== 'id') {
                              record[key] = value;
                            }
                          }
                        }
                        response = JSON.stringify({
                          [`${path.plural}`]: records
                        });
                      } else if (query['$remove'] != null) {
                        records = _.filter(collection, filter);
                        response = JSON.stringify({
                          [`${path.plural}`]: records
                        });
                        _.remove(collection, filter);
                      } else {
                        records = _.filter(collection, filter);
                        if (query != null ? query['$count'] : void 0) {
                          response = JSON.stringify({
                            count: records.length
                          });
                        } else {
                          response = JSON.stringify({
                            [`${path.plural}`]: records
                          });
                        }
                      }
                      break;
                    case 'GET':
                      records = _.filter(collection, filter);
                      if (query != null ? query['$count'] : void 0) {
                        response = JSON.stringify({
                          count: records.length
                        });
                      } else {
                        response = JSON.stringify({
                          [`${path.plural}`]: records
                        });
                      }
                      break;
                    case 'DELETE':
                      records = _.filter(collection, filter);
                      response = JSON.stringify({
                        [`${path.plural}`]: records
                      });
                      _.remove(collection, filter);
                      break;
                    case 'PUT':
                    case 'PATCH':
                      records = _.filter(collection, filter);
                      for (m = 0, len2 = records.length; m < records.length; m++) {
                        record = records[m];
                        for (key in body) {
                          const value = body[key];
                          if (key !== '_key' && key !== 'id') {
                            record[key] = value;
                          }
                        }
                      }
                      response = JSON.stringify({
                        [`${path.plural}`]: records
                      });
                  }
                  break;
                default:
                  if (method.data != null) {
                    response = JSON.stringify(method.data);
                  }
              }
            }
          }
        } else {
          res.statusCode = 405;
          res.statusMessage = 'Method Not Allowed';
        }
      } else {
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
      }
      if (response != null) {
        res.write(response, 'utf8');
      }
      res.end();
    });
  });
  server.listen = function (...args) {
    this.server.listen(...args);
  };
  server.close = function (callback) {
    server.data = {};
    this.server.close(callback);
  };
  return server;
};
