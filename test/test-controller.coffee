assert = require("chai").assert
sinon  = require("sinon")

events = require("events")

PrinterController = require("../lib/printer-controller").PrinterController

createEventEmitterMock = ->
  mock = on: sinon.spy()
  mock

createEventEmitter = ->
  new events.EventEmitter()

createPrintServerMock = (useRealEventEmitter=false) ->
  mock = createEventEmitter() if useRealEventEmitter
  mock = createEventEmitterMock() unless useRealEventEmitter
  mock.startPolling = sinon.spy()
  mock

createQueueMock = (hasItems=false) ->
  mock = createEventEmitter()
  mock.enqueue = sinon.spy()
  mock.dequeue = sinon.spy()
  mock.hasItems = () -> hasItems
  mock

createUiMock = ->
  mock = createEventEmitterMock()
  mock.showMessagesWaiting = sinon.spy()
  mock

createPrinterMock = ->
  print: sinon.spy()

describe "PrinterController", ->

  beforeEach ->
    this.printServer = createPrintServerMock()
    this.printQueue  = createQueueMock()
    this.ui          = createUiMock()
    this.printer     = createPrinterMock()

    this.controller  = new PrinterController(
                            printServer: this.printServer, 
                            printQueue: this.printQueue,
                            ui: this.ui,
                            printer: this.printer
                          )

  afterEach ->
    this.printServer = null
    this.printQueue  = null
    this.ui          = null
    this.controller  = null

  describe "polling", ->
    it "should start polling", ->
      assert.isTrue(this.printServer.startPolling.called)

  describe "receiving a document", ->
    it "should attach event handler to print server", ->
      assert(this.printServer.on.calledWith('documentReceived'))

    it "should put document in the print queue", ->
      doc = "A document"

      this.printServer = createPrintServerMock(true)
      this.controller  = new PrinterController(
                            printServer: this.printServer, 
                            printQueue: this.printQueue,
                            ui: this.ui
                          )
      this.printServer.emit("documentReceived", doc)

      assert(this.printQueue.enqueue.calledWith(doc))

    it "should put UI into 'message waiting' state", ->
      this.printServer = createPrintServerMock(true)
      this.controller  = new PrinterController(
                            printServer: this.printServer, 
                            printQueue: this.printQueue,
                            ui: this.ui
                          )
      this.printServer.emit("documentReceived", "A document")

      assert(this.ui.showMessagesWaiting.called)

  describe "when the button is pressed", ->
    it "should listen for UI buttonPressed", ->
      assert(this.ui.on.calledWith('buttonPressed'))

    it "and the queue has items it should send to print", ->
      this.ui = createEventEmitter()
      this.printQueue = createQueueMock(true)
      this.controller  = new PrinterController(
                            printServer: this.printServer, 
                            printQueue: this.printQueue,
                            ui: this.ui,
                            printer: this.printer
                          )

      this.ui.emit('buttonPressed')
      assert.isTrue(this.printQueue.dequeue.called, "dequeue not called")
      assert.isTrue(this.printer.print.called, "print not called")

    it "shouldn't send anything if no items", ->
      this.ui = createEventEmitter()
      this.controller  = new PrinterController(
                            printServer: this.printServer, 
                            printQueue: this.printQueue,
                            ui: this.ui,
                            printer: this.printer
                          )

      this.ui.emit('buttonPressed')
      assert.isFalse(this.printQueue.dequeue.called, "dequeue not called")
