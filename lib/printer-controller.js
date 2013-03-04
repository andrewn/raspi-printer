
PrintQueue  = require("../lib/print-queue").PrintQueue
PrintServer = require("../lib/print-server.js").PrintServer
PrinterId   = require("../lib/printer-id.js").PrinterId
Printer     = require("../lib/printer.js").Printer
Ui          = require("../lib/ui").Ui

var config = {
  type   : 'A2-raw',
  server : 'http://printer.gofreerange.com:80/printer/' + PrinterId.get()
};

var printServer = new PrintServer(config.server, config.type);
var printQueue  = new PrintQueue();
var printer     = new Printer('/dev/ttyAMA0');
var ui          = new Ui();

console.log('Server: ', config.server)

printServer.on('documentReceived', 
  function (doc) {
    console.log('doc received');
    printQueue.enqueue(doc);
    ui.showMessagesWaiting();
  }
);

printServer.on('polled', function () {
  console.log('polled');
});

ui.on('buttonPress', function () {
  if (printQueue.hasItems()) {
    printer.print(printQueue.dequeue());
  }
});

printServer.startPolling()
