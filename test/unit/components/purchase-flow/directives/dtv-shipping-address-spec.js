"use strict";

describe("directive: shipping address", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", {
      purchase: {
        shippingAddress: "shippingAddress"
      }
    });
  }));

  var $scope, element;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put("purchase-flow/checkout-shipping-address.html", "<p>mock</p>");
    $scope = $rootScope.$new();

    element = $compile("<shipping-address></shipping-address>")($scope);
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should initialize", function() {
    expect($scope.shippingAddress).to.equal("shippingAddress");
  });
});
