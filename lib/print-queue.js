var events = require("events"),
    util   = require("util");

var PrintQueue = function (deps) {
  var deps = deps || {};
  this.items = [];
  this.logger = deps.logger;
}

util.inherits(PrintQueue, events.EventEmitter);

PrintQueue.prototype.enqueue = function (item) {
  this.items.push(item);
}

PrintQueue.prototype.dequeue = function () {
  return this.items.shift();
}

PrintQueue.prototype.hasItems = function (item) {
  return this.items.length > 0;
}

exports.PrintQueue = PrintQueue
