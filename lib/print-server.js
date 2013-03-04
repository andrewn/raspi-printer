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
var timerId = null;

PrintServer.prototype.printerType = null;
PrintServer.prototype.printUrl = null;
PrintServer.prototype.pollingIntervalInSecs = 10;

PrintServer.prototype.isPolling = function () {
  return !!timerId;
}

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

  req = http.get(options, function (response) {
    var data = "";

    response.on('data', function (chunk) {
      data += chunk;
    });
    
    response.on('end', function () {
      self.emit('polled');

      if (response.statusCode === 200) {
        if (self.responseHasDocument(response)) {
          self.emit('documentReceived', data);
        }
      } else {
        self.emit('requestFailed');
      }
      
    });
  });
  req.on('error', function (err) {
    throw err;
  });
}

PrintServer.prototype.responseHasDocument = function (response) {
  return !!response.headers['content-length'] && (response.headers['content-length'] > 0);
}

PrintServer.prototype.startPolling = function () {
  timerId = setInterval(this.poll.bind(this), this.pollingIntervalInSecs * 1000)
}

PrintServer.prototype.stopPolling = function () {
  clearInterval(timerId);
  timerId = null;
}


exports.PrintServer = PrintServer;