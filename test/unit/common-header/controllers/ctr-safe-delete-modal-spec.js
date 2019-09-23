"use strict";

/*jshint -W030 */

describe("controller: safe delete modal", function() {
  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.service("$modalInstance",function(){
      return {
        dismiss : function(){},
        close: function() {}
      };
    });

    $provide.factory("customLoader", function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader("customLoader");
  }));

  var $scope, scopeWatchSpy, dismissSpy, closeSpy;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      scopeWatchSpy = sinon.spy($scope, "$watch");

      var $modalInstance = $injector.get("$modalInstance");
      dismissSpy = sinon.spy($modalInstance, "dismiss");
      closeSpy = sinon.spy($modalInstance, "close");
      
      $controller("SafeDeleteModalCtrl", {
        $scope : $scope,
        $modalInstance: $modalInstance
      });
      $scope.$digest();
    });
  });
    
  it("should exist",function(){
    expect($scope).to.be.ok;
    expect($scope.confirm).to.be.a("function");
    expect($scope.cancel).to.be.a("function");
    expect($scope.dismiss).to.be.a("function");
  });

  it("should init correctly",function(){
    expect($scope.inputText).to.be.null;
    expect($scope.canConfirm).to.be.false;
  });

  it("should watch inputText",function(){
    scopeWatchSpy.should.have.been.calledWith("inputText");
  });

  describe("inputText:",function(){
    it("should enable canConfirm when typing DELETE",function(){
      $scope.inputText = "DELETE";
      $scope.$apply();
      expect($scope.canConfirm).to.be.true;
    });

    it("should not enable canConfirm when typing anything else",function(){
      $scope.inputText = "DELE";
      $scope.$apply();
      expect($scope.canConfirm).to.be.false;

      $scope.inputText = null;
      $scope.$apply();
      expect($scope.canConfirm).to.be.false;
    });    
  });

  describe("confirm:",function(){
    it("should close modal if canConfirm",function(){
      $scope.canConfirm = true;
      $scope.confirm();
      closeSpy.should.have.been.called;
    });

    it("should not close modal if canConfirm is false",function(){
      $scope.canConfirm = false;
      $scope.confirm();
      closeSpy.should.not.have.been.called;
    });
  });
  
  it("should close modal",function(){
    $scope.cancel();
    dismissSpy.should.have.been.calledWith("cancel");
  });

  it("should dismiss modal",function(){
    $scope.dismiss();
    dismissSpy.should.have.been.called;
  });
    
});
  
