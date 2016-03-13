var assert = require("assert")

describe('mocha', function() {
  it('2 + 2 = 4', function() {
    var result = 2 + 2;
    assert(result === 4)
  })

  it('64 / 8 = 8', function() {
    var result = 64 / 8;
    assert(result === 8)
  })
})
