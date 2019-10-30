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
    $provide.factory("purchaseFactory", function() {
      return {};
    });
  }));

  var $scope, $modalInstance, currentPlanFactory;
  var userState;
  var BASIC_PLAN_CODE, ADVANCED_PLAN_CODE;

  beforeEach(function(done) {
    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      currentPlanFactory = $injector.get("currentPlanFactory");
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

      $controller("PlansModalCtrl", {
        $scope: $scope,
        $modalInstance: $modalInstance,
        userState: userState
      });

      $scope.$digest();

      setTimeout(function () {
        $scope.$digest();
        done();
      });
    });
  });

  it("should initialize",function() {
    expect($scope.currentPlan).to.be.ok;

    expect($scope.isFree).to.be.a("function");
    expect($scope.isStarter).to.be.a("function");
    expect($scope.showSavings).to.be.a("function");

    expect($scope.dismiss).to.be.a("function");
  });

});
