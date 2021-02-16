"use strict";
describe("controller: Reset Password Confirm", function() {
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

  var $scope, $loading, $log, $state, userauth, sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();

      $loading = $injector.get("$loading");
      $log = $injector.get("$log");
      $state = $injector.get("$state");
      userauth = $injector.get("userauth");

      $controller("ResetPasswordConfirmCtrl", {
        $scope: $scope,
        $log: $log,
        $state: $state,
        $stateParams: { user: "username", token: "token" },
        userauth: userauth
      });

      $scope.forms = {
        resetPasswordForm: {
          $valid: true
        }  
      };

      $scope.credentials.username = "username";
      $scope.$digest();
    });
  });

  afterEach(function () {
    sandbox.restore();
  });
    
  it("should exist", function() {
    expect($scope).to.be.ok;
  });

  describe("resetPassword: ", function() {
    it("should redirect to login on success", function(done) {
      sandbox.stub(userauth, "resetPassword").returns(Q.resolve());
      $scope.credentials.newPassword = "password1";
      $scope.resetPassword();

      setTimeout(function() {
        expect(userauth.resetPassword).to.have.been.calledWith("username", "token", "password1");
        expect($state.go).to.have.been.calledWith("common.auth.unauthorized");
        expect($scope.invalidToken).to.be.false;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.have.been.called;
        done();
      }, 0);
    });

    it("should reject if the form is invalid", function(done) {
      sandbox.stub(userauth, "resetPassword").returns(Q.resolve());
      $scope.forms.resetPasswordForm.$valid = false;
      $scope.resetPassword();

      setTimeout(function() {
        expect(userauth.resetPassword).to.not.have.been.called;
        expect($state.go).to.not.have.been.called;
        expect($scope.invalidToken).to.be.false;
        done();
      }, 0);
    });

    it("should reject invalid tokens", function(done) {
      sandbox.stub(userauth, "resetPassword").returns(Q.reject({ result: { error: { message: "Password reset token does not match" }}}));
      $scope.credentials.newPassword = "password1";
      $scope.resetPassword();

      setTimeout(function() {
        expect(userauth.resetPassword).to.have.been.calledWith("username", "token", "password1");
        expect($state.go).to.not.have.been.called;
        expect($scope.invalidToken).to.be.true;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        done();
      }, 0);
    });

    it("should reject other errors", function(done) {
      sandbox.stub(userauth, "resetPassword").returns(Q.reject({ result: { error: { message: "Other error" }}}));
      $scope.credentials.newPassword = "password1";
      $scope.resetPassword();

      setTimeout(function() {
        expect(userauth.resetPassword).to.have.been.calledWith("username", "token", "password1");
        expect($state.go).to.not.have.been.called;
        expect($scope.invalidToken).to.be.false;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        done();
      }, 0);
    });
  });

  describe("requestPasswordReset: ", function() {
    it("should show email sent message on success", function(done) {
      sandbox.stub(userauth, "requestPasswordReset").returns(Q.resolve());
      $scope.requestPasswordReset();

      setTimeout(function() {
        expect(userauth.requestPasswordReset).to.have.been.calledWith("username");
        expect($scope.emailResetSent).to.be.true;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.have.been.called;
        done();
      }, 0);
    });

    it("should not show email sent message on error", function(done) {
      sandbox.stub(userauth, "requestPasswordReset").returns(Q.reject());
      $scope.requestPasswordReset();

      setTimeout(function() {
        expect(userauth.requestPasswordReset).to.have.been.calledWith("username");
        expect($scope.emailResetSent).to.be.false;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.not.have.been.called;
        done();
      }, 0);
    });
  });
});
