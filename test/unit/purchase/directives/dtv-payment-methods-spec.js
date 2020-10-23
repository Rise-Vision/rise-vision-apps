"use strict";

describe("directive: payment methods", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", {
      initializeStripeElements: sinon.spy(function() {
        return Q.resolve([]);
      }),
      purchase: {
        paymentMethods: "paymentMethods",
        contact: {
          email: "contactEmail"
        }
      }
    });
  }));

  var $scope, element;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
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

    expect($scope.getCardDescription).to.be.a("function");
  });

  it("getCardDescription: ", function() {
    var card = {
      last4: "2345",
      cardType: "Visa",
      isDefault: false
    };

    expect($scope.getCardDescription(card)).to.equal("***-2345, Visa");

    card.isDefault = true;

    expect($scope.getCardDescription(card)).to.equal("***-2345, Visa (default)");
  });

});
