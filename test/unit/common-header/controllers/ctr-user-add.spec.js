"use strict";

/*jshint -W030 */
/*global sinon*/

describe("controller: user add", function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module("risevision.common.header"));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.service("userState",userState);
    $provide.value("companyId", "1234");
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
    $provide.service("addUser",function(){
      return function(companyId, username, newUser){
        var deferred = Q.defer();
        expect(companyId).to.equal("1234");
        expect(username).to.equal("user@example.io");
        expect(newUser).to.be.ok;
        
        if (!createUserError){
          deferred.resolve(username);
        } else {
          deferred.reject(createUserError);
        }
        return deferred.promise;
      };
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
      return messageBoxStub;
    });
    $provide.factory("$filter", function() {
      return function() { return filterStub; };
    });

  }));
  var $scope, userState, $modalInstance, createUserError,
  userTracker, messageBoxStub, filterStub;
  var isRiseAdmin = true, isUserAdmin = true, isRiseVisionUser = true;
  beforeEach(function(){
    createUserError = false;
    userState = function(){
      return {
        _restoreState : function(){
          
        },
        getUsername: function() {
          return 'username';
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
        isSubcompanySelected: function () {
          return false;
        },
        isSelectedCompanyChargebee: function () {
          return false;
        },
        isEducationCustomer: sinon.stub().returns(true)
      };
    };
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      userState = $injector.get("userState");
      userTracker = $injector.get('userTracker');
      
      messageBoxStub = sinon.stub();
      filterStub = sinon.stub();

      $controller("AddUserModalCtrl", {
        $scope : $scope,
        $modalInstance: $modalInstance,
        userState : userState,
        addUser:$injector.get("addUser"),
        userTracker: userTracker,
      });
      $scope.$digest();
    });
  });
    
  it("should exist",function(){
    expect($scope).to.be.ok;
    expect($scope.user).to.be.ok;
    
    expect($scope).to.have.property("availableRoles");

    expect($scope.closeModal).to.exist;
    expect($scope.save).to.exist;
    expect($scope.editRoleAllowed).to.exist;
    expect($scope.editRoleVisible).to.exist;
    expect($scope.COMPANY_ROLE_FIELDS).to.exist;

    expect($scope.isUserAdmin).to.be.true;
  });

  it("should configure company roles by checking if customer is education", function() {
    userState.isEducationCustomer.should.have.been.called;

    expect($scope.COMPANY_ROLE_FIELDS[0]).to.deep.equal(['IT', 'education_it']);
  });
  
  describe("save: ",function(){
    var formInvalid;
    
    beforeEach(function(){      
      formInvalid = false;
      
      $scope.loading = false;
      $scope.user = {
        username: "user@example.io"
      };
      $scope.forms.userSettingsForm = {
        email: {},
        username: {},
        firstName: {},
        lastName: {},
        $invalid: false
      };
    });
    
    it("should not save if form is invalid", function() {
      $scope.forms.userSettingsForm.$invalid = true;
      $scope.save();
      expect($scope.loading).to.be.false;

      userTracker.should.not.have.been.called;
      expect($modalInstance._closed).to.be.false;
    });
    
    it("should save the user and close the modal",function(done){
      $scope.save();
      expect($scope.loading).to.be.true;
      setTimeout(function() {
        expect($scope.loading).to.be.false;

        userTracker.should.have.been.calledWith('User Created', 'username', false, {invitedEmail: 'user@example.io'});
        expect($modalInstance._closed).to.be.true;
        
        done();
      },10);
    });

    it("should handle failure to save user",function(done){
      createUserError = true;
      
      $scope.save();
      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith("common-header.user.error.add-user");
        expect(filterStub).to.have.not.been.called;
        
        expect($scope.loading).to.be.false;
        expect($modalInstance._closed).to.be.false;

        done();
      },10);
    });
    
    it("should handle duplicate user error",function(done){
      createUserError = { code: 409 };
      
      $scope.save();
      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith("common-header.user.error.add-user");
        expect(filterStub).to.have.been.calledWith("common-header.user.error.duplicate-user", {
          "username": "user@example.io"
        });

        expect($scope.loading).to.be.false;
        expect($modalInstance._closed).to.be.false;

        done();
      },10);
    });
  });
  
  it("should close modal on cancel",function(){
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
  
