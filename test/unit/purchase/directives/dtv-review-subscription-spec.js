"use strict";

describe("directive: review subscription", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", {
      purchase: {
        plan: {}
      }
    });
  }));

  var $scope, element;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put("partials/purchase/checkout-review-subscription.html", "<p>mock</p>");
    $scope = $rootScope.$new();
    $scope.plan = {};

    element = $compile("<review-subscription></review-subscription>")($scope);
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should exist", function() {
    expect($scope.plan).to.be.an("object");

    expect($scope.incrementLicenses).to.be.a("function");
    expect($scope.decrementLicenses).to.be.a("function");
    expect($scope.getMonthlyPrice).to.be.a("function");
    expect($scope.getYearlyPrice).to.be.a("function");
  });

  describe("incrementLicenses: ", function() {
    it("should increment licenses", function() {
      $scope.plan.additionalDisplayLicenses = 0;

      $scope.incrementLicenses();

      expect($scope.plan.additionalDisplayLicenses).to.equal(1);      
    });

    it("should handle invalid number entry", function() {
      $scope.plan.additionalDisplayLicenses = "invalid";

      $scope.incrementLicenses();

      expect($scope.plan.additionalDisplayLicenses).to.equal(1);      
    });
  });

  describe("decrementLicenses: ", function() {
    it("should decrement licenses", function() {
      $scope.plan.additionalDisplayLicenses = 2;

      $scope.decrementLicenses();
      expect($scope.plan.additionalDisplayLicenses).to.equal(1);
    });

    it("should stop at 0", function() {
      $scope.plan.additionalDisplayLicenses = 1;

      $scope.decrementLicenses();
      $scope.decrementLicenses();
      expect($scope.plan.additionalDisplayLicenses).to.equal(0);
    });

    it("should handle invalid number entry", function() {
      $scope.plan.additionalDisplayLicenses = "invalid";

      $scope.decrementLicenses();

      expect($scope.plan.additionalDisplayLicenses).to.equal(0);      
    });

  });

  describe("getMonthlyPrice: ", function() {
    it("should return price based on license number", function() {
      $scope.plan = {
        monthly: {
          billAmount: 10,
          priceDisplayMonth: 3
        },
        additionalDisplayLicenses: 2
      };

      expect($scope.getMonthlyPrice()).to.equal(16);
    });

    it("should handle invalid license entry", function() {
      $scope.plan = {
        monthly: {
          billAmount: 10,
          priceDisplayMonth: 3
        },
        additionalDisplayLicenses: "invalid"
      };

      expect($scope.getMonthlyPrice()).to.equal(10);
    });

  });

  describe("getYearlyPrice: ", function() {
    it("should return price based on license number", function() {
      $scope.plan = {
        yearly: {
          billAmount: 100,
          priceDisplayYear: 30
        },
        additionalDisplayLicenses: 2
      };

      expect($scope.getYearlyPrice()).to.equal(160);
    });

    it("should handle invalid license entry", function() {
      $scope.plan = {
        yearly: {
          billAmount: 100,
          priceDisplayYear: 30
        },
        additionalDisplayLicenses: "invalid"
      };

      expect($scope.getYearlyPrice()).to.equal(100);
    });
  });

});
