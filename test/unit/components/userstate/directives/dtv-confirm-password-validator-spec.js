"use strict";

/*jshint expr:true */

describe("directive: confirm password validator", function() {
  beforeEach(module("risevision.common.components.userstate"));
  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      "<form name=\"form\">" +
      "<input ng-model=\"confirmPassword\" name=\"confirmPassword\" confirm-password-validator=\"password\" />" +
      "</form>"
    );
    $scope.confirmPassword = "1234";
    $compile(element)($scope);
    form = $scope.form;
    $scope.password = "password";
    
    $scope.$digest();
  }));

  it("should pass with blank value", function() {
    form.confirmPassword.$setViewValue("");
    $scope.$digest();
    expect($scope.confirmPassword).to.not.be.ok;
    expect(form.confirmPassword.$valid).to.be.true;
  });
  
  it("should fail if passwords don't match", function() {
    form.confirmPassword.$setViewValue("pass");
    $scope.$digest();
    expect(form.confirmPassword.$valid).to.be.false;
  });

  it("should pass with matching passwords", function() {
    form.confirmPassword.$setViewValue("password");
    $scope.$digest();
    expect(form.confirmPassword.$valid).to.be.true;
  });
  
});
