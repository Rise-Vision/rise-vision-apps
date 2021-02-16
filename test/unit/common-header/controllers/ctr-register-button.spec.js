"use strict";

/*jshint -W030 */

describe("controller: register button ", function() {
  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    
    $provide.factory("uiFlowManager", function(){
      return {
        invalidateStatus : function(status){
          invalidatedStatus = status;
        }
      };
    });

    $provide.service("userState", function(){
      return {
        _restoreState: function () {}
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
  var $scope, invalidatedStatus;
  
  beforeEach(function() {
    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();

      $controller("RegisterButtonCtrl", {
        $scope : $scope,
        uiFlowManager: $injector.get("uiFlowManager")
      });
      $scope.$digest();
    });
  });
  
  it("should initialize",function(){
    expect($scope).to.be.ok;
    expect($scope.register).to.be.a("function");
  });

  it("should initiate registration: ", function() {
    $scope.register();

    expect(invalidatedStatus).to.equal("registrationComplete");
  });
});
  
