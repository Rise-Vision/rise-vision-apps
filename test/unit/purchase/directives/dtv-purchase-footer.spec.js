"use strict";

describe("directive: purchase footer", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.value("helpWidgetFactory", 'helpWidgetFactory');
  }));

  var $scope, element;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put("partials/purchase/purchase-footer.html", "<p>mock</p>");

    element = angular.element("<purchase-footer></purchase-footer>");
    $compile(element)($rootScope);

    $rootScope.$digest();
    
    $scope = element.isolateScope();
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should exist", function() {
    expect($scope).to.be.ok;
    expect($scope.helpWidgetFactory).to.equal('helpWidgetFactory');
  });

});
