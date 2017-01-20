'use strict';
describe('controller: GoToStoreModalController', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    product = {};
    $provide.service('$modalInstance',function(){
      return {
        close : function(){},
        dismiss : function(){}
      }
    });    
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, product;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');

      $controller('GoToStoreModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance,
        product: product
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.close).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.product).to.equal(product);
  });

  it('should close modal',function(){
      $scope.close();
      $modalInstanceCloseSpy.should.have.been.called;
  });

  it('should dismiss modal',function(){
      $scope.dismiss();
      $modalInstanceDismissSpy.should.have.been.called;
  });

});
