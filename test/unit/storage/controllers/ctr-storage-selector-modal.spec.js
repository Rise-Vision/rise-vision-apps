'use strict';
describe('controller: Storage Selector Modal', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(){
          return;
        }
      }
    });
    $provide.value('enableByURL', false);
    $provide.value('selectorType', 'type');
    $provide.value('selectorFilter', 'filter');
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
    expect($scope.selectorType).to.equal('type');
    expect($scope.selectorFilter).to.equal('filter');

    expect($scope.selectByUrl).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
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

  it('selectByUrl should close modal', function(done) {
    
    $scope.selectByUrl();
    
    setTimeout(function() {
      $modalInstanceCloseSpy.should.have.been.called;      
      done()
    }, 10);
  });

});
