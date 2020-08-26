/*jshint expr:true */
"use strict";

describe("service: companyIcpFactory:", function() {
  beforeEach(module("risevision.common.header"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.service("userState", function() {
      return {
        getCopyOfProfile: function() {
          return userProfile;
        },
        updateUserProfile: sinon.spy(),
        getCopyOfSelectedCompany: function() {
          return companyProfile;
        },
        getSelectedCompanyId: function() {
          return "companyId";
        },
        isSubcompanySelected: function() {
          return isSubcompanySelected;
        },
        isRiseAdmin: function() {
          return isRiseAdmin;
        },
        isEducationCustomer: sinon.stub().returns(true),
        _restoreState: function() {},
        isSelectedCompanyChargebee: function () {
          return true;
        }
      };
    });
    $provide.service("updateCompany", function() {
      return sinon.stub().returns(Q.resolve());
    });
    $provide.service("updateUser", function() {
      return sinon.stub().returns(Q.resolve({ item: 'user' }));
    });
    $provide.service("$modal",function(){
      return {
        open : sinon.spy(function() {
          return {
            result: Q.resolve({
              user: {
                username: "username",
                mailSyncEnabled: true,
                companyRole: "companyRole",
                randomField: "randomValue"
              },
              company: {
                id: "companyId",
                companyIndustry: "companyIndustry",
                randomField: "randomValue"
              }
            })
          };
        })
      };
    });
  }));
  
  var companyIcpFactory, $rootScope, $modal, $state, userState, userProfile, companyProfile,
    updateUser, updateCompany, isSubcompanySelected, isRiseAdmin;
  
  beforeEach(function(){
    userProfile = {};
    companyProfile = {};
    isSubcompanySelected = false;
    isRiseAdmin = false;

    inject(function($injector){
      $rootScope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $modal = $injector.get("$modal");
      userState = $injector.get("userState");
      updateUser = $injector.get("updateUser");
      updateCompany = $injector.get("updateCompany");

      companyIcpFactory = $injector.get("companyIcpFactory");
    });
  });

  it("should exist",function() {
    expect(companyIcpFactory).to.be.ok;
    expect(companyIcpFactory.init).to.be.a("function");
  });

  describe("init", function() {
    it("should attach $on event handler", function() {
      var $onSpy = sinon.spy($rootScope, "$on");
      
      companyIcpFactory.init();
      
      $onSpy.should.have.been.calledWith("risevision.company.selectedCompanyChanged", sinon.match.func);
    });

  });

  describe("_checkIcpCollection:", function() {
    it("should open modal once user has logged in", function(done) {

      userProfile = {};
      companyIcpFactory.init();
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.been.calledWith({
          templateUrl: "partials/common-header/company-icp-modal.html",
          controller: "CompanyIcpModalCtrl",
          size: "md",
          backdrop: "static",
          keyboard: false,
          resolve: sinon.match.object
        });

        var resolve = $modal.open.getCall(0).args[0].resolve;
        
        expect(resolve.company).to.be.a("function");

        expect(resolve.company()).to.equal(companyProfile);

        done();
      }, 10);
    });

    it("should show for sub-companies", function(done) {
      isSubcompanySelected = true;

      userProfile = {};
      companyIcpFactory.init();
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.been.calledWith({
          templateUrl: "partials/common-header/company-icp-modal.html",
          controller: "CompanyIcpModalCtrl",
          size: "md",
          backdrop: "static",
          keyboard: false,
          resolve: sinon.match.object
        });

        var resolve = $modal.open.getCall(0).args[0].resolve;
        
        expect(resolve.company).to.be.a("function");

        expect(resolve.company()).to.equal(companyProfile);

        done();
      }, 10);
    });

    it("should not show if user is Rise Admin", function(done) {
      isRiseAdmin = true;

      userProfile = {};
      companyIcpFactory.init();
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.not.been.called;

        done();
      }, 10);
    });

    it("should not show if user is registering", function(done) {
      $state.current.name = "common.auth.registering";

      userProfile = {};
      companyIcpFactory.init();
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.not.been.called;

        done();
      }, 10);
    });

    it("should not open modal if data is filled in", function(done) {

      userProfile = {
        username: "username",
      };
      companyProfile = {
        companyIndustry: "Other"
      };
      companyIcpFactory.init();
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.not.been.called;

        done();
      }, 10);
    });

    it("$modal result", function(done) {
      companyProfile = {
        id: "cid",
        name: "Test Company",
        randomField: "123"
      };

      companyIcpFactory.init();
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        updateCompany.should.have.been.called;

        updateCompany.should.have.been.calledWith("companyId", {
          companyIndustry: "companyIndustry"
        });

        done();
      }, 10);
    });

  });

  describe("_checkRoleCollection:", function() {
    beforeEach(function() {
      var lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

      userProfile = {
        username: "username",
        termsAcceptanceDate: lastMonthDate
      };
      companyProfile = {
        companyIndustry: "Other"
      };

      companyIcpFactory.init();
    });
    
    it("should open role modal if icp is completed", function(done) {
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.been.calledWith({
          templateUrl: 'partials/common-header/company-role-modal.html',
          controller: 'CompanyRoleModalCtrl',
          size: "md",
          backdrop: "static",
          keyboard: false,
          resolve: sinon.match.object
        });

        var resolve = $modal.open.getCall(0).args[0].resolve;
        
        expect(resolve.user).to.be.a("function");
        expect(resolve.user()).to.equal(userProfile);

        done();
      }, 10);
    });

    it("should not show role modal for non Education customers", function(done) {
      userState.isEducationCustomer.returns(false);

      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        userState.isEducationCustomer.should.have.been.calledWith(true);

        $modal.open.should.have.not.been.called;

        done();
      }, 10);
    });

    it("should not show role modal for users created less than a day ago", function(done) {
      userProfile.termsAcceptanceDate = (new Date()).toString();

      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.not.been.called;

        done();
      }, 10);
    });

    it("should not open modal if data is filled in", function(done) {
      userProfile.companyRole = "companyRole";

      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.not.been.called;

        done();
      }, 10);
    });

    it("$modal result", function(done) {
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $modal.open.should.have.been.called;

        updateCompany.should.not.have.been.called;
        updateUser.should.have.been.called;

        updateUser.should.have.been.calledWith("username", {
          companyRole: "companyRole"
        });

        userState.updateUserProfile.should.have.been.calledWith('user');

        done();
      }, 10);
    });

  });

});
