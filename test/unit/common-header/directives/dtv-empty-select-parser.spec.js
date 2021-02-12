/*jshint expr:true */

"use strict";
describe("directive: empty select parser", function() {
  beforeEach(module("risevision.common.header.directives"));

  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      "<form name=\"form\">" +
      "<select name=\"province\" ng-model=\"company.province\" ng-options=\"c[1] as c[0] for c in regionsUS\" empty-select-parser>" +
      "  <option value=\"\">&lt; Select State &gt;</option>" +
      "</select>" +
      "</form>"
    );
    $scope.company = { 
    };
    $scope.regionsUS = {
      "NY": "New York",
      "FL": "Florida"
    };
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it("should default to undefined", function() {
    expect($scope.company.province).to.not.equal(null);
    expect($scope.company.province).to.be.undefined;
  });

  it("should pass selected value", function() {
    form.province.$setViewValue("NY");
    $scope.$digest();
    expect($scope.company.province).to.equal("NY");
  });
  
  it("should not pass null value", function() {
    form.province.$setViewValue("NY");
    $scope.$digest();

    form.province.$setViewValue("");
    $scope.$digest();
    expect($scope.company.province).to.not.equal(null);
    expect($scope.company.province).to.equal("");
  });
  
});
