/* globals exports */
/*
PrintQueue  = require("../lib/print-queue").PrintQueue
PrintServer = require("../lib/print-server.js").PrintServer
PrinterId   = require("../lib/printer-id.js").PrinterId
Printer     = require("../lib/printer.js").Printer
Ui          = require("../lib/ui").Ui

  new PrintServer(config.server, config.type)
  new PrintQueue();
  new Printer('/dev/ttyAMA0');
  new Ui();

  if (!config) {
    this.config = {
      type   : 'A2-raw',
      server : 'http://printer.gofreerange.com:80/printer/' + PrinterId.get()
    };
  }
*/


var PrinterController = function (deps) {
  var self = this;

  self.printServer = deps.printServer;
  self.printQueue  = deps.printQueue;
  self.printer     = deps.printer; 
  self.ui          = deps.ui;    
  self.logger      = deps.logger;

  self.printServer.on('documentReceived', 
    function (doc) {
      self.printQueue.enqueue(doc);
      self.ui.showMessagesWaiting();
    }
  );

  self.printQueue.on('emptied',
    function () {
      self.ui.stopMessagesWaiting();
    }
  );

  function printItemFromQueue() {
    if (self.printQueue.hasItems()) {
      var item = self.printQueue.dequeue();
      self.printer.print(item)
                  .then(printItemFromQueue);
    }
  }

  self.ui.on('buttonPressed', function () {
    self.logger.log('controller: button pressed');
    if (self.printQueue.hasItems()) {
      printItemFromQueue();
    } else {
      self.logger.log('no items :-(');
    }
  });

  self.printServer.on('polled', function () {
    self.logger.log('polled');
  });

  self.printServer.startPolling();
};

exports.PrinterController = PrinterController;
