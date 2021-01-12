"use strict";

describe("controller: remove-licenses", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$loading", function() {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.service("$state", function() {
      return {
        go: sandbox.spy()
      }
    });
    $provide.service("currentPlanFactory", function() {
      return {
        currentPlan: { playerProTotalLicenseCount: 10 }
      };
    });
    $provide.service("purchaseLicensesFactory", function() {
      return {
        completePayment: sandbox.stub().returns(Q.resolve()),
        init: sandbox.stub(),
        getEstimate: sandbox.stub().returns(Q.resolve()),
        purchase: {}
      };
    });
    $provide.service("$location", function() {
      return {
        path: sandbox.stub().returns("/purchase")
      };
    });
  }));

  var sandbox, $scope, $state, $loading, validate, purchaseLicensesFactory, $location, redirectTo;

  beforeEach(function() {
    validate = true;
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();
      $state = $injector.get("$state");
      $loading = $injector.get("$loading");
      purchaseLicensesFactory = $injector.get("purchaseLicensesFactory");
      $location = $injector.get("$location");
      redirectTo =  '/displays/list'

      $controller("RemoveLicensesCtrl", {
        $scope: $scope,
        $loading: $loading,
        redirectTo: redirectTo
      });

      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should initialize",function() {
    expect($scope.factory).to.equal(purchaseLicensesFactory);
    expect($scope.currentPlan).to.be.ok;
    expect($scope.formValid).to.be.true;

    expect($scope.getEstimate).to.be.a("function");
    expect($scope.completePayment).to.be.a("function");
    expect($scope.close).to.be.a("function");

    purchaseLicensesFactory.init.should.have.been.called;
  });

  describe("$loading spinner: ", function() {
    it("should start and stop spinner", function() {
      purchaseLicensesFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith("remove-licenses-loader");

      purchaseLicensesFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
    });
  });

  describe('formValid:', function() {
    it("form should be not valid if Angular invalid flag is set", function() {
      $scope.removeLicensesForm = {
        $invalid: true
      };
      purchaseLicensesFactory.purchase.displayCount = 10;
      $scope.$digest();

      expect($scope.formValid).to.be.false;
    });

    it("form should be not valid if display count is greater than plan license count", function() {
      $scope.removeLicensesForm = {
        $invalid: false
      };
      purchaseLicensesFactory.purchase.displayCount = 11;
      $scope.$digest();

      expect($scope.formValid).to.be.false;
    });

    it("form should be not valid if display count is equal than plan license count", function() {
      $scope.removeLicensesForm = {
        $invalid: false
      };
      purchaseLicensesFactory.purchase.displayCount = 10;
      $scope.$digest();

      expect($scope.formValid).to.be.false;
    });

    it("form should be valid if display count is less than plan license count", function() {
      $scope.removeLicensesForm = {
        $invalid: false
      };
      purchaseLicensesFactory.purchase.displayCount = 9;
      $scope.$digest();

      expect($scope.formValid).to.be.true;
    });
  });

  describe('getEstimate:', function() {
    it("should get estimate", function() {
      $scope.removeLicensesForm = {
        $invalid: false
      };
      purchaseLicensesFactory.purchase.displayCount = 9;
      $scope.$digest();

      $scope.getEstimate();

      purchaseLicensesFactory.getEstimate.should.have.been.called;
    });

    it("should not get estimate if form is not valid", function() {
      $scope.removeLicensesForm = {
        $invalid: true
      };
      purchaseLicensesFactory.purchase.displayCount = 20;
      $scope.$digest();

      $scope.getEstimate();

      purchaseLicensesFactory.getEstimate.should.not.have.been.called;
    });
  });

  describe('completePayment:', function() {
    it("should complete payment", function() {
      $scope.removeLicensesForm = {
        $invalid: false
      };
      purchaseLicensesFactory.purchase.displayCount = 9;
      $scope.$digest();

      $scope.completePayment();

      purchaseLicensesFactory.completePayment.should.have.been.called;
    });

    it("should not complete payment if form is not valid", function() {
      $scope.removeLicensesForm = {
        $invalid: true
      };
      purchaseLicensesFactory.purchase.displayCount = 20;
      $scope.$digest();

      $scope.completePayment();

      purchaseLicensesFactory.completePayment.should.not.have.been.called;
    });
  });

  describe("close: ", function() {
    it("should close modal and redirect to provided path", function() {
      $scope.close();

      $location.path.should.have.been.calledWith(redirectTo);
    });

  });

});
