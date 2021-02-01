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
      updatePlan: sinon.stub()
    });
    $provide.value("userState", {
      isDiscountCustomer: sinon.stub().returns(true)
    });
  }));

  var $scope, element, purchaseFactory;

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

    expect($scope.updatePlan).to.be.a("function");

    //calculation
    expect($scope.basePricePerDisplay).to.equal(10);
    expect($scope.pricePerDisplay).to.equal(8.25);
    expect($scope.totalPrice).to.equal(495);
    expect($scope.yearlySavings).to.equal(105);
  });

  describe("updatePlan:", function() {
    it("should update plan in factory and move to next step", function() {
      $scope.updatePlan();

      purchaseFactory.updatePlan.should.have.been.calledWith($scope.displayCount, $scope.periodMonthly, $scope.totalPrice);
      $scope.setNextStep.should.have.been.called;
    });

    it("should not update plan id display count is invalid", function() {
      $scope.displayCount = 0;

      $scope.updatePlan();

      purchaseFactory.updatePlan.should.not.have.been.called;
      $scope.setNextStep.should.not.have.been.called;
    });
  });

  describe("watchGroup:", function() {
    it("should update calculation when displayCount changes", function() {
      $scope.displayCount = 1;

      $scope.$digest();

      expect($scope.basePricePerDisplay).to.equal(11);
      expect($scope.pricePerDisplay).to.be.closeTo(9.08,0.01);
      expect($scope.totalPrice).to.equal(108.9);
      expect($scope.yearlySavings).to.be.closeTo(23.09,0.01);
    });

    it("should update calculation when periodMonthly changes", function() {
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
