// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Focm":[function(require,module,exports) {
"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _router = _interopRequireDefault(require("@koa/router"));

var _koaBody = _interopRequireDefault(require("koa-body"));

var _redis = _interopRequireDefault(require("redis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @Author: lifuzhao
 * @Date: 2019-12-2019-12-01 22:14
 * @Project: dsWork
 */
const app = new _koa.default();
const router = new _router.default();

const client = _redis.default.createClient();

app.use((0, _koaBody.default)({}));
client.on('error', err => {
  console.log('redis client err2：', err);
});
router.get('/hello', (ctx, next) => {
  ctx.body = 'hello world';
});

function Result() {
  this.success = false;
  this.message = '';
  this.data = null;
}

async function checkUser(body, checkInRedis) {
  let {
    username,
    password
  } = body;
  let result = new Result();

  if (!username) {
    result.message = '请输入username';
  } else if (!password) {
    result.message = '请输入password';
  } else {
    if (checkInRedis) {
      await new Promise(resolve => {
        client.get(username, (err, result) => {
          if (err || result) {
            result.message = '找不到该用户';
          } else {
            result.success = true;
          }

          resolve();
        });
      });
    } else {
      result.success = true;
    }
  }

  resolve(result);
}

router.post('/login', (ctx, next) => {
  let {
    username,
    password
  } = ctx.request.body;
  let result = checkUser(ctx.request.body, true);

  if (result.success) {
    result.success = true;
    result.message = '成功';
    client.set(username, password);
  }

  ctx.status = 200;
  ctx.body = result;
});
router.post('/schedule/add', (ctx, next) => {
  let {
    username,
    password
  } = ctx.request.body;
  let result = checkUser(ctx.request.body);

  if (result.success) {}
});
app.use(router.routes()).use(router.allowedMethods()); // client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//   console.log(replies.length + " replies:");
//   replies.forEach(function (reply, i) {
//     console.log("    " + i + ": " + reply);
//   });
//   client.quit();
// });
// client.hmset('fff', {name:'fuzhao'})
// client.hmset('scheduleConfig', 'fuzhao@datastory.com.cn', [{id: 1, name: 'test'}])
// // client.hmset('scheduleConfig', 'dilu@163.com', 'asdfgh')
//
//
// client.hgetall('scheduleConfig', (err, result) => {
//   console.log('err', err)
//   console.log('result', result)
// })
// client.hmset('scheduleConfig', 'fuzhao@datastory.com.cn', 'azaa')

app.listen(2048, () => {
  console.log('server listening at port 2048');
});
},{}]},{},["Focm"], null)