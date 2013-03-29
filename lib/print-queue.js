/* globals require, exports */

var events = require("events"),
    util   = require("util");

var PrintQueue = function (deps) {
  var deps = deps || {};
  this.items = [];
  this.logger = deps.logger;
};

util.inherits(PrintQueue, events.EventEmitter);

PrintQueue.prototype.enqueue = function (item) {
  this.items.push(item);
};

PrintQueue.prototype.dequeue = function () {
  var item = this.items.shift();
  this.logger.info('PrintQueue.dequeue(). Has items? ' +  this.hasItems());
  if (!this.hasItems()) {
    this.emit('emptied');
  }
  return item;
};

PrintQueue.prototype.hasItems = function () {
  return this.items.length > 0;
};

exports.PrintQueue = PrintQueue;
