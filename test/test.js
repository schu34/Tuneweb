var assert = require("assert")
var utils = require("../client/js/utils.js")



describe("#TitleCase()", function(){
  it("capitalizes one  word", function(){
    assert.equal(utils.titleCase("matt"), "Matt");
  })
  it("capitalizes multiple words", function(){
    assert.equal(utils.titleCase("matthew schupack"), "Matthew Schupack")
  })
  it("lowercases everything else", function(){
    assert.equal(utils.titleCase("hELlO WoRlD"), "Hello World")
  })
});
