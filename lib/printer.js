var events     = require("events"),
    util       = require("util"),
    Q          = require("q"),
    SerialPort = require("serialport").SerialPort;

var Printer = function (port) {
  this.port = port;
  this.baud = 19200;
  this.serial = null;
  this.isOpen = false;
};

util.inherits(Printer, events.EventEmitter);

// To allow injection of other API-compatible library
Printer.SerialPort = SerialPort;

Printer.prototype.setup = function (doc) {
  var self = this,
      deferred = Q.defer();

  if (self.isOpen) {
    console.log("Serial port already created, resolve promise", self.serial, deferred)
    deferred.resolve();
  } else {
    console.log("No serial, create new", self.port, self.baud)
    if (!self.serial) {
      self.serial = new Printer.SerialPort(self.port, { baudrate: self.baud });
    }
    self.serial.on("open", function () {
      console.log("Serial open even, resolve promise", self.serial, deferred);
      self.isOpen = true;
      deferred.resolve();
    });
  }

  return deferred.promise;
}

Printer.prototype.print = function (doc) {

  if (!doc) { throw Error("No document to print"); }

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
  console.log('serialport.write', doc.length, self.serial);
  self.serial.write(doc);
}


exports.Printer = Printer;
