'use strict';
describe('controller: AutoScheduleModalController', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    presentationName = {};
    $provide.service('$modalInstance',function(){
      return {
        dismiss : function(){}
      }
    });  
    $provide.service('displayFactory',function(){
      return displayFactory = {}
    });    
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, presentationName, displayFactory;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');

      $controller('AutoScheduleModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance,
        presentationName: presentationName
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.dismiss).to.be.a('function');
    expect($scope.presentationName).to.equal(presentationName);
    expect($scope.displayFactory).to.equal(displayFactory);
  });

  it('should dismiss modal',function(){
      $scope.dismiss();
      $modalInstanceDismissSpy.should.have.been.called;
  });

});
