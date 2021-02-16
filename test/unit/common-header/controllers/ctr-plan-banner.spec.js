"use strict";

describe("controller: plan banner", function() {
  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide) {
    $provide.factory("currentPlanFactory", function() {
      return {
        currentPlan: {
          type: "basic",
          isPurchasedByParent: false
        },
        isParentPlan: sinon.stub().returns(false),
        isFree: sinon.stub().returns(false),
        isCancelled: sinon.stub().returns(false),
        isCancelledActive: sinon.stub().returns(false),
        isSubscribed: sinon.stub().returns(false),
        isOnTrial: sinon.stub().returns(false),
        isTrialExpired: sinon.stub().returns(false),
        isSuspended: sinon.stub().returns(false)
      };
    });
    $provide.factory("userState", function() {
      return {
        _restoreState: function () {},
        isSelectedCompanyChargebee: sinon.stub().returns(true)
      };
    });
    $provide.factory("plansFactory", function() {
      return {
        showPurchaseOptions: sinon.stub()
      };
    });
  }));

  var sandbox, $scope, $rootScope, currentPlanFactory, userState;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector, _$rootScope_, $controller) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      currentPlanFactory = $injector.get("currentPlanFactory");
      userState = $injector.get("userState");

      $controller("PlanBannerCtrl", {
        $scope: $scope,
        currentPlanFactory: currentPlanFactory,
        userState: userState
      });

      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should initialize",function() {
    expect($scope.showPlans).to.be.ok;
    expect($scope.storeAccountUrl).to.equal("https://store.risevision.com/account?cid=companyId");
    expect($scope.getVisibleBanner).to.be.a("function");
  });

  describe("getVisibleBanner: ", function() {
    
    it("should default to free bar", function() {
      expect($scope.getVisibleBanner()).to.equal("free");
    });

    it("should show parent plan bar", function() {
      currentPlanFactory.isParentPlan.returns(true);

      expect($scope.getVisibleBanner()).to.equal("parent");
    });

    it("should show parent plan bar", function() {
      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      expect($scope.getVisibleBanner()).to.equal("parentPurchased");
    });

    it("should show cancelled plan bar if cancelled and active", function() {
      currentPlanFactory.isCancelledActive.returns(true);

      expect($scope.getVisibleBanner()).to.equal("cancelled");
    });

    it("should show free plan bar", function() {
      currentPlanFactory.isFree.returns(true);

      expect($scope.getVisibleBanner()).to.equal("free");
    });

    it("should show free plan bar if cancelled", function() {
      currentPlanFactory.isCancelled.returns(true);

      expect($scope.getVisibleBanner()).to.equal("free");
    });

    it("should show subscribed plan bar", function() {
      currentPlanFactory.isSubscribed.returns(true);

      expect($scope.getVisibleBanner()).to.equal("subscribed");
    });

    it("should show on trial plan bar", function() {
      currentPlanFactory.isOnTrial.returns(true);

      expect($scope.getVisibleBanner()).to.equal("trial");
    });

    it("should show expired trial plan bar", function() {
      currentPlanFactory.isTrialExpired.returns(true);

      expect($scope.getVisibleBanner()).to.equal("expired");
    });

    it("should show suspended plan bar", function() {
      currentPlanFactory.isSuspended.returns(true);

      expect($scope.getVisibleBanner()).to.equal("suspended");
    });

  });

  it("should load the current plan when selected company changes", function(done) {
    $rootScope.$emit("risevision.plan.loaded");
    $rootScope.$digest();

    setTimeout(function () {
      expect($scope.plan).to.be.not.null;
      expect($scope.plan.type).to.equal("basic");

      expect(userState.isSelectedCompanyChargebee).to.have.been.called;
      expect($scope.isChargebee).to.be.true;

      done();
    }, 0);
  });
});
