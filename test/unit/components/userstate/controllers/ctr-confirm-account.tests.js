"use strict";
describe("controller: Confirm Account", function() {
  beforeEach(module("risevision.common.components.userstate"));
  beforeEach(module(function ($provide) {
    $provide.service("$loading",function() {
      return {
        startGlobal: sandbox.spy(),
        stopGlobal: sandbox.spy()
      };
    });
    $provide.service("$log",function() {
      return {
        log: sandbox.spy(),
        error: sandbox.spy()
      };
    });
    $provide.service("$state",function() {
      return {
        go: sandbox.spy()
      };
    });
  }));

  var $scope, $loading, $log, $state, userauth, sandbox, initializeController;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();

      $loading = $injector.get("$loading");
      $log = $injector.get("$log");
      $state = $injector.get("$state");
      userauth = $injector.get("userauth");

      initializeController = function() {
        $controller("ConfirmAccountCtrl", {
          $scope: $scope,
          $log: $log,
          $state: $state,
          $stateParams: { user: "username", token: "token" },
          userauth: userauth
        });

        $scope.$digest();
      };
    });
  });

  afterEach(function () {
    sandbox.restore();
  });
    
  it("should exist", function() {
    expect($scope).to.be.ok;
  });

  describe("confirmUserCreation: ", function() {
    it("should redirect to login on success", function(done) {
      sandbox.stub(userauth, "confirmUserCreation").returns(Q.resolve());
      initializeController();

      setTimeout(function() {
        expect(userauth.confirmUserCreation).to.have.been.calledWith("username", "token");
        expect($state.go).to.have.been.calledWith("common.auth.unauthorized");
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.have.been.called;
        done();
      }, 0);
    });

    it("should redirect to login on error", function(done) {
      sandbox.stub(userauth, "confirmUserCreation").returns(Q.reject());
      initializeController();

      setTimeout(function() {
        expect(userauth.confirmUserCreation).to.have.been.calledWith("username", "token");
        expect($state.go).to.have.been.calledWith("common.auth.unauthorized");
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.not.have.been.called;
        done();
      }, 0);
    });
  });
});
