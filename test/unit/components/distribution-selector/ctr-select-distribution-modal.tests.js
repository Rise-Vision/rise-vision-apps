"use strict";
describe("controller: Edit Distribution Modal", function() {
  beforeEach(module("risevision.common.components.distribution-selector"));
  beforeEach(module("risevision.common.components.distribution-selector.services"));
  beforeEach(module(function ($provide) {
    $provide.service("$modalInstance",function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(){
          return;
        }
      };
    });

    $provide.value("distribution", distributionValue);

  }));
  var $scope, $rootScope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, distributionValue, distribution;

  describe("distribution empty and distribute to all false" ,function () {
    beforeEach(function(){
      distributionValue = [];
      inject(function($injector, _$rootScope_, $controller){
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $modalInstance = $injector.get("$modalInstance");
        $modalInstanceDismissSpy = sinon.spy($modalInstance, "dismiss");
        $modalInstanceCloseSpy = sinon.spy($modalInstance, "close");
        distribution = $injector.get("distribution");

        sinon.spy($rootScope, "$broadcast");

        $controller("selectDistributionModal", {
          $scope : $scope,
          $modalInstance : $modalInstance,
          distribution: distribution
        });
        $scope.$digest();
      });
    });

    it("should exist",function(){
      expect($scope).to.be.truely;

      expect($scope.addDisplay).to.be.a("function");
      expect($scope.apply).to.be.a("function");
      expect($scope.dismiss).to.be.a("function");

      expect($scope.parameters).to.be.a("object");
      expect($scope.parameters.distribution).to.be.empty;

    });

    it("should broadcast event on addDisplay()",function(){
      $scope.addDisplay();

      $rootScope.$broadcast.should.have.been.calledWith("distributionSelector.addDisplay");
    });

    it("should close modal when clicked on apply",function(){
      $scope.apply();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith(distribution);
    });

    it("should dismiss modal when clicked on close with no action",function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });

  describe("distribution not empty and distribute to all false" ,function () {
    beforeEach(function(){
      distributionValue = ["display1", "display2"];
      inject(function($injector, $rootScope, $controller){
        $scope = $rootScope.$new();
        $modalInstance = $injector.get("$modalInstance");
        $modalInstanceDismissSpy = sinon.spy($modalInstance, "dismiss");
        $modalInstanceCloseSpy = sinon.spy($modalInstance, "close");
        distribution = $injector.get("distribution");
        $controller("selectDistributionModal", {
          $scope : $scope,
          $modalInstance : $modalInstance,
          distribution: distribution
        });
        $scope.$digest();
      });
    });

    it("should exist",function(){
      expect($scope).to.be.truely;

      expect($scope.apply).to.be.a("function");
      expect($scope.dismiss).to.be.a("function");

      expect($scope.parameters).to.be.a("object");
      expect($scope.parameters.distribution).to.contain("display1", "display2");

    });

    it("should close modal when clicked on apply",function(){
      $scope.apply();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith(distribution);
    });

    it("should dismiss modal when clicked on close with no action",function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });

  describe("distribution empty and distribute to all true" ,function () {
    beforeEach(function(){
      distributionValue = [];
      inject(function($injector, $rootScope, $controller){
        $scope = $rootScope.$new();
        $modalInstance = $injector.get("$modalInstance");
        $modalInstanceDismissSpy = sinon.spy($modalInstance, "dismiss");
        $modalInstanceCloseSpy = sinon.spy($modalInstance, "close");
        distribution = $injector.get("distribution");
        $controller("selectDistributionModal", {
          $scope : $scope,
          $modalInstance : $modalInstance,
          distribution: distribution
        });
        $scope.$digest();
      });
    });

    it("should exist",function(){
      expect($scope).to.be.truely;

      expect($scope.apply).to.be.a("function");
      expect($scope.dismiss).to.be.a("function");

      expect($scope.parameters).to.be.a("object");
      expect($scope.parameters.distribution).to.be.empty;

    });

    it("should close modal when clicked on apply",function(){
      $scope.apply();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith(distribution);
    });

    it("should dismiss modal when clicked on close with no action",function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });

  describe("distribution undefined and distribute to all true" ,function () {
    beforeEach(function(){
      distributionValue = undefined;
      inject(function($injector, $rootScope, $controller){
        $scope = $rootScope.$new();
        $modalInstance = $injector.get("$modalInstance");
        $modalInstanceDismissSpy = sinon.spy($modalInstance, "dismiss");
        $modalInstanceCloseSpy = sinon.spy($modalInstance, "close");
        distribution = $injector.get("distribution");
        $controller("selectDistributionModal", {
          $scope : $scope,
          $modalInstance : $modalInstance,
          distribution: distribution
        });
        $scope.$digest();
      });
    });

    it("should exist",function(){
      expect($scope).to.be.truely;

      expect($scope.apply).to.be.a("function");
      expect($scope.dismiss).to.be.a("function");

      expect($scope.parameters).to.be.a("object");
      expect($scope.parameters.distribution).to.be.empty;

    });

    it("should close modal when clicked on apply",function(){
      $scope.apply();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith([]);
    });

    it("should dismiss modal when clicked on close with no action",function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });
});
