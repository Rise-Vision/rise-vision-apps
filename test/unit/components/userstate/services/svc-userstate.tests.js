/*jshint expr:true */

"use strict";

describe("Services: userState", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    
    $provide.factory("companyState", function() {
      companyState = {};
      
      companyMethods.forEach(function (method) {
        companyState[method] = sinon.spy();
      });

      return companyState;
    });
    
    $provide.factory("getUserProfile", function() {
      return function(username, refreshProfile) {
        expect(refreshProfile).to.be.true;

        if (returnResult){
          return Q.resolve({username: username});
        }else{
          return Q.reject("Error retrieving profile");
        }
      };
    });
    
    $provide.value("$location", {
      search: function () {
        return {
          inRVA: "true"
        };
      },
      path: function () {
        return "";
      },
      url: function() {
        return "";
      }
    });
    
    $provide.factory("localStorageService", function() {
      return localStorageService = {
        set: sinon.spy(),
        get: sinon.spy(),
        remove: sinon.spy()
      };
    });

    $provide.factory("rvTokenStore", function () {
      return {
        read: function() {
          return "testToken";
        }
      };
    });
    
  }));
  
  var userState, companyState, userMethods, companyMethods, returnResult, 
  localStorageService, $broadcastSpy;
  
  beforeEach(function() {
    returnResult = true;

    companyMethods = ["getUserCompanyId", "getUserCompanyName", 
      "getSelectedCompanyId", "getSelectedCompanyName", 
      "getSelectedCompanyCountry", "getCopyOfUserCompany", 
      "getCopyOfSelectedCompany", "isSubcompanySelected", 
      "isTestCompanySelected", "isRootCompany", "updateCompanySettings", 
      "updateUserCompanySettings", "resetCompany", "switchCompany", 
      "isSeller", "isEducationCustomer", "isDiscountCustomer"];

    userMethods = ["getUsername", "getUserEmail", "getCopyOfProfile", 
      "getUserPicture", "hasRole", "inRVAFrame", "isRiseAdmin", 
      "isRiseStoreAdmin", "isUserAdmin", "isPurchaser", "isRiseVisionUser", 
      "isLoggedIn", "getAccessToken", "checkUsername", "updateUserProfile", 
      "refreshProfile",
      // private
      "_restoreState", "_resetState", "_persistState"];
      
    inject(function($injector){
      var $rootScope = $injector.get("$rootScope");
      userState = $injector.get("userState");
      $broadcastSpy = sinon.spy($rootScope, "$broadcast");
    });
  });

  describe("should exist, also methods: ", function() {
    it("userState methods", function() {
      expect(userState._state).to.be.ok;
      expect(userState._state).to.be.an("object");

      userMethods.forEach(function (method) {
        expect(userState[method]).to.be.ok;
        expect(userState).to.have.property(method);
        expect(userState[method]).to.be.a("function");
      });
    });

    it("should proxy companyState functionality", function() {
      companyMethods.forEach(function(method) {
        expect(userState[method]).to.be.ok;
        expect(userState).to.have.property(method);
        expect(userState[method]).to.be.a("function");
        
        userState[method]();
        
        companyState[method].should.have.been.calledOnce;
      });
    });
    
    it("should inititalize _state (variable): ", function() {
      expect(userState._state).to.be.ok;
      
      expect(userState._state.profile).to.be.ok;
      expect(userState._state.profile).to.be.an("object");
      
      expect(userState._state.user).to.be.ok;
      expect(userState._state.user).to.be.an("object");

      expect(userState._state.roleMap).to.be.ok;
      expect(userState._state.roleMap).to.be.an("object");
      
      expect(userState._state.userToken).to.be.ok;
      expect(userState._state.userToken).to.be.equal("testToken");

      expect(userState._state.inRVAFrame).to.be.true;
    });

  });
  
  describe("refreshProfile: ", function() {
    beforeEach(function() {
      companyState.init = sinon.spy(function() { return Q.resolve("initialized"); });
      userState.updateUserProfile = sinon.stub();
      
      userState._state.user.username = "username@test.com";
    });
    
    it("should refresh profile", function(done) {
      userState.refreshProfile()
        .then(function(){
          companyState.init.should.have.been.called;
          userState.updateUserProfile.should.have.been.calledWith({username: "username@test.com"});

          done();
        })
        .then(null,done);
    });

    it("should handle failure to refresh profile", function(done) {
      returnResult = false;

      userState.refreshProfile()
        .then(function(resp) {
          done(resp);
        })
        .then(null, function(error) {
          companyState.init.should.not.have.been.called;
          userState.updateUserProfile.should.not.have.been.called;

          expect(error).to.deep.equal("Error retrieving profile");
          done();
        })
        .then(null,done);
    });
  });
  
  describe("get functions: ", function() {
    it("getUsername: ", function () {
      expect(userState.getUsername()).to.equal(null);
      
      userState._state.user.username = "username@test.com";

      expect(userState.getUsername()).to.equal("username@test.com");
    });

    it("getUserFullName: ", function () {
      expect(userState.getUserFullName()).to.equal("");

      userState._state.profile.firstName = "John";
      expect(userState.getUserFullName()).to.equal("John");

      userState._state.profile.firstName = "";
      userState._state.profile.lastName = "Williams";
      expect(userState.getUserFullName()).to.equal("Williams");

      userState._state.profile.firstName = "John";
      userState._state.profile.lastName = "Williams";
      expect(userState.getUserFullName()).to.equal("John Williams");
    });
    
    it("getUserEmail: ", function() {
      expect(userState.getUserEmail()).to.not.be.ok;
      
      userState._state.profile.email = "username@test.com";

      expect(userState.getUserEmail()).to.equal("username@test.com");
    });
    
    it("getCopyOfProfile: ", function() {
      userState._state.profile.email = "username@test.com";

      expect(userState.getCopyOfProfile(true)).to.deep.equal(userState._state.profile);
      expect(userState.getCopyOfProfile(true)).to.not.equal(userState._state.profile);
      expect(Object.getPrototypeOf(userState.getCopyOfProfile(true))).to.not.equal(userState._state.profile);

      expect(userState.getCopyOfProfile()).to.deep.equal(userState._state.profile);
      expect(userState.getCopyOfProfile()).to.not.equal(userState._state.profile);
      expect(Object.getPrototypeOf(userState.getCopyOfProfile())).to.equal(userState._state.profile);
    });
    
    it("getUserPicture: ", function() {
      expect(userState.getUserPicture()).to.equal("https://www.gravatar.com/avatar/0?d=mm");

      userState._state.user.picture = "userPicture.jpg";
      
      expect(userState.getUserPicture()).to.equal("userPicture.jpg");
    });
    
    describe("user roles: ", function() {
      it("hasRole: ", function() {
        userState._state.roleMap = {"sa": true, "ua": true};
        
        expect(userState.hasRole("sa")).to.be.true;
        expect(userState.hasRole("ua")).to.be.true;
        expect(userState.hasRole("")).to.be.false;
        expect(userState.hasRole("ce")).to.be.false;
      });
      
      it("isRiseAdmin: ", function() {
        var isRoot = false;
        companyState.isRootCompany = function() {
          return isRoot;
        };

        expect(userState.isRiseAdmin()).to.be.false;

        userState._state.roleMap = {"ua": true};

        expect(userState.isRiseAdmin()).to.be.false;
        isRoot = true;
        expect(userState.isRiseAdmin()).to.be.false;

        userState._state.roleMap = {"sa": true, "ua": true};

        expect(userState.isRiseAdmin()).to.be.true;
        isRoot = false;
        expect(userState.isRiseAdmin()).to.be.false;
      });
      
      it("isRiseStoreAdmin: ", function() {
        var isRoot = false;
        companyState.isRootCompany = function() {
          return isRoot;
        };

        expect(userState.isRiseStoreAdmin()).to.be.false;

        userState._state.roleMap = {"ua": true};

        expect(userState.isRiseStoreAdmin()).to.be.false;
        isRoot = true;
        expect(userState.isRiseStoreAdmin()).to.be.false;

        userState._state.roleMap = {"ba": true, "ua": true};

        expect(userState.isRiseStoreAdmin()).to.be.true;
        isRoot = false;
        expect(userState.isRiseStoreAdmin()).to.be.false;
      });
      
      it("isUserAdmin: ", function() {
        expect(userState.isUserAdmin()).to.be.false;

        userState._state.roleMap = {"ba": true};

        expect(userState.isUserAdmin()).to.be.false;

        userState._state.roleMap = {"ba": true, "ua": true};

        expect(userState.isUserAdmin()).to.be.true;
      });
      
      it("isPurchaser: ", function() {
        expect(userState.isPurchaser()).to.be.false;

        userState._state.roleMap = {"ua": true};

        expect(userState.isPurchaser()).to.be.false;

        userState._state.roleMap = {"pu": true, "ua": true};

        expect(userState.isPurchaser()).to.be.true;
      });
      
    });
  
    it("inRVAFrame: ", function() {
      expect(userState.inRVAFrame()).to.be.true;
      
      userState._state.inRVAFrame = false;
      
      expect(userState.inRVAFrame()).to.be.false;
    });
    
    it("isRiseVisionUser: ", function() {
      expect(userState.isRiseVisionUser()).to.be.false;
      
      userState._state.profile.username = null;
      
      expect(userState.isRiseVisionUser()).to.be.false;

      userState._state.profile.username = "another@username.com";

      expect(userState.isRiseVisionUser()).to.be.true;
    });

    it("isLoggedIn: ", function() {
      expect(userState.isLoggedIn()).to.be.false;
      
      userState._state.user.username = null;
      
      expect(userState.isLoggedIn()).to.be.false;

      userState._state.user.username = "another@username.com";

      expect(userState.isLoggedIn()).to.be.true;
    });
    
    describe("getAccessToken: ", function() {
      var $window;
      beforeEach(function() {
        inject(function($injector){
          $window = $injector.get("$window");
        });
      });

      it("should retrieve gapi token", function() {
        expect(userState.getAccessToken()).to.not.be.ok;
        
        $window.gapi = $window.gapi || {};

        $window.gapi.auth = {
          getToken: function() { }
        };
        expect(userState.getAccessToken()).to.not.be.ok;

        $window.gapi.auth.getToken = function() { return "token"; };
        expect(userState.getAccessToken()).to.equal("token");
      });
    });

  });

  describe("checkUsername: ", function() {
    it("should return false if username doesnt match", function() {
      expect(userState.checkUsername()).to.be.false;
      expect(userState.checkUsername("")).to.be.false;
      
      userState.getUsername = sinon.spy(function() { return ""; });

      expect(userState.checkUsername("username@test.com")).to.be.false;

      userState.getUsername = sinon.spy(function() { return "another@username.com"; });
      
      expect(userState.checkUsername("username@test.com")).to.be.false;
    });
    
    it("should return true if username matches, regardless of case", function() {
      userState.getUsername = sinon.spy(function() { return "username@test.com"; });

      expect(userState.checkUsername("username@test.com")).to.be.true;
      expect(userState.checkUsername("UserName@Test.com")).to.be.true;

      userState.getUsername = sinon.spy(function() { return "UserName@Test.com"; });
      
      expect(userState.checkUsername("username@test.com")).to.be.true;
    });
  });
  
  describe("updateUserProfile: ", function() {
    it("should not update if usernames don't match", function() {
      userState.checkUsername = sinon.spy(function() { return false; });

      userState.updateUserProfile({username: "username@test.com"});
      
      userState.checkUsername.should.have.been.calledWith("username@test.com");
      $broadcastSpy.should.not.have.been.called;
    });

    it("should clear and update _state.profile", function() {
      userState._state.profile = {
        someProp: "someValue"
      };
      userState.checkUsername = sinon.spy(function() { return true; });

      userState.updateUserProfile({username: "username@test.com"});
      
      userState.checkUsername.should.have.been.calledWith("username@test.com");
      $broadcastSpy.should.have.been.called;

      expect(userState._state.profile).to.deep.equal({username: "username@test.com"});
    });
    
    it("should update user roles", function() {
      userState._state.profile = {
        someProp: "someValue"
      };
      userState.checkUsername = sinon.spy(function() { return true; });

      userState.updateUserProfile({username: "username@test.com"});
      
      userState.checkUsername.should.have.been.calledWith("username@test.com");
      $broadcastSpy.should.have.been.called;

      expect(userState._state.profile).to.deep.equal({username: "username@test.com"});
    });
    
    it("should update user roles", function() {
      userState._state.roleMap = {
        someRole: true
      };
      userState.checkUsername = sinon.spy(function() { return true; });

      userState.updateUserProfile({username: "username@test.com", roles: ["sa", "ua"]});
      
      expect(userState._state.roleMap).to.deep.equal({"sa": true, "ua": true});
    });

  });
  
  describe("private methods: ", function() {
    describe("_restoreState: ", function() {
      it("should ignore if nothing to restore", function() {
        var oldState = angular.copy(userState._state);

        userState._restoreState();
        
        localStorageService.get.should.have.been.calledWith("risevision.common.userState");
        localStorageService.remove.should.not.have.been.called;
        expect(userState._state).to.deep.equal(oldState);
      });

      it("should restore state", function() {
        var oldState = angular.copy(userState._state);
        oldState.user.username = "username@test.com";
        oldState.userToken = "dummy";

        localStorageService.get = sinon.spy(function() { return {user: {username: "username@test.com"}, userToken: "dummy"}; });

        userState._restoreState();
        
        localStorageService.get.should.have.been.calledWith("risevision.common.userState");
        localStorageService.remove.should.have.been.calledWith("risevision.common.userState");
        expect(userState._state).to.deep.equal(oldState);
      });
      
    });
    
    it("_resetState: ", function() {
      userState._state.user.username = "username@test.com";
      userState._state.profile.username = "username@test.com";
      userState._state.roleMap = { "ce": true };
      
      companyState.resetCompanyState = sinon.spy();

      userState._resetState();

      expect(userState._state.user).to.deep.equal({});
      expect(userState._state.profile).to.deep.equal({});
      expect(userState._state.roleMap).to.deep.equal({});

      companyState.resetCompanyState.should.have.been.called;
    });

    it("_persistState: ", function() {
      userState._persistState();
      localStorageService.set.should.have.been.calledWith("risevision.common.userState", userState._state);
    });

  });

});
