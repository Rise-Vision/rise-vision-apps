"use strict";

describe("directive: address form", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));
  beforeEach(module(function ($provide) {
    $provide.value("COUNTRIES", []);
    $provide.value("REGIONS_CA", []);
    $provide.value("REGIONS_US", []);
  }));

  var $scope, form, element;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put("purchase-flow/address-form.html", "<p>mock</p>");
    $rootScope.address = {};
    $rootScope.form = form = {
      addressForm: {
        field1: {
          $dirty: true,
          $invalid: true
        },
        $submitted: true
      }
    };

    element = angular.element("<address-form form-object=\"form.addressForm\" address-object=\"address\" hide-company-name=\"true\"></address-form>");
    $compile(element)($rootScope);

    $rootScope.$digest();
    
    $scope = element.isolateScope();
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should exist", function() {
    expect($scope.countries).to.be.ok;
    expect($scope.regionsCA).to.be.ok;
    expect($scope.regionsUS).to.be.ok;

    expect($scope.formObject).to.be.a("object");
    expect($scope.addressObject).to.be.a("object");
    expect($scope.hideCompanyName).to.be.true;

    expect($scope.isFieldInvalid).to.be.a("function");
  });

  describe("isFieldInvalid: ", function() {
    it("should return true if invalid, submitted and dirty", function() {
      expect($scope.isFieldInvalid("field1")).to.be.true;
    });

    it("should return false if not submitted or dirty", function() {
      form.addressForm.$submitted = false;
      form.addressForm.field1.$dirty = false;

      expect($scope.isFieldInvalid("field1")).to.be.false;
    });

    it("should return true if submitted but not dirty", function() {
      form.addressForm.$submitted = true;
      form.addressForm.field1.$dirty = false;

      expect($scope.isFieldInvalid("field1")).to.be.true;
    });

    it("should return true if not submitted but dirty", function() {
      form.addressForm.$submitted = false;
      form.addressForm.field1.$dirty = true;

      expect($scope.isFieldInvalid("field1")).to.be.true;
    });

    it("should return false if valid", function() {
      form.addressForm.field1.$invalid = false;

      expect($scope.isFieldInvalid("field1")).to.be.false;
    });

  });
});
