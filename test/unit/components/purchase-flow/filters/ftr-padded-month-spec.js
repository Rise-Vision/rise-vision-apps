"use strict";

describe("filter: paddedMonth", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));
  var paddedMonth;
  beforeEach(function(){
    inject(function($filter){
      paddedMonth = $filter("paddedMonth");
    });
  });

  it("should exist",function(){
    expect(paddedMonth).to.be.ok;
  });

  it("should pad month value", function() {
    expect(paddedMonth(1)).to.equal("01");
    expect(paddedMonth(12)).to.equal(12);
  });

});
