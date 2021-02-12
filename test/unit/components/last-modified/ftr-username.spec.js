"use strict";

describe("filter: username", function() {
  beforeEach(module("risevision.common.components.last-modified"));
  var username;
  beforeEach(function(){
    inject(function($filter){
      username = $filter("username");
    });
  });

  it("should exist",function(){
    expect(username).to.be.truely;
  });

  it("should remove domain from email",function(){
    expect(username("some.email@gmail.com")).to.equal("some.email");
  });
    
  it("should return string if it is not an email",function() {
    expect(username("some-string")).to.equal("some-string");
  });

});
