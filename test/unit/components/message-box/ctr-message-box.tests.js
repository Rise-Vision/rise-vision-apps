"use strict";
describe("controller: Message Box", function() {
  var $scope, $modalInstance, title, message, button, $modalInstanceDismissSpy;

  beforeEach(module("risevision.common.components.message-box"));
  beforeEach(module(function ($provide) {
    $provide.service("$modalInstance",function(){
      return {
        dismiss : function(){
          return;
        }
      };
    });

    $provide.value("title", title);
    $provide.value("message", message);
    $provide.value("button", button);
  }));

  beforeEach(function(){
    title = "title";
    message = "message";
    button = "confirmation";

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      $modalInstanceDismissSpy = sinon.spy($modalInstance, "dismiss");
      $controller("messageBoxInstance", {
        $scope : $scope,
        $modalInstance : $modalInstance,
        title: $injector.get("title"),
        message: $injector.get("message"),
        button: $injector.get("button")
      });
      $scope.$digest();
    });
  });

  it("should exist",function(){
    expect($scope).to.be.truely;

    expect($scope.dismiss).to.be.a("function");
  });

  it("should set the scope title",function(){
    expect($scope.title).to.be.truely;
    expect($scope.title).to.equal(title);
  });

  it("should set the scope message",function(){
    expect($scope.message).to.be.truely;
    expect($scope.message).to.equal(message);
  });

  it("should set the scope button",function(){
    expect($scope.button).to.be.truely;
    expect($scope.button).to.equal(button);
  });

  it("should dismiss modal when clicked on close with no action",function(){
    $scope.dismiss();
    $scope.$digest();
    $modalInstanceDismissSpy.should.have.been.calledWith();
  });
});
