"use strict";

describe("directive: payment methods", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", {
      purchase: {
        contact: {
          email: "contactEmail"
        }
      }
    });
    $provide.value("creditCardFactory", {
      paymentMethods: "paymentMethods"
    });
  }));

  var $scope, element;

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    $templateCache.put("partials/purchase/checkout-payment-methods.html", "<p>mock</p>");
    $scope = $rootScope.$new();

    element = $compile("<payment-methods></payment-methods>")($scope);
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should initialize scope", function() {
    expect($scope).to.be.an("object");

    expect($scope.paymentMethods).to.equal("paymentMethods");
    expect($scope.contactEmail).to.equal("contactEmail");
    expect($scope.purchase).to.be.ok;
  });

});
