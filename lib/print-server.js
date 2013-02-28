var events = require("events"),
    util   = require("util"),
    URL    = require("url"),
    http   = require("http");

var PrintServer = function(url, printerType) {
  if (!url) { throw Error('Print Server URL required'); }
  if (!printerType) { throw Error('Printer type is required'); }
  this.printUrl = URL.parse(url);
  this.printerType = printerType;
};

util.inherits(PrintServer, events.EventEmitter);

// Private
var isPolling = false,
    timerId   = null;

PrintServer.prototype.printerType = null;
PrintServer.prototype.printUrl = null;
PrintServer.prototype.pollingIntervalInSecs = 10;

PrintServer.prototype.isPolling = function () {
  return isPolling;
}

PrintServer.prototype.poll = function () {
  var self = this,
      options = {
        host: this.printUrl.host,
        path: this.printUrl.pathname,
        headers: {
          'Accept': 'application/vnd.freerange.printer.' + self.printerType
        }
      };

  http.request(options, function (response) {
    response.on('end', function () {
      self.emit('polled');
    });
  }).end();
}

PrintServer.prototype.startPolling = function () {
  isPolling = true;
  timerId = setInterval(this.poll.bind(this), this.pollingIntervalInSecs * 1000)
}

PrintServer.prototype.stopPolling = function () {
  isPolling = false;
}


exports.PrintServer = PrintServer;