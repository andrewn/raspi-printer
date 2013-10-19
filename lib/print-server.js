/* global require, setInterval, clearInterval, exports, Buffer */

var events = require("events"),
    util   = require("util"),
    URL    = require("url"),
    http   = require("http");

var PrintServer = function(url, printerType, config) {
  if (!url) { throw Error('Print Server URL required'); }
  if (!printerType) { throw Error('Printer type is required'); }
  var config = config || {};

  if (config.pollingIntervalInSecs) {
    this.pollingIntervalInSecs = config.pollingIntervalInSecs;
  }

  this.printUrl = URL.parse(url);
  this.printerType = printerType;
  this.logger = config.logger;
};

util.inherits(PrintServer, events.EventEmitter);

// Private
var timerId = null;

PrintServer.prototype.printerType = null;
PrintServer.prototype.printUrl = null;
PrintServer.prototype.pollingIntervalInSecs = 10;

PrintServer.prototype.isPolling = function () {
  return !!timerId;
};

PrintServer.prototype.poll = function () {
  var self = this,
      options = {
        host: this.printUrl.hostname,
        port: this.printUrl.port,
        path: this.printUrl.pathname,
        headers: {
          'Accept': 'application/vnd.freerange.printer.' + self.printerType
        }
      },
      req;

  if (self.logger) { self.logger.debug('PrintServer.poll'); }

  req = http.get(options, function (response) {
    var data = "";
    response.setEncoding('binary');
    response.on('data', function (chunk) {
      data += chunk;
    });

    response.on('end', function () {
      self.emit('polled');

      if (response.statusCode === 200) {
        if (self.responseHasDocument(response)) {
          var buffer = new Buffer(data, 'binary');
          //debugger;
          self.emit('documentReceived', buffer);
        }
      } else {
        self.emit('requestFailed');
      }

    });
  });
  req.on('error', function (err) {
    console.error(err);
    //throw err;
  });
};

PrintServer.prototype.responseHasDocument = function (response) {
  var hasDoc = !!response.headers['content-length'] && (response.headers['content-length'] > 0);
  return hasDoc;
};

PrintServer.prototype.startPolling = function () {
  timerId = setInterval(this.poll.bind(this), this.pollingIntervalInSecs * 1000);
};

PrintServer.prototype.stopPolling = function () {
  clearInterval(timerId);
  timerId = null;
};


exports.PrintServer = PrintServer;
