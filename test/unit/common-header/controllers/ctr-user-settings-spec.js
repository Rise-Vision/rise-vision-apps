"use strict";

/*jshint -W030 */

describe("controller: user settings", function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.service("userState",userState);
    $provide.service("$modalInstance",function(){
      return {
        dismiss : sinon.stub(),
        close: sinon.stub()
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
    $provide.service('deleteUser', function() {
      return deleteUserStub = sinon.stub();
    });
    $provide.service("userTracker", function() { 
      return sinon.spy();
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
      return messageBoxStub = sinon.stub();
    });
    $provide.factory('confirmModal', function() {
      return confirmModalStub = sinon.stub();
    });

    $provide.factory("$filter", function() {
      return function() { return filterStub; };
    });

    $provide.service("userauth", function() {
      return {
        updatePassword: sandbox.stub().returns(Q.resolve())
      };
    });

  }));
  var $scope, userProfile, savedUser, userState, $modalInstance, createUserError,
  userTracker, deleteUserStub, messageBoxStub, confirmModalStub, filterStub, userauth;
  var isRiseAdmin = true, isUserAdmin = true, isRiseVisionUser = true, isRiseAuthUser = false;
  beforeEach(function(){
    createUserError = false;
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
      userauth = $injector.get('userauth');
      userTracker = $injector.get('userTracker');

      filterStub = sinon.stub();

      $controller("UserSettingsModalCtrl", {
        $scope : $scope,
        $modalInstance: $modalInstance,
        username: $injector.get("username"),
        userState : userState,
        getUserProfile:$injector.get("getUserProfile"),
        updateUser:$injector.get("updateUser"),
        userTracker: userTracker
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
        currentPassword: {
          $setValidity: sandbox.stub()
        },
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

      userTracker.should.not.have.been.called;
      $modalInstance.close.should.not.have.been.called;
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

        userTracker.should.have.been.calledWith('User Updated');
        $modalInstance.close.should.have.been.calledWith('success');
        
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
        $modalInstance.close.should.not.have.been.called;

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
        $modalInstance.close.should.not.have.been.called;

        done();
      },10);
    });

    describe('change password:', function() {
      beforeEach(function(){
        $scope.showChangePassword = true;
      });

      it('should clear error on success', function(done) {
        $scope.save();

        setTimeout(function() {
          expect($scope.forms.userSettingsForm.currentPassword.$setValidity).to.have.been.calledWith('currentPasswordNotValid',true);
          done();
        },10);

      });

      it('should set error on failure', function(done) {
        userauth.updatePassword.returns(Q.reject({result: {error: {code: 409}}}));

        $scope.save();

        setTimeout(function() {
          expect($scope.forms.userSettingsForm.currentPassword.$setValidity).to.have.been.calledWith('currentPasswordNotValid',false);
          done();
        },10);
      });

      it('should clear invalid password error on input changed',function(){
        $scope.userPassword.currentPassword = 'changedPassword';
        $scope.$digest();

        expect($scope.forms.userSettingsForm.currentPassword.$setValidity).to.have.been.calledWith('currentPasswordNotValid',true);
      })
    });
  });

  describe('deleteUser: ', function() {
    it('should open confirm dialog', function() {
      confirmModalStub.returns(Q.resolve());

      $scope.deleteUser();

      confirmModalStub.should.have.been.calledWith(sinon.match.string, sinon.match.string);

      expect($scope.loading).to.be.true;
    });

    it('should not do anything if the user cancels', function(done) {
      confirmModalStub.returns(Q.reject());

      $scope.deleteUser();
      
      setTimeout(function() {
        expect($scope.loading).to.be.false;
        deleteUserStub.should.not.have.been.called;

        done();
      }, 10);

    });

    it('should show spinner and call api', function(done) {
      confirmModalStub.returns(Q.resolve());

      $scope.deleteUser();

      setTimeout(function() {
        expect($scope.loading).to.be.false;

        deleteUserStub.should.have.been.calledWith("user@example.io");

        done();
      }, 10);
    });

    it('should delete user', function(done) {
      confirmModalStub.returns(Q.resolve());
      deleteUserStub.returns(Q.resolve());

      $scope.deleteUser();

      setTimeout(function() {
        expect($scope.loading).to.be.false;
        
        userTracker.should.have.been.calledWith('User Deleted');
        $modalInstance.dismiss.should.have.been.calledWith('deleted');

        done();
      }, 10);
    });

    it('should handle failure to delete user', function(done) {
      confirmModalStub.returns(Q.resolve());
      deleteUserStub.returns(Q.reject({}));

      $scope.deleteUser();

      setTimeout(function() {
        expect($scope.loading).to.be.false;
        
        messageBoxStub.should.have.been.called;

        userTracker.should.not.have.been.called;
        $modalInstance.dismiss.should.not.have.been.called;

        done();
      }, 10);
    });
  });
  
  it("should close modal on cancel",function (){
    $scope.closeModal();

    $modalInstance.dismiss.should.have.been.calledWith('cancel');
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
