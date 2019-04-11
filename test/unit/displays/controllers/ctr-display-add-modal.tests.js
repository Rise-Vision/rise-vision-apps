'use strict';
describe('controller: display add modal', function() {
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        dismiss : sinon.spy()
      }
    });

  }));

  var $scope, $modalInstance;
  beforeEach(function() {    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');

      $controller('displayAddModal', {
        $scope : $scope,
        $modalInstance: $modalInstance,
        downloadOnly: true
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;

    expect($scope.setCurrentPage).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should initialize for downloadOnly', function() {
    expect($scope.currentPage).to.equal('displayAdded');
  });

  it('should set Current Tab', function() {
    $scope.setCurrentPage('somethingElse');

    expect($scope.currentPage).to.equal('somethingElse');
  })

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstance.dismiss.should.have.been.called;
  });

});
