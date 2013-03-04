assert = require("chai").assert
sinon  = require("sinon")

fs = require("fs")

PrinterId = require('../lib/printer-id').PrinterId

describe "PrinterId", ->
  before ->
    this.filePath = "/tmp/PRINTER_ID"
    PrinterId.filePath = this.filePath

  beforeEach ->
      fs.unlinkSync(this.filePath) if fs.existsSync(this.filePath)

  afterEach ->
      fs.unlinkSync(this.filePath) if fs.existsSync(this.filePath)

  describe ".get", ->

    it "should return an instance of PrinterId", ->
      assert.instanceOf PrinterId.get(), PrinterId

    it "should create a new id and save if one doesn't exist", () ->
      assert.isFalse fs.existsSync(this.filePath), "PRINTER_ID file exists"
      pid = PrinterId.get()
      assert.isTrue fs.existsSync(this.filePath), "PRINTER_ID file doesn't exist"
      assert.isDefined pid, "id is not defined"

      assert.equal fs.readFileSync(this.filePath, 'utf8'), pid.id    

  describe "existing ID", ->
    it "should read existing ID from disk", ->
      fs.writeFileSync(this.filePath, "abc1234", "utf8");
      pid = PrinterId.get()
      assert.equal "abc1234", pid.id

  describe "#toString", ->
    it "should return ID", ->
      pid = new PrinterId('abc1234')
      assert.equal "abc1234", pid