"use strict";

describe("controller: tax exemption modal", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$modalInstance", function() {
      return {
        dismiss : sinon.stub(),
        close: sinon.stub()
      };
    });
    $provide.service("$loading", function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      };
    });
    $provide.service("taxExemptionFactory", function() {
      return taxExemptionFactory = {
        submitCertificate: sinon.spy(function() {
          taxExemptionFactory.taxExemptionError = exemptionError;
          return Q.resolve();
        }),
        init: sinon.spy()
      };
    });
  }));

  var $scope, $modalInstance, $loading, taxExemptionFactory, exemptionError;

  beforeEach(function() {
    exemptionError = null;

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      $loading = $injector.get("$loading");

      $controller("TaxExemptionModalCtrl", {
        $scope: $scope,
        $modalInstance: $modalInstance,
        $loading: $loading
      });

      $scope.$digest();
    });
  });

  it("should initialize",function() {
    expect($scope.form).to.be.an("object");

    expect($scope.submit).to.be.a("function");

    expect($scope.selectFile).to.be.a("function");
    expect($scope.setFile).to.be.a("function");

    expect($scope.close).to.be.a("function");
  });

  it("should init factory", function() {
    expect($scope.factory).to.be.ok;

    $scope.factory.init.should.have.been.called;
  });

  describe("$loading spinner: ", function() {
    it("should start and stop spinner", function() {
      taxExemptionFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith("tax-exemption-modal");

      taxExemptionFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
    });
  });

  describe("submit", function () {
    it("should not submit if form is invalid", function() {
      $scope.form.taxExemptionForm = {
        $invalid: true
      };

      $scope.submit();

      expect(taxExemptionFactory.submitCertificate).to.not.have.been.called;
    });

    it("should successfully submit", function (done) {
      $scope.form.taxExemptionForm = {
        $invalid: false
      };

      $scope.submit().then(function () {
        taxExemptionFactory.submitCertificate.should.have.been.calledOnce;
        expect($modalInstance.close).to.have.been.called;

        done();
      });
    });

    it("should fail to submit when tax exemption request fails", function (done) {
      $scope.form.taxExemptionForm = {
        $invalid: false
      };

      exemptionError = "error";

      $scope.submit().then(function () {
        expect(taxExemptionFactory.submitCertificate).to.have.been.called;
        expect($modalInstance.close).to.not.have.been.called;

        done();
      });
    });

  });

  it("close: ", function() {
    $scope.close();
    $modalInstance.dismiss.should.have.been.called;
  });

});
