/* globals exports, require */

var events     = require("events"),
    util       = require("util"),
    Q          = require("q"),
    SerialPort = require("serialport").SerialPort;

var Printer = function (port, opts) {
  var opts = opts || {};
  this.port = port;
  this.baud = 19200;
  this.logger = opts.logger;

  this.serialport = null;
};

util.inherits(Printer, events.EventEmitter);

// To allow injection of other API-compatible library
Printer.SerialPort = SerialPort;

Printer.prototype.setup = function () {
  var self = this,
      deferred = Q.defer();

  if (self.serialport) {
    self.logger.info("serial port already created, resolve promise", self.serialport, deferred);
    deferred.resolve();
  } else {
    self.logger.info("no serial, create new", self.port, self.baud);
    self.serialport = new SerialPort(self.port, { baudrate: self.baud });
    self.serialport.on("open", function () {
      self.logger.info("serial open even, resolve promise", self.serialport, deferred);
      deferred.resolve();
    });
  }

  return deferred.promise;
};

Printer.prototype.print = function (doc) {

  if (!doc) { throw Error("No document to print"); }

  var self     = this,
      deferred = Q.defer();

  self.logger.info("print", doc.length);

  self.setup()
      .then(
        function () {
          self.logger.info("setup done, calling writeSerial", doc.length);
          self.writeSerial(doc);
          deferred.resolve();
        });

  return deferred.promise;
};

Printer.prototype.writeSerial = function (doc) {
  var self = this;
  self.logger.info('serialport.write', doc.length, self.serialport);
  self.serialport.write(doc);
};

exports.Printer = Printer;
