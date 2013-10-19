/* globals exports */

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
      self.logger.log('there are items to print');
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
