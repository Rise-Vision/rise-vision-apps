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
    $provide.service("userState", function() {
      return {
        getCopyOfProfile: sandbox.stub().returns({}),
        updateUserProfile: sandbox.spy(),
        _restoreState: function() {}
      };
    });

  }));

  var $scope, $loading, userauth, userState, sandbox, initializeController;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();

      $loading = $injector.get("$loading");
      userauth = $injector.get("userauth");
      userState = $injector.get("userState");

      initializeController = function() {
        $controller("ConfirmAccountCtrl", {
          $scope: $scope,
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

  it("should initialize scope", function() {
    sandbox.stub(userauth, "confirmUserCreation").returns(Q.resolve());
    initializeController();

    expect($scope.username).to.equal('username');
  });

  describe("confirmUserCreation: ", function() {
    it("should redirect to login on success", function(done) {
      sandbox.stub(userauth, "confirmUserCreation").returns(Q.resolve());
      initializeController();

      setTimeout(function() {
        expect(userauth.confirmUserCreation).to.have.been.calledWith("username", "token");
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($scope.apiError).to.not.be.ok;
        done();
      }, 0);
    });

    it("should update profile on success", function(done) {
      sandbox.stub(userauth, "confirmUserCreation").returns(Q.resolve());
      initializeController();

      setTimeout(function() {
        userState.getCopyOfProfile.should.have.been.calledWith(true);
        userState.updateUserProfile.should.have.been.calledWith({userConfirmed: true});

        done();
      }, 0);
    });

    it("should redirect to login on error", function(done) {
      sandbox.stub(userauth, "confirmUserCreation").returns(Q.reject());
      initializeController();

      setTimeout(function() {
        expect(userauth.confirmUserCreation).to.have.been.calledWith("username", "token");
        expect($loading.startGlobal).to.have.been.called;
        expect($loading.stopGlobal).to.have.been.called;
        expect($scope.apiError).to.be.ok;
        done();
      }, 0);
    });
  });
});
