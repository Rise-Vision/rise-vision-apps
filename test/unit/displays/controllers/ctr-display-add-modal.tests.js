'use strict';
describe('controller: display add modal', function() {
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        dismiss : sinon.spy()
      }
    });
    $provide.service('displayFactory',function(){
      return {
        display: 'display'
      };
    });

  }));

  var $scope, $modalInstance, displayFactory;
  beforeEach(function() {    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();

      $modalInstance = $injector.get('$modalInstance');
      displayFactory = $injector.get('displayFactory');

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

    expect($scope.display).to.equal('display');

    expect($scope.setCurrentPage).to.be.a('function');
    expect($scope.showPreviousPage).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should initialize for downloadOnly', function() {
    expect($scope.currentPage).to.equal('displayAdded');
  });

  it('should update display when notified', function() {
    displayFactory.display = 'updatedDisplay';

    $scope.$broadcast('displayCreated');

    $scope.$digest();

    expect($scope.display).to.equal('updatedDisplay');
  });

  it('should set Current Tab', function() {
    $scope.setCurrentPage('somethingElse');

    expect($scope.currentPage).to.equal('somethingElse');
  });

  it('should show Previous Tab', function() {
    $scope.setCurrentPage('somethingElse');

    expect($scope.currentPage).to.equal('somethingElse');

    $scope.showPreviousPage();

    expect($scope.currentPage).to.equal('displayAdded');
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstance.dismiss.should.have.been.called;
  });

});
