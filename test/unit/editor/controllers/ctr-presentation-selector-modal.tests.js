'use strict';
describe('controller: Presentation Selector Modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : sinon.spy(),
        dismiss : sinon.spy()
      }
    });
  }));
  var $scope, $modalInstance;
  beforeEach(function(){
    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $controller('PresentationSelectorModal', {
        $scope : $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.select).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should close modal when clicked on a presentation',function(){
    var presentationId = 'presentationId';
    var presentationName = 'presentationName';
    var presentationType = 'presentationType';
    $scope.select(presentationId, presentationName, presentationType);

    $modalInstance.close.should.have.been.calledWith([presentationId, presentationName, presentationType]);
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstance.dismiss.should.have.been.called;
  });

});
