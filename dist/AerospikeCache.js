"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Aerospike = require('aerospike');

var ApolloCacheAerospike =
/*#__PURE__*/
function () {
  function ApolloCacheAerospike(options) {
    (0, _classCallCheck2["default"])(this, ApolloCacheAerospike);
    this.options = options;
    this.hits = 0;
    this.misses = 0;
  }

  (0, _createClass2["default"])(ApolloCacheAerospike, [{
    key: "asClient",
    value: function () {
      var _asClient = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.client == null)) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return Aerospike.connect(this.options.cluster);

              case 3:
                this.client = _context.sent;

              case 4:
                return _context.abrupt("return", this.client);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function asClient() {
        return _asClient.apply(this, arguments);
      }

      return asClient;
    }()
  }, {
    key: "makeKey",
    value: function makeKey(key) {
      return new Aerospike.Key(this.options.namespace, this.options.set, key);
    }
  }, {
    key: "set",
    value: function () {
      var _set = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(key, data, options) {
        var client, bins, meta;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.asClient();

              case 2:
                client = _context2.sent;
                bins = {};
                bins[this.valueBinName] = data;
                if (options && options.ttl) meta = {
                  ttl: options.ttl
                };else meta = this.meta;
                _context2.next = 8;
                return client.put(this.makeKey(key), bins, meta);

              case 8:
                return _context2.abrupt("return");

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function set(_x, _x2, _x3) {
        return _set.apply(this, arguments);
      }

      return set;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(key) {
        var client, record;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.asClient();

              case 3:
                client = _context3.sent;
                _context3.next = 6;
                return client.get(this.makeKey(key));

              case 6:
                record = _context3.sent;
                this.hits += 1;
                return _context3.abrupt("return", record.bins[this.valueBinName]);

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);
                if (_context3.t0.code === Aerospike.status.ERR_RECORD_NOT_FOUND) this.misses += 1;
                return _context3.abrupt("return");

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 11]]);
      }));

      function get(_x4) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(key) {
        var client;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.asClient();

              case 3:
                client = _context4.sent;
                _context4.next = 6;
                return client.remove(this.makeKey(key));

              case 6:
                return _context4.abrupt("return", true);

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](0);

                if (!(_context4.t0.code === Aerospike.status.ERR_RECORD_NOT_FOUND)) {
                  _context4.next = 13;
                  break;
                }

                return _context4.abrupt("return", true);

              case 13:
                throw _context4.t0;

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 9]]);
      }));

      function _delete(_x5) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "flush",
    value: function () {
      var _flush = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5() {
        var client, scan, recordCount, stream;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.asClient();

              case 2:
                client = _context5.sent;
                _context5.next = 5;
                return client.scan(this.namespace, this.set);

              case 5:
                scan = _context5.sent;
                scan.concurrent = true;
                scan.nobins = true;
                recordCount = 0;
                stream = scan.foreach();
                stream.on('data', function (record) {
                  client.remove(record.key.digest);
                  recordCount++;

                  if (recordCount % 1000 === 0) {
                    console.log('%d records deleted', recordCount);
                  }
                });
                stream.on('error', function (error) {
                  console.error('Error while deleting: %s [%d]', error.message, error.code);
                });
                stream.on('end', function () {
                  console.log('Total records deleted: %d', recordCount);
                });

              case 13:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function flush() {
        return _flush.apply(this, arguments);
      }

      return flush;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.client.close();

              case 2:
                return _context6.abrupt("return");

              case 3:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
  }]);
  return ApolloCacheAerospike;
}();

module.exports = ApolloCacheAerospike;