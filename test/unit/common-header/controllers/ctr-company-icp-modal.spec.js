"use strict";

/*jshint -W030 */

describe("controller: Company ICP Modal", function() {
  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.service("$modalInstance",function(){
      return {
        close: sinon.stub()
      };
    });
    $provide.value("company", {
      name: "Test Company",
      companyIndustry: "HOSPITALITY"
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

      $controller("CompanyIcpModalCtrl", {
        $scope : $scope,
        $modalInstance: $modalInstance,
      });
      $scope.$digest();
    });
  });
    
  it("should exist", function() {
    expect($scope).to.be.ok;
    expect($scope.company).to.be.ok;

    expect($scope).to.have.property("DROPDOWN_INDUSTRY_FIELDS");

    expect($scope.save).to.exist;
  });

  it("should initialize", function() {
    expect($scope.company.name).to.equal("Test Company");
    
    expect($scope.DROPDOWN_INDUSTRY_FIELDS).to.have.length(24);
  });
  
  it("should close modal on save and send company objects", function() {
    $scope.save();

    $modalInstance.close.should.have.been.calledWith({
      company: {
        name: "Test Company",
        companyIndustry: "HOSPITALITY"
      }
    });
  });

});
  
