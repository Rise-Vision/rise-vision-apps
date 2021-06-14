"use strict";

/*jshint -W030 */

describe("controller: Company Role Modal", function() {
  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.service("$modalInstance",function(){
      return {
        close: sinon.stub()
      };
    });
    $provide.value("user", {
      username: "user@example.io",
      
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
  var $scope, $modalInstance;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");

      $controller("CompanyRoleModalCtrl", {
        $scope : $scope,
        $modalInstance: $modalInstance,
      });
      $scope.$digest();
    });
  });
    
  it("should exist", function() {
    expect($scope).to.be.ok;
    expect($scope.user).to.be.ok;

    expect($scope).to.have.property("COMPANY_ROLE_FIELDS");

    expect($scope.save).to.exist;
  });

  it("should initialize", function() {
    expect($scope.user.username).to.equal("user@example.io");
    
    expect($scope.COMPANY_ROLE_FIELDS).to.have.length(16);
  });
  
  it("should close modal on save and send user objects", function() {
    $scope.save();

    $modalInstance.close.should.have.been.calledWith({
      user: {
        username: "user@example.io"
      }
    });
  });

});
  
