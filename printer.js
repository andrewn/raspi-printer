PrintQueue  = require("./lib/print-queue").PrintQueue
PrintServer = require("./lib/print-server.js").PrintServer
PrinterId   = require("./lib/printer-id.js").PrinterId
Printer     = require("./lib/printer.js").Printer
Ui          = require("./lib/ui").Ui

PrinterController = require("./lib/printer-controller.js").PrinterController

config = {
  type   : 'A2-raw',
  server : 'http://printer.gofreerange.com:80/printer/' + PrinterId.get()
}

console.log("Printer URL: ", config.server);

controller = new PrinterController({
                    printServer: new PrintServer(config.server, config.type), 
                    printQueue: new PrintQueue(),
                    ui: new Ui(),
                    printer: new Printer('/dev/ttyAMA0')
                  })
