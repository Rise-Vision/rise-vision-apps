"use strict";

/*jshint -W030 */

describe("controller: user settings", function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.service("userState",userState);
    $provide.service("$modalInstance",function(){
      return {
        _dismissed : false,
        _closed: false,
        dismiss : function(reason){
          expect(reason).to.equal("cancel");
          this._dismissed = true;
        },
        close: function(reason) {
          expect(reason).to.equal("success");          
          this._closed = true;
        }
      };
    });
    $provide.value("username", "user@example.io");
    $provide.service("getUserProfile",function(){
      return function(username) {
        var deferred = Q.defer();
        expect(username).to.equal("user@example.io");
        deferred.resolve(savedUser);
        return deferred.promise;
      };
    });
    $provide.service("updateUser",function(){
      return function(username, newUser){
        var deferred = Q.defer();
        expect(username).to.equal("user@example.io");
        
        savedUser = newUser;
        
        if (!createUserError) {
          deferred.resolve(username);
        } else {
          deferred.reject(createUserError);
        }
        return deferred.promise;
      };
    });
    $provide.service("segmentAnalytics", function() { 
      return {
        track: function(name) {
          trackerCalled = name;
        },
        load: function() {}
      };
    });

    $provide.factory("customLoader", function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });

    $translateProvider.useLoader("customLoader");

    $provide.factory("messageBox", function() {
      return messageBoxStub;
    });
    $provide.factory("$filter", function() {
      return function() { return filterStub; };
    });

  }));
  var $scope, userProfile, savedUser, userState, $modalInstance, createUserError,
  trackerCalled, messageBoxStub, filterStub;
  var isRiseAdmin = true, isUserAdmin = true, isRiseVisionUser = true, isRiseAuthUser = false;
  beforeEach(function(){
    createUserError = false;
    trackerCalled = undefined;
    userProfile = {
      id : "RV_user_id",
      username: "user@example.io",
      firstName : "first",
      lastName : "last",
      telephone : "telephone",
      email : "e@mail.com"
    };
    savedUser = userProfile;
    userState = function(){
      return {
        checkUsername: function(username){
          return username === "user@example.io";
        },
        getAccessToken : function(){
          return{access_token: "TEST_TOKEN"};
        },
        getSelectedCompanyId : function(){
          return "some_company_id";
        },
        updateUserProfile: function() {
        },
        _restoreState : function(){
          
        },
        isRiseAdmin: function() {
          return isRiseAdmin;
        },
        isUserAdmin: function() {
          return isUserAdmin;
        },
        isRiseVisionUser: function() {
          return isRiseVisionUser;
        },
        isRiseAuthUser: function() {
          return isRiseAuthUser;
        },
        isSubcompanySelected: function () {
          return false;
        },
        isSelectedCompanyChargebee: function () {
          return false;
        },
        _state: {}
      };
    };
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      userState = $injector.get("userState");
      
      messageBoxStub = sinon.stub();
      filterStub = sinon.stub();

      $controller("UserSettingsModalCtrl", {
        $scope : $scope,
        $modalInstance: $modalInstance,
        username: $injector.get("username"),
        userState : userState,
        getUserProfile:$injector.get("getUserProfile"),
        updateUser:$injector.get("updateUser"),
        segmentAnalytics:$injector.get("segmentAnalytics")
      });
      $scope.$digest();
    });
  });

  afterEach(function () {
    sandbox.restore();
  });
    
  it("should exist",function(){
    expect($scope).to.be.truely;
    expect($scope.user).to.be.truely;
    
    expect($scope).to.have.property("isUserAdmin");
    expect($scope).to.have.property("availableRoles");
    expect($scope).to.have.property("COMPANY_ROLE_FIELDS");
    expect($scope.loading).to.be.true;

    expect($scope.closeModal).to.exist;
    expect($scope.save).to.exist;
    expect($scope.deleteUser).to.exist;
    expect($scope.editRoleAllowed).to.exist;
    expect($scope.editRoleVisible).to.exist;
  });

  it("should load current user",function(done){
    setTimeout(function(){
      expect($scope.loading).to.be.false;
      expect($scope.user).to.have.property("firstName");
      expect($scope.user).to.have.property("email");
      done();
    },10);
  });
  
  describe("save: ",function(){
    
    beforeEach(function(done){      
      $scope.forms.userSettingsForm = {
        email: {},
        firstName: {},
        lastName: {},
        $valid: true
      };
      setTimeout(function(){
        $scope.$digest();
        expect($scope.loading).to.be.false;
        done();
      },10);
    });
    
    it("should not save if form is invalid", function() {
      $scope.forms.userSettingsForm.$valid = false;
      $scope.save();
      expect($scope.loading).to.be.false;

      expect(trackerCalled).to.not.be.ok;
      expect($modalInstance._closed).to.be.false;
    });

    it("should save the user and close the modal",function(done){
      var userProfileSpy = sinon.spy(userState, "updateUserProfile");

      $scope.showChangePassword = false;
      $scope.save();
      $scope.$digest();
      expect($scope.loading).to.be.true;

      setTimeout(function() {
        $scope.$digest();
        expect($scope.loading).to.be.false;
        userProfileSpy.should.have.been.once;

        expect(trackerCalled).to.equal("User Updated");
        expect($modalInstance._closed).to.be.true;
        
        done();
      },10);
    });

    it("should handle failure to save user",function(done){
      createUserError = true;
      
      $scope.save();
      $scope.$digest();
      setTimeout(function(){
        $scope.$digest();
        expect(messageBoxStub).to.have.been.calledWith("common-header.user.error.update-user");
        expect(filterStub).to.have.not.been.called;
        
        expect($scope.loading).to.be.false;
        expect($modalInstance._closed).to.be.false;

        done();
      },10);
    });
    
    it("should handle duplicate user error",function(done){
      createUserError = { code: 409 };
      
      $scope.save();
      $scope.$digest();
      setTimeout(function(){
        $scope.$digest();
        expect(messageBoxStub).to.have.been.calledWith("common-header.user.error.update-user");
        expect(filterStub).to.have.been.calledWith("common-header.user.error.duplicate-user", {
          "username": "user@example.io"
        });

        expect($scope.loading).to.be.false;
        expect($modalInstance._closed).to.be.false;

        done();
      },10);
    });
  });
  
  it("should close modal on cancel",function (){
    $scope.closeModal();
    expect($modalInstance._dismissed).to.be.true;
  });
  
  describe("editRoleVisible: ", function () {
    it("should handle isRiseAdmin", function () {
      sandbox.stub(userState, "isRiseAdmin").returns(true);
      sandbox.stub(userState, "isSubcompanySelected").returns(false);

      expect($scope.editRoleVisible({ key: "sa"})).to.be.true;
      expect($scope.editRoleVisible({ key: "ba"})).to.be.true;
      expect($scope.editRoleVisible({ key: "pu"})).to.be.true;

      sandbox.stub(userState, "isSelectedCompanyChargebee").returns(true);

      expect($scope.editRoleVisible({ key: "pu"})).to.be.false;
    });

    it("should handle isRiseAdmin with subcompany selected", function () {
      sandbox.stub(userState, "isRiseAdmin").returns(true);
      sandbox.stub(userState, "isSubcompanySelected").returns(true);

      expect($scope.editRoleVisible({ key: "sa"})).to.be.false;
      expect($scope.editRoleVisible({ key: "ba"})).to.be.false;
      expect($scope.editRoleVisible({ key: "pu"})).to.be.true;

      sandbox.stub(userState, "isSelectedCompanyChargebee").returns(true);

      expect($scope.editRoleVisible({ key: "pu"})).to.be.false;
    });

    it("should handle isUserAdmin", function () {
      sandbox.stub(userState, "isRiseAdmin").returns(false);
      sandbox.stub(userState, "isUserAdmin").returns(true);

      expect($scope.editRoleVisible({ key: "sa"})).to.be.false;
      expect($scope.editRoleVisible({ key: "ba"})).to.be.false;
      expect($scope.editRoleVisible({ key: "pu"})).to.be.true;

      sandbox.stub(userState, "isSelectedCompanyChargebee").returns(true);

      expect($scope.editRoleVisible({ key: "pu"})).to.be.false;
    });

    it("should handle isRiseVisionUser", function () {
      sandbox.stub(userState, "isRiseAdmin").returns(false);
      sandbox.stub(userState, "isRiseVisionUser").returns(true);

      expect($scope.editRoleVisible({ key: "sa"})).to.be.false;
      expect($scope.editRoleVisible({ key: "ba"})).to.be.false;
      expect($scope.editRoleVisible({ key: "pu"})).to.be.true;

      sandbox.stub(userState, "isSelectedCompanyChargebee").returns(true);

      expect($scope.editRoleVisible({ key: "pu"})).to.be.false;
    });
  });
});
