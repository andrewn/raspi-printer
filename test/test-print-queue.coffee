assert = require("chai").assert
sinon  = require("sinon")

PrintQueue = require("../lib/print-queue").PrintQueue

describe "PrintQueue", ->
  describe "#init", ->
    it "should create a new empty queue", ->
      q = new PrintQueue()
      assert.isNotNull q
      assert.lengthOf q.items, 0

  describe "#enqueue", ->
    it "should enqueue a document to the queue", ->
      q = new PrintQueue()
      q.enqueue({body: '123'})
      assert.lengthOf q.items, 1
      assert.equal q.items[0].body, '123'

  describe "#dequeue", ->
    it "should return an item and remove from the queue", ->
      item = {body: '1'}
      q = new PrintQueue()
      q.enqueue(item)
      assert.equal q.dequeue(), item
      assert.lengthOf q.items, 0

    it "should be FIFO", ->
      q = new PrintQueue()
      q.enqueue(1)
      q.enqueue(2)
      assert.equal q.dequeue(), 1
      assert.equal q.dequeue(), 2