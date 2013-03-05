
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

  self.printServer.on('documentReceived', 
    function (doc) {
      self.printQueue.enqueue(doc);
      self.ui.showMessagesWaiting();
    }
  );

  self.ui.on('buttonPressed', function () {
    console.log('controller: button pressed');
    if (self.printQueue.hasItems()) {
      console.log('has items: printed');
      self.printer.print(self.printQueue.dequeue());
    } else {
      console.log('no items :-(');
    }
  });

  self.printServer.on('polled', function () {
    console.log('polled');
  });

  self.printServer.startPolling()
}

exports.PrinterController = PrinterController
