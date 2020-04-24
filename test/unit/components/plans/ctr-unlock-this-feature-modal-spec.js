"use strict";

describe("controller: unlock this feature modal", function() {
  beforeEach(module("risevision.common.components.plans"));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        dismiss: sinon.stub()
      }
    });  
    $provide.service('plansFactory',function(){
      return {
        showPlansModal: sinon.stub()
      }
    });    
  }));
  var $scope, $modalInstance, plansFactory;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      plansFactory = $injector.get('plansFactory');      

      $controller('UnlockThisFeatureModalCtrl', {
        $scope: $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.dismiss).to.be.a('function');
    expect($scope.subscribe).to.be.a('function');
  });

  describe('dismiss', function() {
    it('should dismiss modal',function(){
        $scope.dismiss();
        $modalInstance.dismiss.should.have.been.called;
    });
  });

  describe('subscribe:', function() {
    it('should open plan subscribe modal and dismiss',function(){
        $scope.subscribe();

        plansFactory.showPlansModal.should.have.been.called;
        $modalInstance.dismiss.should.have.been.called;
    });
  });

});
