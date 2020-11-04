"use strict";

describe("directive: purchase summary", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", purchaseFactory = {
      purchase: {
        plan: {}
      },
      showTaxExemptionModal: sinon.stub().returns(Q.resolve()),
      getEstimate: sinon.stub()
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

  beforeEach(inject(function($compile, $rootScope, $templateCache){
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

  describe("showTaxExemptionModal: ", function() {
    it("should open tax exemption modal", function() {
      $scope.showTaxExemptionModal();

      purchaseFactory.showTaxExemptionModal.should.have.been.called;
    });

    it("should refresh estimate if tax exemption was submitted", function(done) {
      $scope.purchase.taxExemptionSent = true;
      $scope.showTaxExemptionModal();

      setTimeout(function() {
        purchaseFactory.getEstimate.should.have.been.calledTwice;

        done();        
      }, 10);
    });

    it("should open tax exemption modal", function(done) {
      $scope.purchase.taxExemptionSent = false;
      $scope.showTaxExemptionModal();

      setTimeout(function() {
        purchaseFactory.getEstimate.should.have.been.calledOnce;

        done();        
      }, 10);
    });
  });

});
