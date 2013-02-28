assert = require("chai").assert
sinon  = require("sinon")
nock   = require("nock")

URL = require("url")

print = require("../lib/print-server.js")

describe "PrintServer", ->

  describe "creation", ->
    it "should be configured for a particular URL", ->
      ps = new print.PrintServer('http://fake.com/abc123', 'A2-TYPE')
      assert.equal(URL.format(ps.printUrl), 'http://fake.com/abc123')

    it "requires a print server", ->
      createNewServerWithError = () -> 
        new print.PrintServer()
      assert.throw(createNewServerWithError)

  describe "polling", ->

    beforeEach ->
      this.ps = new print.PrintServer('http://fake.com/abc123', 'printer-type')
      this.clock = sinon.useFakeTimers()

    afterEach ->
      this.ps = null
      this.clock.restore()

    it "should have a default poll interval", ->
      assert.equal(this.ps.pollingIntervalInSecs, 10)

    it "should start polling", ->
      assert.isFalse this.ps.isPolling()
      this.ps.startPolling()
      assert.isTrue  this.ps.isPolling()

    it "should poll according to interval", (done) ->
      server = nock('http://fake.com').get('/abc123').reply(200)
      hasPolledFired = false
      this.ps.on('polled', () -> 
        assert(true, "event should have fired")
        done()
      )
      this.ps.startPolling()
      this.clock.tick(9999)
      assert.isFalse(hasPolledFired, "event should not have fired")
      this.clock.tick(1)

    it "should HTTP GET server", ->
      server = nock('http://fake.com').get('/abc123').reply(200)
      this.ps.poll()
      server.done()

  describe "checking for documents", ->
    it "should identify itself", ->
      server = nock('http://fake.com')
                .get('/abc123')
                .matchHeader('Accept', 'application/vnd.freerange.printer.A2-raw')
                .reply(200)

      ps = new print.PrintServer('http://fake.com/abc123', 'A2-raw')
      ps.poll()
      server.done()