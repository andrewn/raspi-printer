var events     = require("events"),
    util       = require("util"),
    Q          = require("q"),
    SerialPort = require("serialport");

var Printer = function (port) {
  this.port = port;
  this.baud = 19200;
  this.serialport = null;
};

util.inherits(Printer, events.EventEmitter);

// To allow injection of other API-compatible library
Printer.SerialPort = SerialPort;

Printer.prototype.setup = function (doc) {
  var self = this,
      deferred = Q.defer();

  if (self.serialport) {
    console.log("serial port already created, resolve promise", self.serialport, deferred)
    deferred.resolve();
  } else {
    console.log("no serial, create new", self.port)
    self.serialport = new SerialPort(self.port, { baudrate: self.baud });
    self.serialport.on("open", function () {
      console.log("serial open even, resolve promise", self.serialport, deferred)
      deferred.resolve();
    });
  }

  return deferred.promise;
}

Printer.prototype.print = function (doc) {
  var self     = this,
      deferred = Q.defer();

  console.log("print", doc.length)

  self.setup()
      .then(
        function () {
          console.log("setup done, calling writeSerial", doc.length)
          self.writeSerial(doc);
          deferred.resolve();
        });

  return deferred.promise;
}

Printer.prototype.writeSerial = function (doc) {
  var self = this;
  console.log('serialport.write', doc.length, self.serialport);
  self.serialport.write(doc);
}


exports.Printer = Printer;
