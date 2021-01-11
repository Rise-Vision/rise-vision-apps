/*jshint expr:true */
"use strict";

describe("Services: pricing factory", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
  }));

  var pricingFactory;

  beforeEach(function() {
    inject(function($injector) {
      pricingFactory = $injector.get("pricingFactory");
    });
  });

  it("should exist", function() {
    expect(pricingFactory).to.be.ok;
    expect(pricingFactory.getBasePricePerDisplay).to.be.a("function");
    expect(pricingFactory.getPricePerDisplay).to.be.a("function");
    expect(pricingFactory.getTotalPrice).to.be.a("function");
  });

  describe('getBasePricePerDisplay:', function() {
    it('should get monthly price based on display count', function() {
      expect(pricingFactory.getBasePricePerDisplay(1)).to.equal(11);
      expect(pricingFactory.getBasePricePerDisplay(4)).to.equal(10);
      expect(pricingFactory.getBasePricePerDisplay(15)).to.equal(9);
      expect(pricingFactory.getBasePricePerDisplay(90)).to.equal(8);
    });
  });

  describe('getPricePerDisplay:', function() {
    it('should get monthly prices', function() {
      expect(pricingFactory.getPricePerDisplay(true, 1)).to.equal(11);
      expect(pricingFactory.getPricePerDisplay(true, 4)).to.equal(10);
      expect(pricingFactory.getPricePerDisplay(true, 15)).to.equal(9);
      expect(pricingFactory.getPricePerDisplay(true, 90)).to.equal(8);      
    });

    it('should get yearly prices', function() {
      expect(pricingFactory.getPricePerDisplay(false, 1)).to.be.closeTo(10.08, 0.01);
      expect(pricingFactory.getPricePerDisplay(false, 4)).to.be.closeTo(9.16, 0.01);
      expect(pricingFactory.getPricePerDisplay(false, 15)).to.be.closeTo(8.25, 0.01);
      expect(pricingFactory.getPricePerDisplay(false, 90)).to.be.closeTo(7.33, 0.01);
    });

    it('should apply education discount', function() {
      expect(pricingFactory.getPricePerDisplay(true, 1, true)).to.equal(9.9);
      expect(pricingFactory.getPricePerDisplay(false, 4, true)).to.equal(8.25);
    });

  });

  describe('getTotalPrice:', function() {
    it('should get monthly prices', function() {
      expect(pricingFactory.getTotalPrice(true, 1)).to.equal(11);
      expect(pricingFactory.getTotalPrice(true, 4)).to.equal(40);
      expect(pricingFactory.getTotalPrice(true, 15)).to.equal(135);
      expect(pricingFactory.getTotalPrice(true, 90)).to.equal(720);      
    });

    it('should get yearly prices', function() {
      expect(pricingFactory.getTotalPrice(false, 1)).to.equal(121);
      expect(pricingFactory.getTotalPrice(false, 4)).to.equal(440);
      expect(pricingFactory.getTotalPrice(false, 15)).to.equal(1485);
      expect(pricingFactory.getTotalPrice(false, 90)).to.equal(7920);
    });

    it('should apply education discount', function() {
      expect(pricingFactory.getTotalPrice(true, 1, true)).to.equal(9.9);
      expect(pricingFactory.getTotalPrice(false, 4, true)).to.equal(396);
    });
  });

});
