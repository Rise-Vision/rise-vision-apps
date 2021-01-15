"use strict";

describe("directive: tax exemption form", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("taxExemptionFactory", function() {
      return {
        submitTaxExemption: sinon.stub().returns(Q.resolve()),
        taxExemption: {}
      };
    });

  }));

  var $scope, element, taxExemptionFactory;

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    taxExemptionFactory = $injector.get('taxExemptionFactory');

    $templateCache.put("partials/purchase/tax-exemption.html", "<p>mock</p>");

    element = angular.element("<tax-exemption></tax-exemption>");
    $compile(element)($rootScope);

    $rootScope.$digest();
    
    $scope = element.isolateScope();

    $scope.form = {
      taxExemptionForm: {
        field1: {
          $dirty: true,
          $invalid: true
        },
        $submitted: true
      }
    };
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should exist", function() {
    expect($scope).to.be.ok;
    expect($scope.taxExemption).to.equal(taxExemptionFactory.taxExemption);

    expect($scope.form).to.be.an("object");

    expect($scope.submit).to.be.a("function");

    expect($scope.selectFile).to.be.a("function");
    expect($scope.removeFile).to.be.a("function");
    expect($scope.setFile).to.be.a("function");

    expect($scope.isFieldInvalid).to.be.a("function");
  });

  describe("submit:", function () {
    it("should not submit if form is invalid", function() {
      $scope.form.taxExemptionForm.$invalid = true;

      $scope.submit();

      expect(taxExemptionFactory.submitTaxExemption).to.not.have.been.called;
    });

    it("should successfully submit", function () {
      $scope.form.taxExemptionForm.$invalid = false;

      $scope.submit();
      
      taxExemptionFactory.submitTaxExemption.should.have.been.called;
    });

  });

  describe("isFieldInvalid: ", function() {
    it("should return true if invalid, submitted and dirty", function() {
      expect($scope.isFieldInvalid("field1")).to.be.true;
    });

    it("should return false if not submitted or dirty", function() {
      $scope.form.taxExemptionForm.$submitted = false;
      $scope.form.taxExemptionForm.field1.$dirty = false;

      expect($scope.isFieldInvalid("field1")).to.be.false;
    });

    it("should return true if submitted but not dirty", function() {
      $scope.form.taxExemptionForm.$submitted = true;
      $scope.form.taxExemptionForm.field1.$dirty = false;

      expect($scope.isFieldInvalid("field1")).to.be.true;
    });

    it("should return true if not submitted but dirty", function() {
      $scope.form.taxExemptionForm.$submitted = false;
      $scope.form.taxExemptionForm.field1.$dirty = true;

      expect($scope.isFieldInvalid("field1")).to.be.true;
    });

    it("should return false if valid", function() {
      $scope.form.taxExemptionForm.field1.$invalid = false;

      expect($scope.isFieldInvalid("field1")).to.be.false;
    });

  });
});
