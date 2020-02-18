"use strict";

/*jshint -W030 */
/*global sinon*/

describe("controller: registration modal", function() {
  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.service("$modalInstance",function(){
      return {
        _closed: false,
        close: function(reason) {
          expect(reason).to.equal("success");          
          this._closed = true;
        }
      };
    });
  
    $provide.service("userState", function(){
      return {
        getCopyOfProfile : function(){
          return userProfile;
        },
        getUsername: function() {
          return "e@mail.com";
        },
        _restoreState : function(){
          
        },
        getUserCompanyId : function(){
          return "some_company_id";
        },
        getUserCompanyName: function() {
          return "company_name";
        },
        updateCompanySettings: sinon.stub(),
        refreshProfile: function() {
          var deferred = Q.defer();
          
          deferred.resolve({});
          
          return deferred.promise;
        }
      };
    });

    $provide.service("updateCompany",function(){
      return function(companyId, company){
        updateCompanyCalled = company.name;

        return Q.resolve("companyResult");
      };
    });
    
    var registrationService = function(calledFrom){
      return function() {
        newUser = calledFrom === "addAccount";
        var deferred = Q.defer();
        
        if(registerUser){
          deferred.resolve("registered");
        }else{
          deferred.reject("ERROR");
        }
        return deferred.promise;
      };
    };
    
    $provide.service("addAccount", function(){
      return registrationService("addAccount");
    });
    $provide.service("agreeToTermsAndUpdateUser", function() {
      return registrationService("agreeToTerms");
    });

    $provide.service("plansFactory", function() {
      return plansFactory = {
        initVolumePlanTrial: sinon.spy()
      };
    });

    $provide.service("analyticsFactory", function() { 
      return {
        track: function(name) {
          trackerCalled = name;
        },
        load: function() {}
      };
    });

    $provide.service("$exceptionHandler",function(){
      return sinon.spy();
    });

    $provide.service("bigQueryLogging", function() { 
      return {
        logEvent: function(name) {
          bqCalled = name;
        }
      };
    });

    $provide.service("analyticsEvents", function() { 
      return {
        initialize: function() {},
        identify: function() {}
      };
    });

    $provide.factory("customLoader", function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });

    $provide.factory("messageBox", function() {
      return function() {};
    });
    $translateProvider.useLoader("customLoader");
        
  }));
  var $scope, userProfile, userState, $modalInstance, newUser;
  var registerUser, account, trackerCalled, bqCalled, identifySpy,
    updateCompanyCalled, plansFactory;
  
  beforeEach(function() {
    registerUser = true;
    trackerCalled = undefined;
    bqCalled = undefined;
    userProfile = {
      id : "RV_user_id",
      firstName : "first",
      lastName : "last",
      telephone : "telephone"
    };
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      var analyticsEvents = $injector.get("analyticsEvents");
      identifySpy = sinon.spy(analyticsEvents,"identify");
      userState = $injector.get("userState");
      $controller("RegistrationModalCtrl", {
        $scope : $scope,
        $modalInstance: $modalInstance,
        $cookies: $injector.get("$cookies"),
        userState : userState,
        updateCompany: $injector.get("updateCompany"),
        agreeToTermsAndUpdateUser:$injector.get("agreeToTermsAndUpdateUser"),
        addAccount:$injector.get("addAccount"),
        account: account
      });
      $scope.$digest();
      $scope.forms = {
        registrationForm: {
          accepted: {},
          firstName: {},
          lastName: {},
          companyName: {},
          companyIndustry: {},
          email: {}
        }
      };
    });
  });
  
  it("should initialize",function(){
    expect($scope).to.be.truely;
    expect($scope.profile).to.be.truely;
    
    expect($scope.profile).to.deep.equal({
      email: "e@mail.com",
      firstName: "first",
      lastName: "last",
      mailSyncEnabled: false,
      accepted: false
    });

    expect($scope.registering).to.be.false;

    expect($scope.save).to.exist;
  });
  
  describe("save new user: ", function() {      
    it("should not save if form is invalid", function() {
      $scope.forms.registrationForm.$invalid = true;
      $scope.save();
      expect($scope.registering).to.be.false;        
    });

    it("should use username as email",function(){
      expect($scope.profile.email).to.be.equal("e@mail.com");
    });
    
    it("should register user and close the modal",function(done){
      $scope.forms.registrationForm.$invalid = false;
      $scope.save();
      expect($scope.registering).to.be.true;
      
      var profileSpy = sinon.spy(userState, "refreshProfile");
      setTimeout(function() {
        expect(newUser).to.be.true;
        plansFactory.initVolumePlanTrial.should.have.been.called;
        identifySpy.should.have.been.called;
        expect(trackerCalled).to.equal("User Registered");
        expect(bqCalled).to.equal("User Registered");

        expect($scope.registering).to.be.false;
        expect($modalInstance._closed).to.be.true;

        expect(profileSpy.called).to.be.true;

        done();
      },10);
    });

    it("should handle failure to create user",function(done){
      registerUser = false;
      $scope.forms.registrationForm.$invalid = false;
      $scope.save();
      
      var profileSpy = sinon.spy(userState, "refreshProfile");
      setTimeout(function(){
        expect(newUser).to.be.true;
        plansFactory.initVolumePlanTrial.should.not.have.been.called;
        identifySpy.should.not.have.been.called;
        expect(trackerCalled).to.not.be.ok;
        expect(bqCalled).to.not.be.ok;
        expect($scope.registering).to.be.false;
        expect($modalInstance._closed).to.be.false;

        expect(profileSpy.called).to.be.true;

        done();
      },10);
    });
  
  });
    
  describe("save existing user: ", function() {
    beforeEach(function() {
      account = userProfile;
    });
    
    it("should not save if form is invalid", function() {
      $scope.forms.registrationForm.$invalid = true;
      $scope.save();
      expect($scope.registering).to.be.false;        
    });
    
    it("should register user and close the modal",function(done){
      $scope.forms.registrationForm.$invalid = false;
      $scope.save();
      expect($scope.registering).to.be.true;
      
      var profileSpy = sinon.spy(userState, "refreshProfile");
      setTimeout(function() {
        expect(newUser).to.be.false;
        plansFactory.initVolumePlanTrial.should.not.have.been.called;
        identifySpy.should.have.been.called;
        expect(trackerCalled).to.equal("User Registered");
        expect(bqCalled).to.equal("User Registered");
        expect($scope.registering).to.be.false;
        expect($modalInstance._closed).to.be.true;

        expect(profileSpy.called).to.be.true;

        done();
      },10);
    });
    
    it("should handle failure to create user",function(done){
      registerUser = false;
      $scope.forms.registrationForm.$invalid = false;
      $scope.save();
      
      var profileSpy = sinon.spy(userState, "refreshProfile");
      setTimeout(function(){
        expect(newUser).to.be.false;
        expect(trackerCalled).to.not.be.ok;
        expect(bqCalled).to.not.be.ok;
        expect($scope.registering).to.be.false;
        expect($modalInstance._closed).to.be.false;

        expect(profileSpy.called).to.be.true;

        done();
      },10);
    });
      
  });

});
  
