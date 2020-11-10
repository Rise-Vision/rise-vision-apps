"use strict";

describe("directive: purchase summary", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", {
      purchase: {
        plan: {},
        estimate: {}
      },
      showTaxExemptionModal: sinon.stub().returns(Q.resolve()),
      getEstimate: sinon.stub().returns(Q.resolve())
    });
    $provide.value("userState", {
      getCopyOfSelectedCompany: function() {
        return "selectedCompany";
      },
      isSubcompanySelected: function() {
        return "isSelected";
      }
    });
  }));

  var $scope, element, purchaseFactory;

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    purchaseFactory = $injector.get("purchaseFactory");

    $templateCache.put("partials/purchase/checkout-purchase-summary.html", "<p>mock</p>");
    $scope = $rootScope.$new();

    element = $compile("<purchase-summary></purchase-summary>")($scope);
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should exist", function() {
    expect($scope.purchase).to.be.an("object");
    expect($scope.selectedCompany).to.equal("selectedCompany");
    expect($scope.isSubcompanySelected).to.equal("isSelected");

    expect($scope.getAdditionalDisplaysPrice).to.be.a("function");
    expect($scope.applyCouponCode).to.be.a("function");
    expect($scope.clearCouponCode).to.be.a("function");
    expect($scope.showTaxExemptionModal).to.be.a("function");
  });

  describe("getAdditionalDisplaysPrice: ", function() {
    it("should return monthly price based on license number", function() {
      $scope.purchase.plan = {
        isMonthly: true,
        monthly: {
          priceDisplayMonth: 30
        },
        additionalDisplayLicenses: 2
      };

      expect($scope.getAdditionalDisplaysPrice()).to.equal(60);
    });

    it("should return yearly price based on license number", function() {
      $scope.purchase.plan = {
        isMonthly: false,
        yearly: {
          priceDisplayYear: 100
        },
        additionalDisplayLicenses: 2
      };

      expect($scope.getAdditionalDisplaysPrice()).to.equal(200);
    });
  });

  describe("applyCouponCode: ", function() {
    it("should not get estimate if coupon code is blank", function() {
      $scope.applyCouponCode();

      purchaseFactory.getEstimate.should.not.have.been.called;
    });

    it("should get estimate", function() {
      $scope.purchase.couponCode = "someCoupon";

      $scope.applyCouponCode();

      purchaseFactory.getEstimate.should.have.been.calledOnce;
    });

    it("should hide coupon form if an error is not returned", function(done) {
      $scope.addCoupon = true;
      $scope.purchase.couponCode = "someCoupon";

      $scope.applyCouponCode();

      setTimeout(function() {
        expect($scope.addCoupon).to.be.false;

        done();
      });
    });

    it("should not hide coupon form on error", function(done) {
      $scope.addCoupon = true;
      $scope.purchase.couponCode = "someCoupon";
      $scope.purchase.estimate.estimateError = "someError";

      $scope.applyCouponCode();

      setTimeout(function() {
        expect($scope.addCoupon).to.be.true;

        done();
      });
    });
  });

  describe("clearCouponCode: ", function() {
    it("should clear coupon code and hide form", function() {
      $scope.addCoupon = true;
      $scope.purchase.couponCode = "someCoupon";

      $scope.clearCouponCode();

      expect($scope.addCoupon).to.be.false;
      expect($scope.purchase.couponCode).to.not.be.ok;

      purchaseFactory.getEstimate.should.not.have.been.called;
    });

    it("should refresh estimate on estimate error", function() {
      $scope.purchase.estimate.estimateError = "someError";

      $scope.clearCouponCode();

      purchaseFactory.getEstimate.should.have.been.calledOnce;
    });
  });

  describe("showTaxExemptionModal: ", function() {
    it("should open tax exemption modal", function() {
      $scope.showTaxExemptionModal();

      purchaseFactory.showTaxExemptionModal.should.have.been.called;
    });

    it("should refresh estimate if tax exemption was submitted", function(done) {
      $scope.purchase.taxExemptionSent = true;
      $scope.showTaxExemptionModal();

      setTimeout(function() {
        purchaseFactory.getEstimate.should.have.been.calledOnce;

        done();        
      }, 10);
    });

    it("should open tax exemption modal", function(done) {
      $scope.purchase.taxExemptionSent = false;
      $scope.showTaxExemptionModal();

      setTimeout(function() {
        purchaseFactory.getEstimate.should.not.have.been.called;

        done();        
      }, 10);
    });
  });

});
