'use strict';
describe('controller: Storage Selector Modal', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId : function(){
          return companyId;
        }
      };
    });
    $provide.service('plansFactory',function(){
      return {
        showPlansModal: sinon.stub()
      };
    });
  }));
  var $scope, rootScope, companyId;
  beforeEach(function(){
    companyId = 'companyId';
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      rootScope = $rootScope;
      $controller('SubscriptionStatusController', {
        $scope : $scope,
        $rootScope: $rootScope,
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.companyId).to.equal('companyId');
    expect($scope.productCode).to.be.ok;
    expect($scope.productId).to.be.ok;
    expect($scope.subscriptionStatus).to.be.ok;
  });

  it('Should update selected Company Id', function(done) {
    companyId = 'newCompanyId';
    
    rootScope.$broadcast('selectedCompanyChanged', 'newCompanyId');
    
    setTimeout(function() {
      expect($scope.companyId).to.equal('newCompanyId');
      
      done();
    }, 10);
  });

});
