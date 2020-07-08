"use strict";

describe("directive: suggest-general-delivery", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));

  beforeEach(module(function ($provide) {
    $provide.service('addressFactory',function(){
      return {};
    });
  }));

  var $scope, element, addressFactory, addressObject;

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    $templateCache.put("partials/components/purchase-flow/suggest-general-delivery.html", "<p>mock</p>");
    addressFactory = $injector.get("addressFactory");

    addressObject = { unit: "Room 12" };
    $scope = $rootScope.$new();
    $scope.addressObject = addressObject;

    element = $compile("<suggest-general-delivery address-object=\"addressObject\"></suggest-general-delivery>")($scope);
    $scope = element.isolateScope();
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });
  
  it("should initialize", function() {
    expect($scope.addressObject).to.equal(addressObject);
    expect($scope.addressFactory).to.equal(addressFactory);
  });

});
