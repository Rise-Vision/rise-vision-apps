"use strict";
describe("controller: Request Confirmation Email", function() {
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
  }));

  var $scope, $loading, $log, userauth, sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();

      $loading = $injector.get("$loading");
      $log = $injector.get("$log");
      userauth = $injector.get("userauth");

      $controller("RequestConfirmationEmailCtrl", {
        $scope: $scope,
        $log: $log,
        userauth: userauth
      });

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

  describe("requestConfirmationEmail: ", function() {
    it("should show email sent message on success", function(done) {
      sandbox.stub(userauth, "requestConfirmationEmail").returns(Q.resolve());
      $scope.requestConfirmationEmail();

      setTimeout(function() {
        expect(userauth.requestConfirmationEmail).to.have.been.calledWith("username");
        expect($scope.emailSent).to.be.true;
        expect($scope.isGoogleAccount).to.be.false;
        expect($scope.emailAlreadyConfirmed).to.be.false;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.have.been.called;
        done();
      }, 0);
    });

    it("should show email sent message on user not found", function(done) {
      sandbox.stub(userauth, "requestConfirmationEmail").returns(Q.reject({ status: 404 }));
      $scope.requestConfirmationEmail();

      setTimeout(function() {
        expect(userauth.requestConfirmationEmail).to.have.been.calledWith("username");
        expect($scope.emailSent).to.be.true;
        expect($scope.isGoogleAccount).to.be.false;
        expect($scope.emailAlreadyConfirmed).to.be.false;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.not.have.been.called;
        done();
      }, 0);
    });

    it("should show email sent message on error", function(done) {
      sandbox.stub(userauth, "requestConfirmationEmail").returns(Q.reject({ status: 500 }));
      $scope.requestConfirmationEmail();

      setTimeout(function() {
        expect(userauth.requestConfirmationEmail).to.have.been.calledWith("username");
        expect($scope.emailSent).to.be.true;
        expect($scope.isGoogleAccount).to.be.false;
        expect($scope.emailAlreadyConfirmed).to.be.false;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.not.have.been.called;
        done();
      }, 0);
    });

    it("should not show email sent message when Google Account", function(done) {
      sandbox.stub(userauth, "requestConfirmationEmail").returns(Q.reject({ status: 400 }));
      $scope.requestConfirmationEmail();

      setTimeout(function() {
        expect(userauth.requestConfirmationEmail).to.have.been.calledWith("username");
        expect($scope.emailSent).to.be.false;
        expect($scope.isGoogleAccount).to.be.true;
        expect($scope.emailAlreadyConfirmed).to.be.false;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.have.been.called;
        done();
      }, 0);
    });

    it("should not show email sent message when already confirmed", function(done) {
      sandbox.stub(userauth, "requestConfirmationEmail").returns(Q.reject({ status: 409 }));
      $scope.requestConfirmationEmail();

      setTimeout(function() {
        expect(userauth.requestConfirmationEmail).to.have.been.calledWith("username");
        expect($scope.emailSent).to.be.false;
        expect($scope.isGoogleAccount).to.be.false;
        expect($scope.emailAlreadyConfirmed).to.be.true;
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($log.log).to.have.been.called;
        done();
      }, 0);
    });
  });
});
