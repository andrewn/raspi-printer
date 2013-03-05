var events = require("events"),
    util   = require("util");

var PrintQueue = function () {
  this.items = [];
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
