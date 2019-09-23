"use strict";

describe("directive: year selector", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));
  var $rootScope, $scope, element;

  beforeEach(inject(function($compile, _$rootScope_, $templateCache){
    $rootScope = _$rootScope_;
    $templateCache.put("purchase-flow/year-selector.html", "<p>mock</p>");
    $rootScope.selectedYear = 2012;

    element = angular.element("<year-selector ng-model=\"selectedYear\"></year-selector>");
    $compile(element)($rootScope);

    $rootScope.$digest();
    
    $scope = element.isolateScope();
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("mock");
  });

  it("should exist", function() {
    expect($scope.ngModel).to.be.ok;
    expect($scope.init).to.be.a("function");
    expect($scope.years).to.be.an("array");
  });

  describe("should populate years: ", function() {
    it("should add selected year to list", function() {
      expect($scope.years).to.have.length(21);
      expect($scope.years[0]).to.equal("2012");
    });

    it("should not add year if larger than current", function() {
      $rootScope.selectedYear = 2100;
      $rootScope.$digest();

      $scope.init();

      expect($scope.years).to.have.length(20);
      expect($scope.years[0]).to.not.equal("2100");
    });

  });
});
