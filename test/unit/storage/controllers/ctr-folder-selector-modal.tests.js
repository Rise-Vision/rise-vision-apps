'use strict';
describe('controller: Folder Selector Modal', function() {
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
    $provide.value('excludedFiles', ['file1', 'file2']);
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy;
  beforeEach(function(){
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $controller('FolderSelectorModalController', {
        $scope : $scope,
        $modalInstance : $modalInstance,
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.selectorType).to.equal('single-folder');
    expect($scope.selectorFilter).to.equal('folders');
    expect($scope.excludedFiles).to.deep.equal(['file1', 'file2']);

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

});
