"use strict";

describe("directive: plan picker", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", purchaseFactory = {
      purchase: {
        plan: {
          displays: 5,
          isMonthly: false
        }
      },
      pickVolumePlan: sinon.stub(),
      pickUnlimitedPlan: sinon.stub()
    });
    $provide.value("userState", {
      isDiscountCustomer: sinon.stub().returns(true),
      isK12Customer: sinon.stub().returns(true)
    });
    $provide.value("plansService",  plansService = {
      getUnlimitedPlan: sinon.stub().returns({
        yearly: {
          billAmount: 999
        }
      })
    });
    $provide.value("pricingFactory",  pricingFactory = {
      getTotalPrice: sinon.stub().returns(495),
      getBasePricePerDisplay: sinon.stub().returns(10),
      getPricePerDisplay: sinon.stub().returns(8.25)
    });
  }));

  var $scope, element, purchaseFactory, plansService, pricingFactory;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put("partials/purchase/checkout-plan-picker.html", "<p>mock</p>");
    $scope = $rootScope.$new();
    $scope.setNextStep = sinon.stub();

    element = $compile("<plan-picker></plan-picker>")($scope);
    $scope.$digest();
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should exist", function() {
    expect($scope.sliderOptions).to.be.an("object");
    expect($scope.displayCount).to.equal(5);
    expect($scope.periodMonthly).to.be.false;
    expect($scope.applyDiscount).to.be.true;
    expect($scope.canAccessUnlimitedPlan).to.be.true;
    expect($scope.isUnlimitedPlan).to.be.false;

    expect($scope.updatePlan).to.be.a("function");

    //calculation
    expect($scope.basePricePerDisplay).to.equal(10);
    expect($scope.pricePerDisplay).to.equal(8.25);
    expect($scope.totalPrice).to.equal(495);
    expect($scope.yearlySavings).to.equal(105);
  });

  describe("updatePlan:", function() {
    describe("volume plan:", function() {
      it("should update plan in factory and move to next step", function() {
        $scope.updatePlan();
  
        purchaseFactory.pickVolumePlan.should.have.been.calledWith($scope.displayCount, $scope.periodMonthly, $scope.totalPrice);
        $scope.setNextStep.should.have.been.called;
      });
  
      it("should not update plan id display count is invalid", function() {
        $scope.displayCount = 0;
  
        $scope.updatePlan();
  
        purchaseFactory.pickVolumePlan.should.not.have.been.called;
        $scope.setNextStep.should.not.have.been.called;
      });
    });

    describe("unlimited plan:", function() {
      beforeEach(function() {
        $scope.isUnlimitedPlan = true;
      });
      it("should update plan in factory and move to next step", function() {
        $scope.updatePlan();
  
        purchaseFactory.pickUnlimitedPlan.should.have.been.called;        
        $scope.setNextStep.should.have.been.called;        
      });
    });    
  });

  describe('isUnlimitedPlan:', function() {
    it("should calculate totalPrice when switching to unlimited plan", function() {
      $scope.isUnlimitedPlan = true;
      $scope.$digest();

      expect($scope.totalPrice).to.equal(999);
      plansService.getUnlimitedPlan.should.have.been.called;
    });

    it("should calculate totalPrice when switching to volume plan", function() {
      $scope.displayCount = 1;
      $scope.isUnlimitedPlan = false;

      $scope.$digest();

      expect($scope.totalPrice).to.equal(495);
    });
  });

  describe("watchGroup:", function() {
    it("should update calculation when displayCount changes", function() {
      pricingFactory.getBasePricePerDisplay.returns(11);
      pricingFactory.getPricePerDisplay.returns(9.08);
      pricingFactory.getTotalPrice.returns(108.9);

      $scope.displayCount = 1;

      $scope.$digest();

      expect($scope.basePricePerDisplay).to.equal(11);
      expect($scope.pricePerDisplay).to.equal(9.08);
      expect($scope.totalPrice).to.equal(108.9);
      expect($scope.yearlySavings).to.be.closeTo(23.09,0.01);
    });

    it("should update calculation when periodMonthly changes", function() {
      pricingFactory.getBasePricePerDisplay.returns(10);
      pricingFactory.getPricePerDisplay.returns(9);
      pricingFactory.getTotalPrice.returns(45);

      $scope.periodMonthly = true;

      $scope.$digest();

      expect($scope.basePricePerDisplay).to.equal(10);
      expect($scope.pricePerDisplay).to.equal(9);
      expect($scope.totalPrice).to.equal(45);
    });

    it("should not update if displayCount is 0", function() {
      $scope.basePricePerDisplay = 5;
      $scope.pricePerDisplay = 5;
      $scope.totalPrice = 5;

      $scope.displayCount = 0;

      $scope.$digest();

      expect($scope.basePricePerDisplay).to.equal(5);
      expect($scope.pricePerDisplay).to.equal(5);
      expect($scope.totalPrice).to.equal(5);
    });

  });

});
