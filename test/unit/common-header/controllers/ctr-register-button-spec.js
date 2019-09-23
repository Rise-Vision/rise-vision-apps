"use strict";

/*jshint -W030 */

describe("controller: register button ", function() {
  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    
    $provide.factory("$cookies", function() {
      return {
        remove: function() {
          cookieStored = false;
        }
      };
    });
    
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
  var $scope, cookieStored, invalidatedStatus;
  
  beforeEach(function() {
    cookieStored = true;
    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();

      $controller("RegisterButtonCtrl", {
        $scope : $scope,
        $cookies : $injector.get("$cookies"),
        uiFlowManager: $injector.get("uiFlowManager")
      });
      $scope.$digest();
    });
  });
  
  it("should initialize",function(){
    expect($scope).to.be.truely;
    expect($scope.register).to.exist;
  });

  it("should initiate registration: ", function() {
    $scope.register();

    expect(cookieStored).to.be.false;
    expect(invalidatedStatus).to.equal("registrationComplete");
  });
});
  
