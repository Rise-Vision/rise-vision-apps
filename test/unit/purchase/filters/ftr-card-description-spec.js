"use strict";

describe("filter: cardDescription", function() {
  beforeEach(module("risevision.apps.purchase"));
  var cardDescription;
  beforeEach(function(){
    inject(function($filter){
      cardDescription = $filter("cardDescription");
    });
  });

  it("should exist",function(){
    expect(cardDescription).to.be.ok;
  });

  it("should deal with null values", function() {
    expect(cardDescription()).to.equal("");
  });

  it("should deal with empty values", function() {
    expect(cardDescription({})).to.equal("Credit Card ending in ****");
  });

  it("should deal card brand", function() {
    expect(cardDescription({
      brand: 'visa'
    })).to.equal("Visa ending in ****");
  });

  it("should deal with last4", function() {
    expect(cardDescription({
      last4: '4242'
    })).to.equal("Credit Card ending in 4242");
  });

});
