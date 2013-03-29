/* globals require, exports */

var events = require("events"),
    util   = require("util"),
    things = require("./things");

var Ui = function (deps) {
  var self = this,
      deps = deps || {};

  self.logger = deps.logger;
  self.led = new things.LED(7);

  self.button = new things.Button(3);
  self.button.ready()
             .then(
		function () {
      self.button.on('released', function () {
                    self.logger.info('button is released');
                    self.emit('buttonPressed');
                  });
                }
        );
};

util.inherits(Ui, events.EventEmitter);

Ui.prototype.showMessagesWaiting = function () {
  var self = this;
  self.logger.info('waiting...');
  self.led.startFlashing();
};

Ui.prototype.stopMessagesWaiting = function () {
  this.logger.info('clear waiting...');
  this.led.stopFlashing();
};

exports.Ui = Ui;
