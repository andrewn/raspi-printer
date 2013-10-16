/* globals require, exports, setTimeout, process */

var gpio   = require("pi-gpio"),
    Q      = require('q'),
    events = require("events");

/*
  Implement a timeout as a deferred
*/
function wait(ms) {
  var deferred = Q.defer();
  setTimeout(function () {
    deferred.resolve();
  }, ms);
  return deferred.promise;
}

var LED = function (pin) {
  this.pin = pin;
  this.isOpen = false;
  this.shouldFlashConstantly = false;

  // Just in case something has this open already
  gpio.close(pin);
};

LED.prototype.ready = function () {
  var self = this,
      deferred = Q.defer();
  if (self.isOpen) {
    deferred.resolve();
  } else {
    gpio.open(self.pin, 'output', function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        self.isOpen = true;
        deferred.resolve();
      }
    });
  }
  return deferred.promise;
};

LED.prototype.on = function () {
  var deferred = Q.defer(),
      self = this;
  this.ready().then(function () {
    gpio.write(self.pin, 1, function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });
  });
  return deferred.promise;
};

LED.prototype.off = function () {
  var deferred = Q.defer(),
      self = this;
  this.ready().then(function () {
    gpio.write(self.pin, 0, function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });
  });
  return deferred.promise;
};

LED.prototype.startFlashing = function () {
  if (this.shouldFlashConstantly) { return; }
  this.shouldFlashConstantly = true;
  this.flash();
};

LED.prototype.stopFlashing = function () {
  this.shouldFlashConstantly = false;
};

LED.prototype.flash = function () {
  var self = this;
  self.on()
      .then( function () { return wait(1000); } )
      .then( function () { return self.off(); })
      .then( function () { return wait(1000); } )
      .then( function () { if (self.shouldFlashConstantly) { self.flash(); } } );
};

var Button = function (pin) {
  this.pin = pin;

  // initially, we don't know whether the button
  // was pressed or not
  this.wasPressed = null;

  // Just in case something has this open already
  gpio.close(pin);
};

Button.prototype = events.EventEmitter.prototype;

Button.prototype.isPressedValue = 0;

Button.prototype.ready = function () {
  var deferred = Q.defer(),
      self = this;
  gpio.open(this.pin, 'input', function (err) {
    if (err) {
      deferred.reject(err);
    } else {
      self.pollButtonState();
      deferred.resolve();
    }
  });
  return deferred.promise;
};

Button.prototype.pollButtonState = function() {
  var self = this;
  self.isPressed()
      .then(function (isPressed) {
        // Initially, set the previous state to the inverse of the
        // current state to force event firing
        if (self.wasPressed === null) { self.wasPressed = !isPressed; }

        if (isPressed && !self.wasPressed) {
          self.emit('pressed');
        } else if (!isPressed && self.wasPressed) {
          self.emit('released');
        }

        self.wasPressed = isPressed;
      });
  process.setImmediate(self.pollButtonState.bind(self));
};

Button.prototype.isPressed = function () {
  var deferred = Q.defer(),
      self = this;
  gpio.read(this.pin, function (err, value) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(value === self.isPressedValue);
    }
  });
  return deferred.promise;
};

exports.LED    = LED;
exports.Button = Button;
exports.wait   = wait;
