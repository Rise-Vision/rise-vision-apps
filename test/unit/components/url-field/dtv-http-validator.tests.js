"use strict";

/*jshint expr:true */

describe("directive: http validator", function() {
  beforeEach(module("risevision.widget.common.url-field.http-validator"));
  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      "<form name=\"form\">" +
      "<input ng-model=\"url\" name=\"url\" http-validator />" +
      "</form>"
    );
    $scope.url = "";
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();

    $scope.ngModelCtrl = element.children('input').data().$ngModelController;
  }));

  it('should initialize', function() {
    expect($scope.ngModelCtrl).to.be.ok;
    expect($scope.ngModelCtrl.warnings).to.be.ok;
  })

  it("should pass with blank value", function() {
    form.url.$setViewValue("");
    $scope.$digest();
    expect($scope.url).to.not.be.ok;
    // expect(form.url.$valid).to.be.true;
    expect($scope.ngModelCtrl.warnings.httpUrl).to.be.false;
  });

  it("should not pass with http urls", function() {
    var expectInvalid = function(value) {
      form.url.$setViewValue(value);
      $scope.$digest();
      // expect(form.url.$valid).to.be.false;
      expect($scope.ngModelCtrl.warnings.httpUrl).to.be.true;
    };
    expectInvalid("http://");
    expectInvalid("http://shouldfail.com");
  });

  it("should pass with valid url", function() {
    var expectValid = function(value) {
      form.url.$setViewValue(value);
      $scope.$digest();
      // expect(form.url.$valid).to.be.true;
      expect($scope.ngModelCtrl.warnings.httpUrl).to.be.false;
    };
    expectValid("a");
    expectValid("123");
    expectValid("abcde.");
    expectValid("//a");    
    expectValid("ftps://foo.bar/");
    expectValid("risevision.com");
    expectValid("https://risevision.com");
    expectValid("https://www.example.com/foo/file.html?bar=baz&inga=42&quux");    
  });

});
