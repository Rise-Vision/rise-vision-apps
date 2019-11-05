"use strict";
describe("controller: Log In", function() {
  beforeEach(module("risevision.common.components.userstate"));
  beforeEach(module(function ($provide) {
    $provide.service("userAuthFactory", function() {
      return {
        authenticate: sinon.stub().returns(Q.resolve({}))
      };
    });
    $provide.service("customAuthFactory", function() {
      return {
        addUser: sinon.stub().returns(Q.reject({})),
        login: sinon.stub().returns(Q.reject({}))
      };
    });
    
    $provide.service("urlStateService", function() {
      return urlStateService = {
        redirectToState: sinon.spy()
      };
    });
    $provide.value("$stateParams", {
      state: "currentState",
      isSignUp: "isSignUp",
      joinAccount: "joinAccount",
      companyName: "companyName"
    });

    $provide.service("uiFlowManager",function(){
      return {
        invalidateStatus : sinon.spy()
      };
    });
    $provide.service("$loading",function(){
      return {
        startGlobal : sinon.spy(),
        stopGlobal : sinon.spy()
      };
    });
    
  }));
  var $scope, $loading, uiFlowManager, urlStateService, customAuthFactory, userAuthFactory;
  beforeEach(function () {
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      
      $loading = $injector.get("$loading");
      uiFlowManager = $injector.get("uiFlowManager");
      customAuthFactory = $injector.get("customAuthFactory");
      userAuthFactory = $injector.get("userAuthFactory");

      $controller("LoginCtrl", {
        $scope: $scope,
        $state: $injector.get("$state"),
        $loading: $loading,
        uiFlowManager: uiFlowManager
      });
      $scope.$digest();
      
      $scope.credentials = {
        username: "testUser"
      };
      $scope.forms = {
        loginForm: {
          $valid: true
        }  
      };
    });
  });

  it("should exist", function() {
    expect($scope).to.be.ok;
    expect($scope.googleLogin).to.be.a("function");
    expect($scope.customLogin).to.be.a("function");
  });

  it("should initialize scope", function() {
    expect($scope.isSignUp).to.equal("isSignUp");
    expect($scope.joinAccount).to.equal("joinAccount");
    expect($scope.companyName).to.equal("companyName");
  });

  describe("googleLogin: ", function() {
    it("should handle successful login", function(done) {
      userAuthFactory.authenticate.returns(Q.resolve());

      $scope.googleLogin("endStatus");
      
      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");

      setTimeout(function(){
        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        done();
      },10);
    });
    
    it("should handle login failure", function(done) {
      $scope.googleLogin("endStatus");
      
      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");

      setTimeout(function(){
        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        done();
      },10);
    });
  });
  
  describe("customLogin: ", function() {
    it("should clear previous errors", function() {
      $scope.errors = {
        someError: true
      };
      $scope.customLogin("endStatus");

      expect($scope.errors.someError).to.not.be.ok;
    });

    it("should not submit if form is invalid", function(done) {
      $scope.forms.loginForm.$valid = false;
      $scope.customLogin("endStatus");
      
      $loading.startGlobal.should.not.have.been.called;

      setTimeout(function(){
        expect($scope.errors.loginError).to.not.be.ok;

        done();
      },10);
    });

    it("should handle successful login", function(done) {
      customAuthFactory.login.returns(Q.resolve());

      $scope.customLogin("endStatus");
      
      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");
      customAuthFactory.login.should.have.been.calledWith($scope.credentials);

      setTimeout(function(){
        userAuthFactory.authenticate.should.have.been.calledWith(true);

        urlStateService.redirectToState.should.have.been.calledWith("currentState");

        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        expect($scope.errors.loginError).to.not.be.ok;

        done();
      },10);
    });
    
    it("should handle login failure", function(done) {
      $scope.customLogin("endStatus");
      
      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");

      setTimeout(function(){
        userAuthFactory.authenticate.should.not.have.been.called;

        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        expect($scope.errors.loginError).to.be.true;
        expect($scope.messages.isGoogleAccount).to.be.falsey;

        done();
      },10);
    });

    it("should handle authenticate failure", function(done) {
      customAuthFactory.login.returns(Q.resolve());
      userAuthFactory.authenticate.returns(Q.reject({}));

      $scope.customLogin("endStatus");
      
      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");
      customAuthFactory.login.should.have.been.calledWith($scope.credentials);

      setTimeout(function(){
        userAuthFactory.authenticate.should.have.been.calledWith(true);

        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        expect($scope.errors.loginError).to.be.true;
        expect($scope.messages.isGoogleAccount).to.be.falsey;

        done();
      },10);
    });

    it("should reject login of Google accounts", function(done) {
      customAuthFactory.login.returns(Q.reject({ status: 400 }));
      $scope.customLogin("endStatus");

      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");

      setTimeout(function(){
        userAuthFactory.authenticate.should.not.have.been.called;

        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        expect($scope.errors.loginError).to.be.falsey;
        expect($scope.messages.isGoogleAccount).to.be.true;

        done();
      },10);
    });

  });

  describe("createAccount: ", function() {
    it("should clear previous errors", function() {
      $scope.errors = {
        someError: true
      };
      $scope.createAccount("endStatus");

      expect($scope.errors.someError).to.not.be.ok;
    });

    it("should not submit if form is invalid", function(done) {
      $scope.forms.loginForm.$valid = false;
      $scope.createAccount("endStatus");
      
      $loading.startGlobal.should.not.have.been.called;

      setTimeout(function(){
        expect($scope.errors.loginError).to.not.be.ok;

        done();
      },10);
    });

    it("should handle successful account creation and login user", function(done) {
      customAuthFactory.addUser.returns(Q.resolve());

      $scope.createAccount("endStatus");
      
      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");
      customAuthFactory.addUser.should.have.been.calledWith($scope.credentials);

      setTimeout(function(){
        userAuthFactory.authenticate.should.have.been.calledWith(true);

        urlStateService.redirectToState.should.have.been.calledWith("currentState");

        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        expect($scope.errors.loginError).to.not.be.ok;

        done();
      },10);
    });
    
    it("should handle failure to create account", function(done) {
      $scope.createAccount("endStatus");
      
      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");

      setTimeout(function(){
        userAuthFactory.authenticate.should.not.have.been.called;

        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        expect($scope.errors.signupError).to.be.true;
        expect($scope.errors.duplicateError).to.be.falsey;

        done();
      },10);
    });

    it("should handle authenticate failure", function(done) {
      customAuthFactory.addUser.returns(Q.resolve());
      userAuthFactory.authenticate.returns(Q.reject({}));

      $scope.createAccount("endStatus");
      
      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");
      customAuthFactory.addUser.should.have.been.calledWith($scope.credentials);

      setTimeout(function(){
        userAuthFactory.authenticate.should.have.been.calledWith(true);

        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        expect($scope.errors.signupError).to.be.true;
        expect($scope.errors.duplicateError).to.be.falsey;

        done();
      },10);
    });

    it("should reject on failure to register user", function(done) {
      customAuthFactory.addUser.returns(Q.reject({ status: 409 }));
      $scope.createAccount("endStatus");

      $loading.startGlobal.should.have.been.calledWith("auth-buttons-login");

      setTimeout(function(){
        userAuthFactory.authenticate.should.not.have.been.called;

        $loading.stopGlobal.should.have.been.calledWith("auth-buttons-login");
        uiFlowManager.invalidateStatus.should.have.been.calledWith("endStatus");

        expect($scope.errors.signupError).to.be.falsey;
        expect($scope.errors.duplicateError).to.be.true;

        done();
      },10);
    });

  });

});
