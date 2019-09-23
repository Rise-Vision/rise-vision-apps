"use strict";

describe("filter: cardLastFour", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));
  var cardLastFour;
  beforeEach(function(){
    inject(function($filter){
      cardLastFour = $filter("cardLastFour");
    });
  });

  it("should exist",function(){
    expect(cardLastFour).to.be.ok;
  });

  it("should format last 4 digits", function() {
    expect(cardLastFour(4242)).to.equal("***-4242");
  });

  it("should deal with empty values", function() {
    expect(cardLastFour()).to.equal("***-****");
    expect(cardLastFour("")).to.equal("***-****");
  });

  it("should deal with less than 4 characters", function() {
    expect(cardLastFour("4")).to.equal("***-***4");
    expect(cardLastFour("424")).to.equal("***-*424");
  });

  it("should truncate longer strings", function() {
    expect(cardLastFour("4242-4242")).to.equal("***-4242");
  });

});
