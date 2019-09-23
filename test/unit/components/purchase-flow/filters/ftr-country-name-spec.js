"use strict";

describe("filter: countryName", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));
  beforeEach(module(function ($provide) {
    $provide.value("COUNTRIES", [
      {
        code: "CA",
        name: "Canada"
      }
    ]);
  }));

  var countryName;
  beforeEach(function(){
    inject(function($filter){
      countryName = $filter("countryName");
    });
  });

  it("should exist",function(){
    expect(countryName).to.be.ok;
  });

  it("should format last 4 digits", function() {
    expect(countryName("CA")).to.equal("Canada");
    expect(countryName("US")).to.equal("US");
  });

});
