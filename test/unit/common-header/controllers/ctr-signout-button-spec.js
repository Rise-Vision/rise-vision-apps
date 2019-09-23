"use strict";

/*jshint -W030 */

describe("controller: signout button ", function() {
  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.factory("uiFlowManager", function(){
      return {
        invalidateStatus : function(status){
          invalidatedStatus = status;
        }
      };
    });
    
    $provide.service("$modal",function(){
      return {
        open : function(obj){
          expect(obj).to.be.ok;
          var deferred = Q.defer();
          if(confirmResponse){
            deferred.resolve();
          }else{
            deferred.reject();
          }
          
          return {
            result: deferred.promise
          };
        }
      };
    });

    $provide.factory("customLoader", function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });

    $provide.factory("$log", function(){
      return {
        debug: function() {},
        error: function() {}
      };
    });

    $provide.factory("userState", function() {
      return {
        isRiseAuthUser: function() {
          return false;
        },
        _restoreState: function() {}
      };
    });

    $provide.factory("userAuthFactory", function() {
      return {
        signOut: sinon.stub().returns(Q.resolve())
      };
    });

    $translateProvider.useLoader("customLoader");
  }));
  var $scope, invalidatedStatus, confirmResponse, userState, userAuthFactory, sandbox;
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    confirmResponse = true;
    invalidatedStatus = undefined;
    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();

      userState = $injector.get("userState");
      userAuthFactory = $injector.get("userAuthFactory");

      $controller("SignOutButtonCtrl", {
        $scope : $scope,
        $modal : $injector.get("$modal"),
        uiFlowManager: $injector.get("uiFlowManager"),
        userState: userState,
        userAuthFactory: userAuthFactory
      });
      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should initialize",function(){
    expect($scope).to.be.truely;
    expect($scope.logout).to.exist;
  });

  it("should sign out user: ", function(done) {
    $scope.logout();

    setTimeout(function() {
      expect(invalidatedStatus).to.equal("registrationComplete");
      expect(userAuthFactory.signOut).to.have.not.been.called;

      done();
    }, 10);
  });

  it("should sign out a Custom Auth user: ", function(done) {
    sandbox.stub(userState, "isRiseAuthUser").returns(true);

    $scope.logout();

    setTimeout(function() {
      expect(userAuthFactory.signOut).to.have.been.called;

      done();
    }, 10);
  });

});
