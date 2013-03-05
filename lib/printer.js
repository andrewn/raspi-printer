var events     = require("events"),
    util       = require("util"),
    Q          = require("q"),
    SerialPort = require("serialport");

var Printer = function (port) {
  this.port = port;
  this.baud = 57600;
  this.serial = null;
};

util.inherits(Printer, events.EventEmitter);

// To allow injection of other API-compatible library
Printer.SerialPort = SerialPort;

Printer.prototype.setup = function (doc) {
  var self = this,
      deferred = Q.defer();

  if (self.serial) {
    deferred.resolve();
  } else {
    self.serial = new SerialPort(self.port, { baudrate: self.baud });
  }

  self.serial.on("open", function () {
    deferred.resolve();
  });

  return deferred.promise;
}

Printer.prototype.print = function (doc) {
  var self     = this,
      deferred = Q.defer();

  self.setup()
      .then(
        function () {
          self.writeSerial(doc);
          deferred.resolve();
        });

  return deferred.promise;
}

Printer.prototype.writeSerial = function (doc) {
  var self = this;
  console.log('serialport.write');
  self.serialport.write(doc);
}


exports.Printer = Printer;
