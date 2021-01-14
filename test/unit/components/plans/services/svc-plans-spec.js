/*jshint expr:true */
"use strict";

describe("Services: plans service", function() {

  beforeEach(module("risevision.common.components.plans"));
  beforeEach(module(function ($provide) {
  }));

  var plansService, PLANS_LIST;

  beforeEach(function() {
    inject(function($injector) {
      plansService = $injector.get("plansService");
      PLANS_LIST = $injector.get("PLANS_LIST");
    });
  });

  it("should exist", function() {
    expect(plansService).to.be.ok;
    expect(plansService.getPlan).to.be.a('function');
    expect(plansService.getFreePlan).to.be.a('function');
    expect(plansService.getVolumePlan).to.be.a('function');
    expect(plansService.isVolumePlan).to.be.a('function');
  });

  describe("getPlan:", function() {
    it('should get plan by productCode', function() {
      expect(plansService.getPlan(PLANS_LIST[0].productCode)).to.equal(PLANS_LIST[0]);
    });

    it('should handle failure to get plan', function() {
      expect(plansService.getPlan('productCode')).to.not.be.ok;
    });
  });

  it("getFreePlan:", function() {
    expect(plansService.getFreePlan().type).to.equal('free');
  });

  it("getVolumePlan:", function() {
    expect(plansService.getVolumePlan().type).to.equal('volume');
  });

  describe("isVolumePlan:", function(){
    it('should detect volume plan from the type', function() {
      expect(plansService.isVolumePlan(plansService.getVolumePlan())).to.be.true;

      expect(plansService.isVolumePlan({
        type: 'some volume plan'
      })).to.be.true;

      expect(plansService.isVolumePlan({
        type: 'some other plan'
      })).to.be.false;

      expect(plansService.isVolumePlan()).to.not.be.ok;
    });
  });


});
