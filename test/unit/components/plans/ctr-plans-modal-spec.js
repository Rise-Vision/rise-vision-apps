"use strict";

describe("controller: plans modal", function() {
  beforeEach(module("risevision.common.components.plans"));
  beforeEach(module(function ($provide) {
    $provide.service("$modalInstance", function() {
      return {
        _dismissed : false,
        _closed: false,
        dismiss : function(reason){
          expect(reason).to.equal("cancel");
          this._dismissed = true;
        },
        close: function(reason) {
          expect(reason).to.equal("success");
          this._closed = true;
        }
      };
    });
    $provide.service("$loading", function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      };
    });
    $provide.factory("plansFactory", function() {
      return {
        getPlansDetails: function() {
          return null;
        },
        startTrial: function() {
          return Q.resolve([]);
        }
      };
    });
    $provide.factory("currentPlanFactory", function() {
      return {
        isPlanActive: function() {
          return true;
        },
        isOnTrial: function (){
          return true;
        },
        currentPlan: {}
      };
    });
    $provide.factory("userState", function() {
      return {
        reloadSelectedCompany: function() {},
        getCopyOfSelectedCompany: function() {
          return {};
        }
      };
    });
    $provide.factory("getCompany", function() {
      return function() {return Q.resolve();};
    });
    $provide.factory("ChargebeeFactory", function() {
      return function() {
        return {
          openPortal: function() {}
        };
      };
    });
    $provide.factory("purchaseFactory", function() {
      return {};
    });
    $provide.service("$modal", function() {
      return {
        open: sinon.stub()
      };
    });
    $provide.service("$q", function() {
      return Q;
    });
  }));

  var sandbox, $scope, $modalInstance, $modal, $loading, $log, plansFactory, currentPlanFactory, $q;
  var userState;
  var BASIC_PLAN_CODE, ADVANCED_PLAN_CODE;

  beforeEach(function(done) {
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      $modal = $injector.get("$modal");
      $loading = $injector.get("$loading");
      $log = $injector.get("$log");
      plansFactory = $injector.get("plansFactory");
      currentPlanFactory = $injector.get("currentPlanFactory");
      $q = $injector.get("$q");
      userState = $injector.get("userState");

      var plansByType = _.keyBy($injector.get("PLANS_LIST"), "type");

      BASIC_PLAN_CODE = plansByType.basic.productCode;
      ADVANCED_PLAN_CODE = plansByType.advanced.productCode;

      var plansList = [{
        productCode: BASIC_PLAN_CODE,
        status: "Trial Available",
        statusCode: "trial-available"
      }, {
        productCode: ADVANCED_PLAN_CODE,
        status: "Subscribed",
        statusCode: "subscribed"
      }];

      sandbox.stub(plansFactory, "getPlansDetails", function(){
        return $q.when(plansList);
      });

      $controller("PlansModalCtrl", {
        $scope: $scope,
        $modalInstance: $modalInstance,
        $modal: $modal,
        $loading: $loading,
        plansFactory: plansFactory,
        showRPPLink: false,
        userState: userState
      });

      $scope.$digest();

      setTimeout(function () {
        $scope.$digest();
        done();
      });
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should initialize",function() {
    expect($scope.currentPlan).to.be.ok;

    expect($scope.isCurrentPlan).to.be.a("function");
    expect($scope.isCurrentPlanSubscribed).to.be.a("function");
    expect($scope.isOnTrial).to.be.a("function");
    expect($scope.isTrialAvailable).to.be.a("function");
    expect($scope.isTrialExpired).to.be.a("function");
    expect($scope.isSubscribed).to.be.a("function");
    expect($scope.isFree).to.be.a("function");
    expect($scope.isStarter).to.be.a("function");
    expect($scope.showSavings).to.be.a("function");
    expect($scope.currentPlanLabelVisible).to.be.a("function");
    expect($scope.getVisibleAction).to.be.a("function");

    expect($scope.dismiss).to.be.a("function");

    expect(plansFactory.getPlansDetails).to.have.been.called;
  });

  it("should load plans details", function() {
    expect($scope.plans).to.be.not.null;
    expect($loading.start).to.have.been.called;
    expect($loading.stop).to.have.been.called;
  });

  describe("currentPlanLabelVisible: ", function() {
    it("should show if plan is same as current and current plan active", function() {
      sandbox.stub(currentPlanFactory, "isPlanActive").returns(true);
      currentPlanFactory.currentPlan.type = "advanced";
      expect($scope.currentPlanLabelVisible({ type: "advanced" })).to.be.true;
    });

    it("should not show if plan is same as current and current plan is inactive", function() {
      sandbox.stub(currentPlanFactory, "isPlanActive").returns(false);
      currentPlanFactory.currentPlan.type = "advanced";
      expect($scope.currentPlanLabelVisible({ type: "advanced" })).to.be.false;
    });

    it("should show if plan is free and and current plan is inactive", function() {
      sandbox.stub(currentPlanFactory, "isPlanActive").returns(false);
      expect($scope.currentPlanLabelVisible({ type: "free" })).to.be.true;
    });

    it("should show if plan is free and and current plan is inactive", function() {
      sandbox.stub(currentPlanFactory, "isPlanActive").returns(false);
      expect($scope.currentPlanLabelVisible({ type: "advanced" })).to.be.false;
    });
  });

  describe("getVisibleAction: ", function() {
    describe("active plan: ", function() {
      beforeEach(function() {
        sandbox.stub(currentPlanFactory, "isPlanActive").returns(true);
      });

      it("should not show a button if active plan is subscribed", function() {
        currentPlanFactory.currentPlan.type = "advanced";
        currentPlanFactory.currentPlan.order = 3;
        expect($scope.getVisibleAction({ type: "advanced", order: 3, statusCode: "subscribed" })).equal("");        
      });

      it("should show the Subscribe button (Purchase Flow version) if active plan is on trial", function() {
        sandbox.stub(currentPlanFactory, "isOnTrial").returns(true);
        currentPlanFactory.currentPlan.type = "advanced";
        currentPlanFactory.currentPlan.order = 3;
        expect($scope.getVisibleAction({ type: "advanced", order: 3, statusCode: "on-trial" })).equal("subscribe");
      });

      it("should show the Subscribe button (Chargebee Portal version) if already has a Chargebee account (already Subscribed to a plan)", function() {
        sandbox.stub(currentPlanFactory, "isOnTrial").returns(false);
        currentPlanFactory.currentPlan.type = "basic";
        currentPlanFactory.currentPlan.order = 2;
        expect($scope.getVisibleAction({ type: "advanced", order: 3 })).equal("subscribe-portal");
      });

      it("should show the Downgrade button (Purchase Flow version) if it is a lower plan and it is a trial (except for Free)", function() {
        sandbox.stub(currentPlanFactory, "isOnTrial").returns(true);
        currentPlanFactory.currentPlan.type = "advanced";
        currentPlanFactory.currentPlan.order = 3;
        expect($scope.getVisibleAction({ type: "basic", order: 2 })).equal("downgrade");
      });

      it("should show the Downgrade button (Chargebee Portal version) if it is Free plan and it is a trial", function() {
        sandbox.stub(currentPlanFactory, "isOnTrial").returns(true);
        currentPlanFactory.currentPlan.type = "advanced";
        currentPlanFactory.currentPlan.order = 3;
        expect($scope.getVisibleAction({ type: "free", order: 0 })).equal("downgrade-portal");
      });

      it("should show the Downgrade button if it is a lower plan", function() {
        sandbox.stub(currentPlanFactory, "isOnTrial").returns(false);
        currentPlanFactory.currentPlan.type = "advanced";
        currentPlanFactory.currentPlan.order = 3;
        expect($scope.getVisibleAction({ type: "basic", order: 2 })).equal("downgrade-portal");
      });
      
    });

    describe("no active plan: ", function() {
      beforeEach(function() {
        sandbox.stub(currentPlanFactory, "isPlanActive").returns(false);        
      });

      it("should not show a button if plan is free", function() {
        expect($scope.getVisibleAction({ type: "free" })).equal("");        
      });

      it("should show the Start Trial button if plan has a trial available", function() {
        expect($scope.getVisibleAction({ type: "advanced", statusCode: "trial-available" })).equal("start-trial");        
      });

      it("should show the Subscribe button (Purchase Flow version) if plan has no trial available", function() {
        expect($scope.getVisibleAction({ type: "advanced", statusCode: "trial-expired" })).equal("subscribe");        
      });

    });
  });

});
