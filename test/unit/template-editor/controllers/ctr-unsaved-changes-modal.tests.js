'use strict';
describe('controller: TemplateEditorUnsavedChangesModalController', function() {
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : function(){},
        dismiss : function(){}
      }
    }); 
    $provide.service('templateEditorFactory',function(){
      return {
        save : function(){
          return Q.resolve();
        }
      }
    });    
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, templateEditorFactory;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      templateEditorFactory = $injector.get('templateEditorFactory');
      
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');

      $controller('TemplateEditorUnsavedChangesModalController', {
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
    expect($scope.templateEditorFactory).to.equal(templateEditorFactory);
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
    var saveSpy = sinon.spy(templateEditorFactory,'save');
    $scope.save();
    saveSpy.should.have.been.called;
    setTimeout(function() {
      $modalInstanceCloseSpy.should.have.been.called; 
      done()
    }, 10);
  });

});
