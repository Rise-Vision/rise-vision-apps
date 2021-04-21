"use strict";
describe(" controller: canvaTypePickerController", function() {
  beforeEach(module("risevision.common.components.canva-type-picker"));
  beforeEach(module(function ($provide) {
    $provide.service("$modalInstance",function(){
      return {
        close: sinon.spy(),
        dismiss: sinon.spy()
      };
    });
  }));
  var $scope, $modalInstance;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      $controller("canvaTypePickerController", {
        $scope : $scope,
        $modalInstance : $modalInstance,
      });
      $scope.$digest();
    });
  });
  
  it("should exist",function(){
    expect($scope).to.be.truely;
    expect($scope.designType).to.equal("Flyer");

    expect($scope.ok).to.be.a("function");
    expect($scope.dismiss).to.be.a("function");
  });

  describe("ok:", function() {
    it("should close modal and resolve default design type",function(){
      $scope.ok();
      $scope.$digest();
      $modalInstance.close.should.have.been.calledWith("Flyer");
    });

    it("should close modal and resolve updated design type",function(){
      $scope.designType = "Logo";      
      $scope.ok();
      $scope.$digest();
      $modalInstance.close.should.have.been.calledWith("Logo");
    });
  });

  it("should dismiss modal when clicked on close with no action",function(){
    $scope.dismiss();
    $scope.$digest();
    $modalInstance.dismiss.should.have.been.called;
  });
});
