"use strict";

/*jshint expr:true */

describe("directive: province validator", function() {
  beforeEach(module("risevision.apps.purchase"));
  var $scope, form;

  beforeEach(module(function ($provide) {
    $provide.value("REGIONS_CA", [["Ontario", "ON"]]);
    $provide.value("REGIONS_US", [["New York", "NY"]]);
  }));

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      "<form name=\"form\">" +
      "<input ng-model=\"province\" name=\"province\" province-validator=\"country\" />" +
      "</form>"
    );
    $scope.country = "";
    $scope.province = "";
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it("should pass with blank values", function() {
    expect(form.province.$valid).to.be.true;
  });

  it("should pass with any value if no country is set", function() {
    form.province.$setViewValue("asdf");
    $scope.$digest();

    expect(form.province.$valid).to.be.true;
  });

  it("should pass with any value if other country is set", function() {
    $scope.country = "UK";
    form.province.$setViewValue("asdf");
    $scope.$digest();

    expect(form.province.$valid).to.be.true;
  });

  describe("CA: ", function() {
    beforeEach(function() {
      $scope.country = "CA";
    });

    it("should pass with valid province", function() {
      form.province.$setViewValue("ON");
      $scope.$digest();

      expect(form.province.$valid).to.be.true;
    });

    it("should fail with blank province", function() {
      $scope.$digest();

      expect(form.province.$valid).to.be.false;
    });

    it("should fail with invalid province", function() {
      form.province.$setViewValue("NY");
      $scope.$digest();

      expect(form.province.$valid).to.be.false;
    });
  });

  describe("US: ", function() {
    beforeEach(function() {
      $scope.country = "US";
    });

    it("should pass with valid state", function() {
      form.province.$setViewValue("NY");
      $scope.$digest();

      expect(form.province.$valid).to.be.true;
    });

    it("should fail with blank state", function() {
      $scope.$digest();

      expect(form.province.$valid).to.be.false;
    });

    it("should fail with invalid state", function() {
      form.province.$setViewValue("ON");
      $scope.$digest();

      expect(form.province.$valid).to.be.false;
    });
  });

  it("should watch country value", function() {
    $scope.country = "CA";
    $scope.$digest();

    expect(form.province.$valid).to.be.false;
  });
});
