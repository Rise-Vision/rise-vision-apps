"use strict";

describe("controller: update subscription", function() {
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
        go: sandbox.spy(),
        params: {
          purchaseAction: 'add',
          subscriptionId: 'subscriptionId'
        }
      }
    });
    $provide.service("updateSubscriptionFactory", function() {
      return {
        completePayment: sandbox.stub().returns(Q.resolve()),
        init: sandbox.stub(),
        getEstimate: sandbox.stub().returns(Q.resolve()),
        purchase: {}
      };
    });
    $provide.service("subscriptionFactory", function() {
      return {};
    });
    $provide.service("$location", function() {
      return {
        path: sandbox.stub().returns("/purchase")
      };
    });
  }));

  var sandbox, _compile, $scope, $state, $loading, validate, updateSubscriptionFactory,
    subscriptionFactory, $location, redirectTo;

  beforeEach(function() {
    validate = true;
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();
      $state = $injector.get("$state");
      $loading = $injector.get("$loading");
      updateSubscriptionFactory = $injector.get("updateSubscriptionFactory");
      subscriptionFactory = $injector.get("subscriptionFactory");
      $location = $injector.get("$location");
      redirectTo =  '/displays/list'

      _compile = function() {
        $controller("UpdateSubscriptionCtrl", {
          $scope: $scope,
          redirectTo: redirectTo
        });

        $scope.$digest();
      };

      _compile($controller);
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should initialize",function() {
    expect($scope.factory).to.equal(updateSubscriptionFactory);

    expect($scope.applyCouponCode).to.be.a("function");
    expect($scope.clearCouponCode).to.be.a("function");
    expect($scope.getEstimate).to.be.a("function");
    expect($scope.completePayment).to.be.a("function");
    expect($scope.close).to.be.a("function");

    updateSubscriptionFactory.init.should.have.been.called;
  });

  describe("$loading spinner: ", function() {
    it("should start and stop spinner", function() {
      subscriptionFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith("update-subscription-loader");

      subscriptionFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;

      updateSubscriptionFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledTwice;

      updateSubscriptionFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledThrice;
    });
  });

  describe('applyCouponCode:', function() {
    it("should not get estimate if there's no coupon code", function() {
      $scope.applyCouponCode();

      updateSubscriptionFactory.getEstimate.should.not.have.been.called;
    });

    it("should not get estimate if form is not valid", function() {
      $scope.couponCode = 'SAVE50';
      $scope.purchaseLicensesForm = { $valid: false };
      $scope.addCoupon = true;

      $scope.applyCouponCode();

      updateSubscriptionFactory.getEstimate.should.not.have.been.called;
    });

    it("should not get estimate if coupon code is not set", function() {
      $scope.couponCode = '';
      $scope.addCoupon = true;

      $scope.applyCouponCode();

      updateSubscriptionFactory.getEstimate.should.not.have.been.called;
    });

    it("should get estimate and unset addCoupon flag if there's no API error", function(done) {
      $scope.couponCode = 'SAVE50';
      $scope.addCoupon = true;

      $scope.applyCouponCode();

      updateSubscriptionFactory.getEstimate.should.have.been.called;

      setTimeout(function() {
        expect($scope.factory.purchase.couponCode).to.equal('SAVE50');
        expect($scope.addCoupon).to.be.false;

        done();
      }, 10);
    });

    it("should get estimate and not unset addCoupon flag if there's API error", function(done) {
      $scope.factory.apiError = true;
      $scope.couponCode = 'SAVE50';
      $scope.addCoupon = true;

      $scope.applyCouponCode();

      updateSubscriptionFactory.getEstimate.should.have.been.called;

      setTimeout(function() {
        expect($scope.factory.purchase.couponCode).to.equal('SAVE50');
        expect($scope.addCoupon).to.be.true;

        done();
      }, 10);
    });
  });

  describe('clearCouponCode:', function() {
    it("should clear coupon code without estimating if there's no API error", function() {
      $scope.addCoupon = true;
      $scope.couponCode = 'SAVE50';

      $scope.clearCouponCode();

      expect($scope.addCoupon).to.be.false;
      expect($scope.couponCode).to.be.null;
      expect($scope.factory.purchase.couponCode).to.be.null;
      updateSubscriptionFactory.getEstimate.should.not.have.been.called;
    });

    it("should clear coupon code and estimate if there's API error", function() {
      $scope.addCoupon = true;
      $scope.couponCode = 'SAVE50';
      $scope.factory.apiError = true;

      $scope.clearCouponCode();

      expect($scope.addCoupon).to.be.false;
      expect($scope.couponCode).to.be.null;
      expect($scope.factory.purchase.couponCode).to.be.null;
      updateSubscriptionFactory.getEstimate.should.have.been.called;
    });
  });

  describe('getEstimate:', function() {
    it("should get estimate", function() {
      $scope.purchaseLicensesForm = {
        $valid: true
      };

      $scope.getEstimate();

      updateSubscriptionFactory.getEstimate.should.have.been.called;
    });

    it("should not get estimate if form is not valid", function() {
      $scope.purchaseLicensesForm = {
        $valid: false
      };

      $scope.getEstimate();

      updateSubscriptionFactory.getEstimate.should.not.have.been.called;
    });
  });


  describe('completePayment:', function() {
    it("should complete payment", function() {
      $scope.purchaseLicensesForm = {
        $valid: true
      };

      $scope.completePayment();

      updateSubscriptionFactory.completePayment.should.have.been.called;
    });

    it("should not complete payment if form is not valid", function() {
      $scope.purchaseLicensesForm = {
        $valid: false
      };

      $scope.completePayment();

      updateSubscriptionFactory.completePayment.should.not.have.been.called;
    });
  });

  describe("close: ", function() {
    it("should close and redirect to provided path", function() {
      $scope.close();

      $location.path.should.have.been.calledWith(redirectTo);
      $state.go.should.not.have.been.called;
    });

    it("should close and redirect to the subscription page", function() {
      redirectTo = '';

      _compile();

      $scope.close();

      $location.path.should.not.have.been.called;
      $state.go.should.have.been.calledWith('apps.billing.subscription', {
        subscriptionId: 'subscriptionId'
      });
    });

  });

});
