"use strict";

/*jshint expr:true */

describe("directive: url pattern validator", function() {
  beforeEach(module("risevision.widget.common.url-field.url-pattern-validator"));
  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      "<form name=\"form\">" +
      "<input ng-model=\"url\" name=\"url\" url-pattern-validator />" +
      "</form>"
    );
    $scope.url = "";
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
    var expectInvalid = function(value) {
      form.url.$setViewValue(value);
      $scope.$digest();
      expect(form.url.$valid).to.be.false;
    };
    expectInvalid("a");
    expectInvalid("123");
    expectInvalid("abcde.");
    expectInvalid("//a");    
    expectInvalid("http:// shouldfail.com");
    expectInvalid("ftps://foo.bar/");
    expectInvalid("http:// shouldfail.com");        
  });

  it("should pass with valid url", function() {
    var expectValid = function(value) {
      form.url.$setViewValue(value);
      $scope.$digest();
      expect(form.url.$valid).to.be.true;
    };
    expectValid("risevision.com");
    expectValid("http://risevision.com");
    expectValid("https://risevision.com");
    expectValid("http://risevision.com:80");
    expectValid("https://www.example.com/foo/file.html?bar=baz&inga=42&quux");    
  });

  it("should not pass with preview url", function() {
    var expectInvalid = function(value) {
      form.url.$setViewValue(value);
      $scope.$digest();
      expect(form.url.$valid).to.be.false;
    };
    expectInvalid("preview.risevision.com");
    expectInvalid("http://preview.risevision.com");
    expectInvalid("https://preview.risevision.com");
    expectInvalid("http://preview.risevision.com/?type=presentation");
    expectInvalid("https://widgets.risevision.com/viewer/?type=presentation");
  });
  
});
