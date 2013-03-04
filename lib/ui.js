var events = require("events"),
    util   = require("util"),
    things = require("gpio-tests");

var Ui = function () {
  this.led = new things.LED(7);
  this.messagesWaiting = false;
};

util.inherits(Ui, events.EventEmitter);

function flash() {
  var self = this;
  self.led.on()
          .then( function () { return things.wait(1000); } )
          .then( function () { return self.led.off(); })
          .then( function () { return things.wait(1000); } )
          .then( function () { flash(); });
}

Ui.prototype.showMessagesWaiting = function () {
  console.log('waiting...');
  this.led.ready()
          .then( function () { flash() });
};

Ui.prototype.stopMessagesWaiting = function () {
  console.log('clear waiting...');
};

exports.Ui = Ui;