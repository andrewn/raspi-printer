assert = require("chai").assert
sinon  = require("sinon")

Printer = require('../lib/Printer').Printer

describe "Printer", ->
  beforeEach ->
    this.SerialPortMock = sinon.stub()
    Printer.SerialPort = this.SerialPortMock
  
  describe "#init", ->
    it "should allow connecting to a specific serial port", ->
      p = new Printer('/dev/usb.serial-1')
      assert.equal(p.port, '/dev/usb.serial-1', 'Printer not created')
      assert(this.SerialPortMock.calledWith, '/dev/usb.serial-1')

  describe "#setup", ->
    beforeEach ->
      this.printer = new Printer('/dev/usb.serial-1')
      this.printer.serial = sinon.spy()
      this.printer.serial.on = sinon.spy()
      this.printer.serial.write = sinon.spy()

    it "should wait until port is open", ->
      assert.isFalse this.printer.isOpen, "is not open"
      this.printer.setup()
      assert.isTrue this.printer.serial.on.calledWith('open'), "open handler not called"

    it "should return a promise", ->
      assert.isFunction this.printer.setup().then

  describe "#print", ->
    it "should return a promise", ->
      assert.isFunction this.printer.print("A document").then

  # describe "#writeSerial", ->
  #   it "should send document down the serial port", () ->
  #     this.printer.writeSerial("a document")
  #     assert.isTrue this.printer.serial.write.calledWith("a document")
