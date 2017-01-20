'use strict';
describe('controller: Storage Selector Modal', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(action){
          return;
        }
      }
    });
    $provide.value('enableByURL', false);
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy;
  beforeEach(function(){
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $controller('StorageSelectorModalController', {
        $scope : $scope,
        $modalInstance : $modalInstance,
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.enableByURL).to.be.false;

    expect($scope.select).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });
  

  it('select: should close modal',function(){
    var file = {name: 'file1.jpg'};
    $scope.select(file);

    $modalInstanceCloseSpy.should.have.been.calledWith(file);
  });

  it('dismiss: should dismiss modal',function(){
    $scope.dismiss();
    
    $modalInstanceDismissSpy.should.have.been.called;
  });
  
  it('FileSelectAction should close modal', function(done) {
    var file = {name: 'file1.jpg'};
    
    $scope.$broadcast('FileSelectAction', file);
    
    setTimeout(function() {
      $modalInstanceCloseSpy.should.have.been.calledWith(file);
      
      done()
    }, 10);
  });

  it('CancelFileSelect should dismiss modal', function(done) {
    
    $scope.$broadcast('CancelFileSelect');
    
    setTimeout(function() {
      $modalInstanceDismissSpy.should.have.been.called;      
      done()
    }, 10);
  });

});
