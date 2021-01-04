"use strict";

describe("controller: purchase-licenses", function() {
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
        currentPlan: {}
      };
    });
    $provide.service("purchaseLicensesFactory", function() {
      return {
        completePayment: sandbox.stub().returns(Q.resolve()),
        init: sandbox.stub()
      };
    });
    $provide.service("helpWidgetFactory", function() {
      return {};
    });
    $provide.service("$location", function() {
      return {
        path: sandbox.stub().returns("/purchase")
      };
    });
  }));

  var sandbox, $scope, $state, $loading, validate, purchaseLicensesFactory, helpWidgetFactory, $location, redirectTo;

  beforeEach(function() {
    validate = true;
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();
      $state = $injector.get("$state");
      $loading = $injector.get("$loading");
      purchaseLicensesFactory = $injector.get("purchaseLicensesFactory");
      helpWidgetFactory = $injector.get("helpWidgetFactory");
      $location = $injector.get("$location");
      redirectTo =  '/displays/list'

      $controller("PurchaseLicensesCtrl", {
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
    expect($scope.form).to.be.an("object");
    expect($scope.factory).to.equal(purchaseLicensesFactory);
    expect($scope.helpWidgetFactory).to.equal(helpWidgetFactory);
    expect($scope.currentPlan).to.be.ok;

    expect($scope.completePayment).to.be.a("function");
    expect($scope.close).to.be.a("function");

    purchaseLicensesFactory.init.should.have.been.called;
  });

  describe("$loading spinner: ", function() {
    it("should start and stop spinner", function() {
      purchaseLicensesFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith("purchase-licenses-loader");

      purchaseLicensesFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
    });
  });

  describe('completePayment:', function() {
    it("should complete payment", function() {
      $scope.form.purchaseLicensesForm = {
        $valid: true
      };

      $scope.completePayment();

      purchaseLicensesFactory.completePayment.should.have.been.called;
    });

    it("should not complete payment if form is not valid", function() {
      $scope.form.purchaseLicensesForm = {
        $valid: false
      };

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
