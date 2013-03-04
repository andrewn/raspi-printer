var events = require("events"),
    util   = require("util"),
    things = require("gpio-tests");

var Ui = function () {
  var self = this;
  self.led = new things.LED(7);
  self.messagesWaiting = false;

  self.button = new things.Button(3);
  self.button.ready()
             .then(
		function () {
		  self.button.on('released', function () {
                    console.log('button is released');
                    self.emit('buttonPressed');
                  });
                }
	      );
};

util.inherits(Ui, events.EventEmitter);

Ui.prototype.flash = function () {
  var self = this;
  self.led.on()
          .then( function () { return things.wait(1000); } )
          .then( function () { return self.led.off(); })
          .then( function () { return things.wait(1000); } )
          .then( function () { self.flash(); });
}

Ui.prototype.showMessagesWaiting = function () {
  console.log('waiting...');
  var self = this;
  this.led.ready()
          .then( function () { self.flash() });
};

Ui.prototype.stopMessagesWaiting = function () {
  console.log('clear waiting...');
};

exports.Ui = Ui;
