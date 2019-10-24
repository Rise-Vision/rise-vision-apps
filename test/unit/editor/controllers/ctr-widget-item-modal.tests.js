'use strict';
describe('controller: Widget Items Modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
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
  }));
  
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy;
  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $controller('WidgetItemModalController', {
        $scope : $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.form).to.be.ok;
    expect($scope.form.url).to.be.undefined;
    expect($scope.form.settingsUrl).to.be.undefined;

    expect($scope.apply).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  describe('$modalInstance functionality: ', function() {

    it('should return form object when apply is called',function(){
      $scope.apply();

      $modalInstanceCloseSpy.should.have.been.calledWith($scope.form);
    });

    it('should dismiss modal when clicked on close with no action',function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });
  });

});
