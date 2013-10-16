/* globals require, exports, process */

var events = require("events"),
    util   = require("util"),
    things = require("./things");

var Ui = function (deps) {
  var self = this,
      deps = deps || {};

  self.logger = deps.logger;
  self.led_left = new things.LED(7);
  self.led_right = new things.LED(11);

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
  self.led_left.startFlashing();
  self.led_right.startFlashing();
  self.playSound();
};

Ui.prototype.stopMessagesWaiting = function () {
  this.logger.info('clear waiting...');
  this.led_left.stopFlashing();
  this.led_right.stopFlashing();
};

Ui.prototype.playSound = function () {
  var sound = require('path').join(process.cwd(), "data", "new-message.mp3"),
      cmd   = "mpg123 -g 70 " + sound;
  this.logger.info("Playing: " + cmd);
  require('child_process').exec(cmd);
};

exports.Ui = Ui;
