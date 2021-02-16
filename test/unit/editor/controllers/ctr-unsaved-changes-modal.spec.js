'use strict';
describe('controller: UnsavedChangesModalController', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : function(){},
        dismiss : function(){}
      }
    }); 
    $provide.service('editorFactory',function(){
      return {
        save : function(){
          return Q.resolve();
        }
      }
    });    
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, editorFactory;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      editorFactory = $injector.get('editorFactory');
      
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');

      $controller('UnsavedChangesModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.save).to.be.a('function');
    expect($scope.dontSave).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.editorFactory).to.equal(editorFactory);
  });

  it('should dismiss modal',function(){
      $scope.dismiss();
      $modalInstanceDismissSpy.should.have.been.called;
  });

  it('should close modal after dontSave()',function(){
      $scope.dontSave();
      $modalInstanceCloseSpy.should.have.been.called;
  });

  it('should save presentation and dismiss modal on save()',function(done){
    var saveSpy = sinon.spy(editorFactory,'save');
    $scope.save();
    saveSpy.should.have.been.called;
    setTimeout(function() {
      $modalInstanceDismissSpy.should.have.been.called; 
      done()
    }, 10);
  });

});
