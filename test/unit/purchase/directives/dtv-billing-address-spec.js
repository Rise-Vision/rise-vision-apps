"use strict";

describe("directive: billing address", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", {
      purchase: {
        billingAddress: "billingAddress",
        contact: "contact"
      }
    });
  }));

  var $scope, element;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put("partials/purchase/checkout-billing-address.html", "<p>mock</p>");
    $scope = $rootScope.$new();

    element = $compile("<billing-address></billing-address>")($scope);
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });
  
  it("should initialize", function() {
    expect($scope.billingAddress).to.equal("billingAddress");
    expect($scope.contact).to.equal("contact");
  });

});
