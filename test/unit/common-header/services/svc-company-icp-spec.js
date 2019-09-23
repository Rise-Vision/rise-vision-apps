/*jshint expr:true */
"use strict";

describe("service: companyIcpFactory:", function() {
  beforeEach(module("risevision.common.header"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.service("$templateCache",function(){
      return {
        get: function(url){
          expect(url).to.be.ok;

          return "template";
        },
        put: function() {}
      };
    });
    $provide.service("$log", function() {
      return {
        debug: sinon.spy()
      };
    });
    $provide.service("userState", function() {
      return {
        getCopyOfProfile: function() {
          return userProfile;
        },
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
        _restoreState: function() {},
        isSelectedCompanyChargebee: function () {
          return true;
        }
      };
    });
    $provide.service("updateCompany", function() {
      updateCompanySpy = sinon.spy(function() {
        return Q.resolve();
      });

      return updateCompanySpy;
    });
    $provide.service("updateUser", function() {
      updateUserSpy = sinon.spy(function() {
        return Q.resolve();
      });

      return updateUserSpy;
    });
    $provide.service("$modal",function(){
      $modal = {
        open : sinon.spy(function() {
          return {
            result: $modalDeferred.promise
          };
        })
      };

      return $modal;
    });
  }));
  
  var companyIcpFactory, $rootScope, $modal, $modalDeferred, $log, userProfile, companyProfile,
    updateUserSpy, updateCompanySpy, isSubcompanySelected, isRiseAdmin;
  
  beforeEach(function(){
    $modalDeferred = Q.defer();
    userProfile = {};
    companyProfile = {};
    isSubcompanySelected = false;
    isRiseAdmin = false;

    inject(function($injector){
      $rootScope = $injector.get("$rootScope");
      $log = $injector.get("$log");
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
        
        expect(resolve.user).to.be.a("function");
        expect(resolve.company).to.be.a("function");

        expect(resolve.user()).to.equal(userProfile);
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
        
        expect(resolve.user).to.be.a("function");
        expect(resolve.company).to.be.a("function");

        expect(resolve.user()).to.equal(userProfile);
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

  });

  describe("$modal result", function() {
    beforeEach(function(done) {

      userProfile = {
        username: "username",
        randomField: "123"
      };
      companyProfile = {
        id: "cid",
        name: "Test Company",
        randomField: "123"
      };
      companyIcpFactory.init();
      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");

      setTimeout(function() {
        $log.debug.reset();
        $modal.open.should.have.been.called;

        done();
      }, 10);
    });

  });
});
