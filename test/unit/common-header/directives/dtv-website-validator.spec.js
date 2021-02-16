"use strict";

/*jshint expr:true */

describe("directive: website validator", function() {
  beforeEach(module("risevision.common.header.directives"));
  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      "<form name=\"form\">" +
      "<input ng-model=\"url\" name=\"url\" website-validator />" +
      "</form>"
    );
    $scope.url = "1234";
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it("should pass with blank value", function() {
    form.url.$setViewValue("");
    $scope.$digest();
    expect($scope.url).to.not.be.ok;
    expect(form.url.$valid).to.be.true;
  });

  it("should not pass with incorrect format", function() {
    form.url.$setViewValue("1234");
    $scope.$digest();
    expect(form.url.$valid).to.be.false;
  });
  
  it("should not allow email addresses", function() {
    form.url.$setViewValue("email@gmail.com");
    $scope.$digest();
    expect(form.url.$valid).to.be.false;
  });

  it("should pass with valid url", function() {
    form.url.$setViewValue("http://risevision.com");
    $scope.$digest();
    expect(form.url.$valid).to.be.true;
  });
  
  it("should not require http", function() {
    form.url.$setViewValue("risevision.com");
    $scope.$digest();
    expect(form.url.$valid).to.be.true;
  });
  
});
