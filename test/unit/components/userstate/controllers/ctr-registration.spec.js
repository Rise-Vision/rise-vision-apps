"use strict";

/*jshint -W030 */
/*global sinon*/

describe("controller: registration", function() {
  beforeEach(module("risevision.common.components.userstate"));
  beforeEach(module(function ($provide) {
    $provide.service("userState", function(){
      return {
        getCopyOfProfile: function() {
          return {
            creationDate: 'creationDate'
          };
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
        },
        getCopyOfUserCompany: function() {
          return {
            parentId: "parentId"
          };
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

    $provide.service("currentPlanFactory", function() {
      return currentPlanFactory = {
        initVolumePlanTrial: sinon.spy()
      };
    });

    $provide.service("analyticsFactory", function() { 
      return {
        track: sinon.stub(),
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

    $provide.factory("customLoader", function ($q) {
      return function () {
        return Q.resolve({});
      };
    });

    $provide.factory("messageBox", function() {
      return function() {};
    });

    $provide.factory("hubspot", function() {
      return {
        loadAs: sinon.stub()
      };
    });

    $provide.factory('account', function() {
      return account;
    });

    $provide.value('COMPANY_INDUSTRY_FIELDS', []);
  }));
  var $scope, userState, newUser;
  var registerUser, account, analyticsFactory, bqCalled,
    updateCompanyCalled, currentPlanFactory, hubspot;
  
  beforeEach(function() {
    registerUser = true;
    bqCalled = undefined;
    account = {
      id : "RV_user_id",
      firstName : "first",
      lastName : "last",
      telephone : "telephone"
    };
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      analyticsFactory = $injector.get("analyticsFactory");
      userState = $injector.get("userState");
      hubspot = $injector.get('hubspot');
      $controller("RegistrationCtrl", {
        $scope: $scope,
        account: account,
        newUser: true
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
    expect($scope).to.be.ok;
    expect($scope.profile).to.be.ok;
    
    expect($scope.profile).to.deep.equal({
      email: "e@mail.com",
      firstName: "first",
      lastName: "last"
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
        currentPlanFactory.initVolumePlanTrial.should.have.been.called;
        expect(analyticsFactory.track).to.have.been.calledWith("User Registered",{
          companyId: "some_company_id",
          companyName: "company_name",
          parentId: "parentId",
          isNewCompany: true,
          registeredDate: "creationDate",
          invitationAcceptedDate: null
        });
        expect(bqCalled).to.equal("User Registered");
        hubspot.loadAs.should.have.been.calledWith('e@mail.com');
        expect($scope.registering).to.be.false;

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
        currentPlanFactory.initVolumePlanTrial.should.not.have.been.called;
        expect(analyticsFactory.track).to.not.have.been.called;
        expect(bqCalled).to.not.be.ok;
        hubspot.loadAs.should.not.have.been.called;
        expect($scope.registering).to.be.false;

        expect(profileSpy.called).to.be.true;

        done();
      },10);
    });

    describe('mailSyncEnabled', function() {
      it('should enable for education', function() {
        $scope.forms.registrationForm.$invalid = false;
        $scope.company.companyIndustry = 'PRIMARY_SECONDARY_EDUCATION';
        $scope.save();
        
        expect($scope.profile.mailSyncEnabled).to.be.true;
      });

      it('should disable for non education', function() {
        $scope.forms.registrationForm.$invalid = false;
        $scope.company.companyIndustry = 'MISC';
        $scope.save();
        
        expect($scope.profile.mailSyncEnabled).to.be.false;
      });

      it('should not override existing subscription', function() {
        $scope.forms.registrationForm.$invalid = false;
        $scope.profile.mailSyncEnabled = true
        $scope.company.companyIndustry = 'MISC';
        $scope.save();
        
        expect($scope.profile.mailSyncEnabled).to.be.true;
      });
    });

  });
    
  describe("save existing user: ", function() {
    beforeEach(function() {
      inject(function($controller){
        $controller("RegistrationCtrl", {
          $scope: $scope,
          account: account,
          newUser: false
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
        currentPlanFactory.initVolumePlanTrial.should.not.have.been.called;
        expect(analyticsFactory.track).to.have.been.calledWithMatch("User Registered",{
          companyId: "some_company_id",
          companyName: "company_name",
          parentId: "parentId",
          isNewCompany: false,
          registeredDate: "creationDate"
        });
        expect(analyticsFactory.track.getCall(0).args[1].invitationAcceptedDate).to.be.a('date');
        expect(bqCalled).to.equal("User Registered");
        hubspot.loadAs.should.have.been.calledWith('e@mail.com');
        expect($scope.registering).to.be.false;

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
        expect(analyticsFactory.track).to.not.have.been.called;
        expect(bqCalled).to.not.be.ok;
        hubspot.loadAs.should.not.have.been.called;
        expect($scope.registering).to.be.false;

        expect(profileSpy.called).to.be.true;

        done();
      },10);
    });

    describe('mailSyncEnabled', function() {
      it('should enable for education', function() {
        $scope.forms.registrationForm.$invalid = false;
        account.companyIndustry = 'PRIMARY_SECONDARY_EDUCATION';
        $scope.save();
        
        expect($scope.profile.mailSyncEnabled).to.be.true;
      });

      it('should disable for non education', function() {
        $scope.forms.registrationForm.$invalid = false;
        account.companyIndustry = 'MISC';
        $scope.save();
        
        expect($scope.profile.mailSyncEnabled).to.be.false;
      });

      it('should not override existing subscription', function() {
        $scope.forms.registrationForm.$invalid = false;
        $scope.profile.mailSyncEnabled = true
        account.companyIndustry = 'MISC';
        $scope.save();
        
        expect($scope.profile.mailSyncEnabled).to.be.true;
      });

    });

  });

});
  
