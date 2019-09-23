"use strict";
describe("controller: Confirm Instance", function() {
  beforeEach(module("risevision.common.components.confirm-instance"));
  beforeEach(module(function ($provide) {
    $provide.service("$modalInstance",function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(){
          return;
        }
      };
    });

    $provide.value("confirmationTitle", confirmationTitle);
    $provide.value("confirmationMessage", confirmationMessage);
    $provide.value("confirmationButton", confirmationButton);
    $provide.value("cancelButton", cancelButton);

  }));
  var $scope, $modalInstance, confirmationTitle, confirmationMessage, confirmationButton, cancelButton, $modalInstanceCloseSpy, $modalInstanceDismissSpy;
  beforeEach(function(){
    confirmationTitle = "title";
    confirmationMessage = "message";
    confirmationButton = "confirmation";
    cancelButton = "cancel";

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      $modalInstanceCloseSpy = sinon.spy($modalInstance, "close");
      $modalInstanceDismissSpy = sinon.spy($modalInstance, "dismiss");
      $controller("confirmInstance", {
        $scope : $scope,
        $modalInstance : $modalInstance,
        confirmationTitle: $injector.get("confirmationTitle"),
        confirmationMessage: $injector.get("confirmationMessage"),
        confirmationButton: $injector.get("confirmationButton"),
        cancelButton: $injector.get("cancelButton")
      });
      $scope.$digest();
    });
  });
  
  it("should exist",function(){
    expect($scope).to.be.truely;

    expect($scope.ok).to.be.a("function");
    expect($scope.cancel).to.be.a("function");
    expect($scope.dismiss).to.be.a("function");

  });

  it("should set the scope confirmationTitle",function(){
    expect($scope.confirmationTitle).to.be.truely;
    expect($scope.confirmationTitle).to.equal(confirmationTitle);
  });

  it("should set the scope confirmationMessage",function(){
    expect($scope.confirmationMessage).to.be.truely;
    expect($scope.confirmationMessage).to.equal(confirmationMessage);
  });

  it("should set the scope confirmationButton",function(){
    expect($scope.confirmationButton).to.be.truely;
    expect($scope.confirmationButton).to.equal(confirmationButton);
  });

  it("should default the scope confirmationButton to common.ok",function(){
    var defaultConfirmationButton = "common.ok";
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $controller("confirmInstance", {
        $scope : $scope,
        confirmationButton: undefined
      });
      $scope.$digest();
    });
    expect($scope.confirmationButton).to.be.truely;
    expect($scope.confirmationButton).to.equal(defaultConfirmationButton);
  });

  it("should set the scope cancelButton",function(){
    expect($scope.cancelButton).to.be.truely;
    expect($scope.cancelButton).to.equal(cancelButton);
  });

  it("should default the scope cancelButton to common.cancel",function(){

    var defaultConfirmationButton = "common.cancel";
    inject(function($injector,$rootScope, $controller) {
      $scope = $rootScope.$new();
      $controller("confirmInstance", {
        $scope: $scope,
        cancelButton: undefined
      });
      $scope.$digest();
    });
    expect($scope.cancelButton).to.be.truely;
    expect($scope.cancelButton).to.deep.equal(defaultConfirmationButton);
  });

  it("should close modal when clicked ok",function(){
    $scope.ok();
    $scope.$digest();
    $modalInstanceCloseSpy.should.have.been.called;
  });

  it("should dismiss modal when clicked cancel with a cancel action",function(){
    $scope.cancel();
    $scope.$digest();
    $modalInstanceDismissSpy.should.have.been.calledWith("cancel");
  });

  it("should dismiss modal when clicked on close with no action",function(){
    $scope.dismiss();
    $scope.$digest();
    $modalInstanceDismissSpy.should.have.been.calledWith();
  });
});
