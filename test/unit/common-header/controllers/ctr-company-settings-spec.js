"use strict";

/*jshint -W030 */

describe("controller: company settings", function() {
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
    $provide.value("companyId", "RV_test_id");
    $provide.value("countries", []);
    $provide.service("getCompany",function(){
      return function(companyId) {
        var deferred = Q.defer();
        expect(companyId).to.equal("RV_test_id");
        deferred.resolve(savedCompany);
        return deferred.promise;
      };
    });
    $provide.service("updateCompany",function(){
      return function(companyId, newCompany){
        var deferred = Q.defer();
        expect(companyId).to.equal("RV_test_id");

        savedCompany = newCompany;

        if(createCompany){
          deferred.resolve(companyId);
        }else{
          deferred.reject("ERROR; could not create company");
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
    $provide.service("addressFactory", function() {
      return {
        isValidOrEmptyAddress: function() {
          if (validateAddress) {
            return Q.resolve();  
          }
          return Q.reject("ERROR; invalid address");
        }
      };
    });
    $provide.service('$loading', function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      }
    });
    $provide.factory('confirmModal', function() {
      return confirmModalStub = sinon.stub();
    });
    $provide.factory("regenerateCompanyField", function ($q) {
      return regenerateCompanyFieldStub = sinon.stub();
    });
    $provide.factory("customLoader", function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });

    $translateProvider.useLoader("customLoader");

  }));

  var $scope, userProfile, userCompany, savedCompany, company, userState, $modalInstance, createCompany,
  trackerCalled, validateAddress, $loading, confirmModalStub, regenerateCompanyFieldStub;
  var isStoreAdmin = true;
  beforeEach(function(){
    createCompany = true;
    validateAddress = true;
    trackerCalled = undefined;
    userProfile = {
      id : "RV_user_id",
      firstName : "first",
      lastName : "last",
      telephone : "telephone",
      email : "e@mail.com"
    };
    company = {
      "id": "RV_test_id",
      "parentId": "fb788f1f",
      "name": "Test Company",
      "creationDate": "2012-04-03T20:52:17.000Z",
      "city": "Toronto",
      "province": "ON",
      "country": "CA",
      "companyStatus": 1,
      "companyStatusChangeDate": "2011-06-30T20:08:57.000Z",
      "settings": {},
      "parentSettings": {},
      "mailSyncEnabled": false,
      "sellerId": "asdf1234",
      "isTest": true
    };
    savedCompany = company;
    userState = function(){
      return {
        getCopyOfProfile : function(){
          return userProfile;
        },
        getCopyOfUserCompany : function(){
          return userCompany;
        },
        getCopyOfSelectedCompany : function(){
          return userCompany;
        },
        getAccessToken : function(){
          return{access_token: "TEST_TOKEN"};
        },
        getSelectedCompanyId : function(){
          return "some_company_id";
        },
        getSelectedCompanyName: function() {
          return "company_name";
        },
        _restoreState : function(){

        },
        updateCompanySettings: function(company){
          userCompany = angular.copy(company);
        },
        isSubcompanySelected : function(){
          return true;
        },
        isRiseStoreAdmin: function() {
          return isStoreAdmin;
        },
        _state: {}
      };
    };

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      $loading = $injector.get("$loading");
      $controller("CompanySettingsModalCtrl", {
        $scope : $scope,
        $modalInstance: $modalInstance,
        companyId: $injector.get("companyId"),
        userState : $injector.get("userState"),
        companyDetails:$injector.get("getCompany"),
        updateCompany:$injector.get("updateCompany")
      });
      $scope.$digest();
    });
  });

  it("should exist",function(){
    expect($scope).to.be.truely;
    expect($scope.company).to.be.truely;

    expect($scope.company).to.have.property("id");

    expect($scope).to.have.property("countries");
    expect($scope).to.have.property("regionsCA");
    expect($scope).to.have.property("regionsUS");
    expect($scope).to.have.property("COMPANY_INDUSTRY_FIELDS");
    expect($scope).to.have.property("COMPANY_SIZE_FIELDS");
    expect($scope).to.have.property("isRiseStoreAdmin");
    expect($scope.loading).to.be.true;
    expect($scope.formError).to.be.null;
    expect($scope.apiError).to.be.null;

    expect($scope.closeModal).to.exist;
    expect($scope.save).to.exist;
    expect($scope.deleteCompany).to.exist;
    expect($scope.resetAuthKey).to.exist;
    expect($scope.resetClaimId).to.exist;
  });

  it("should load current company",function(done){
    setTimeout(function(){
      expect($scope.loading).to.be.false;
      expect($scope.company).to.have.property("name");
      expect($scope.company).to.have.property("parentId");
      done();
    },10);
  });

  describe("submit: ",function(){
    beforeEach(function(done){
      $scope.isRiseStoreAdmin = true;

      setTimeout(function(){
        expect($scope.loading).to.be.false;
        done();
      },10);
    });

    it("should save the company and close the modal",function(done){
      $scope.save();
      expect($scope.loading).to.be.true;
      setTimeout(function() {
        expect($scope.loading).to.be.false;
        expect($scope.formError).to.be.null;
        expect(trackerCalled).to.equal("Company Updated");
        expect($modalInstance._closed).to.be.true;

        expect($scope.company).to.have.property("name");
        expect($scope.company).to.have.property("sellerId");
        expect($scope.company).to.have.property("isTest");

        done();
      },10);
    });

    it("should remove fields if user is not Store Admin",function(done){
      $scope.isRiseStoreAdmin = false;
      $scope.save();
      setTimeout(function() {
        expect(savedCompany).to.have.property("name");
        expect(savedCompany).to.not.have.property("sellerId");
        expect(savedCompany).to.not.have.property("isTest");

        done();
      },10);
    });

    it("should not remove fields from companyState if user is not Store Admin",function(done){
      $scope.isRiseStoreAdmin = false;
      $scope.save();
      setTimeout(function() {
        expect($scope.company).to.have.property("isTest");
        expect($scope.company).to.have.property("sellerId");
        expect($scope.company.isTest).to.be.true;

        done();
      },10);
    });

    it("should clear form error",function(){
      $scope.formError = "ERROR";
      $scope.save();
      expect($scope.formError).to.be.null;
    });

    it("should handle failure to create company correctly",function(done){
      createCompany = false;

      $scope.$digest();
      $scope.save();
      setTimeout(function(){
        expect($scope.loading).to.be.false;
        expect($modalInstance._closed).to.be.false;
        expect($scope.formError).to.be.equal("Failed to update Company.");
        expect($scope.apiError).to.be.equal("ERROR; could not create company");

        done();
      },10);
    });

    it("should report error if company address is not valid", function(done){
      validateAddress = false;

      $scope.$digest();
      $scope.save();
      setTimeout(function(){
        expect($scope.loading).to.be.false;
        expect($modalInstance._closed).to.be.false;
        expect($scope.formError).to.be.equal("We couldn't update your address.");
        expect($scope.apiError).to.be.equal("ERROR; invalid address");

        done();
      },10);
    });
  });

  describe('resetAuthKey', function() {
    beforeEach(function() {
      $loading.start.reset();
      $loading.stop.reset();
    });

    it('should open confirm dialog', function() {
      confirmModalStub.returns(Q.resolve());

      $scope.resetAuthKey();

      confirmModalStub.should.have.been.calledWith(sinon.match.string, sinon.match.string);
    });

    it('should not do anything if the user cancels', function(done) {
      confirmModalStub.returns(Q.reject());

      $scope.resetAuthKey();
      
      setTimeout(function() {
        $loading.start.should.not.have.been.called;
        $loading.stop.should.not.have.been.called;
        regenerateCompanyFieldStub.should.not.have.been.called;

        done();
      }, 10);

    });

    it('should show spinner and call api', function(done) {
      confirmModalStub.returns(Q.resolve());

      $scope.resetAuthKey();

      setTimeout(function() {
        $loading.start.should.have.been.calledWith('company-settings-modal');
        $loading.stop.should.not.have.been.called;
        regenerateCompanyFieldStub.should.have.been.calledWith('RV_test_id', 'authKey');

        done();
      }, 10);
    });

    it('should reset auth key', function(done) {
      confirmModalStub.returns(Q.resolve());
      regenerateCompanyFieldStub.returns(Q.resolve({
        item: 'updatedKey'
      }));

      $scope.resetAuthKey();

      setTimeout(function() {
        $loading.stop.should.have.been.calledWith('company-settings-modal');
        
        expect($scope.company.authKey).to.equal('updatedKey');

        done();
      }, 10);
    });

    it('should handle failure to reset auth key', function(done) {
      confirmModalStub.returns(Q.resolve());
      regenerateCompanyFieldStub.returns(Q.reject());

      $scope.resetAuthKey();

      setTimeout(function() {
        $loading.stop.should.have.been.calledWith('company-settings-modal');
        
        expect($scope.company.authKey).to.be.undefined;

        done();
      }, 10);
    });

  });

  describe('resetClaimId', function() {
    beforeEach(function() {
      $loading.start.reset();
      $loading.stop.reset();
    });

    it('should open confirm dialog', function() {
      confirmModalStub.returns(Q.resolve());

      $scope.resetClaimId();

      confirmModalStub.should.have.been.calledWith(sinon.match.string, sinon.match.string);
    });

    it('should not do anything if the user cancels', function(done) {
      confirmModalStub.returns(Q.reject());

      $scope.resetClaimId();
      
      setTimeout(function() {
        $loading.start.should.not.have.been.called;
        $loading.stop.should.not.have.been.called;
        regenerateCompanyFieldStub.should.not.have.been.called;

        done();
      }, 10);

    });

    it('should show spinner and call api', function(done) {
      confirmModalStub.returns(Q.resolve());

      $scope.resetClaimId();

      setTimeout(function() {
        $loading.start.should.have.been.calledWith('company-settings-modal');
        $loading.stop.should.not.have.been.called;
        regenerateCompanyFieldStub.should.have.been.calledWith('RV_test_id', 'claimId');

        done();
      }, 10);
    });

    it('should reset claim id', function(done) {
      confirmModalStub.returns(Q.resolve());
      regenerateCompanyFieldStub.returns(Q.resolve({
        item: 'updatedId'
      }));

      $scope.resetClaimId();

      setTimeout(function() {
        $loading.stop.should.have.been.calledWith('company-settings-modal');
        
        expect($scope.company.claimId).to.equal('updatedId');

        done();
      }, 10);
    });

    it('should handle failure to reset claim id', function(done) {
      confirmModalStub.returns(Q.resolve());
      regenerateCompanyFieldStub.returns(Q.reject());

      $scope.resetClaimId();

      setTimeout(function() {
        $loading.stop.should.have.been.calledWith('company-settings-modal');
        
        expect($scope.company.claimId).to.be.undefined;

        done();
      }, 10);
    });

  });

  it("should close modal on cancel",function(){
    $scope.closeModal();
    expect($modalInstance._dismissed).to.be.true;
  });

});
