/*jshint expr:true */
"use strict";

describe("Services: analyticsFactory", function() {

  beforeEach(module("risevision.common.components.logging"));
  beforeEach(module(function ($provide) {
    $provide.factory("userState", [function () {
      return {
        getCopyOfProfile: function() {
          return profile;
        },
        getUsername: function() {
          return "username";
        },
        getUserCompanyId: function() {
          return companyId;
        },
        getCopyOfUserCompany: function() {
          return {
            id: companyId,
            name: "companyName",
            companyIndustry: "K-12 Education",
            parentId: "parent123"
          };
        }
      };
    }]);
    $provide.factory("$location", [function () {
      return {
        path: function() {
          return "/somepath";
        },
        search: function() {
          return {
            nooverride: 1
          };
        },
        host: function() {
          return "test.com";
        }
      };
    }]);
  }));
  
  var analyticsFactory, analyticsEvents, $scope, companyId, $window, profile;
  beforeEach(function(){
    inject(function($rootScope, $injector){
      $scope = $rootScope;
      companyId = "companyId";
      profile = {
        termsAcceptanceDate: "2020-01-01"
      };
      
      analyticsFactory = $injector.get("analyticsFactory");
      $window = $injector.get("$window");
      analyticsFactory.load(true);
      analyticsEvents = $injector.get("analyticsEvents");
      analyticsEvents.initialize();
    });
  });
  
  it("should exist, also methods", function() {
    expect(analyticsFactory.load).to.be.a('function');
    expect(analyticsFactory.track).to.be.a('function');
    expect(analyticsFactory.identify).to.be.a('function');
    expect(analyticsFactory.page).to.be.a('function');
  });

  it("should identify user and track logged in event", function(done) {
    var identifySpy = sinon.spy(analyticsFactory, "identify");
    var trackSpy = sinon.spy(analyticsFactory, "track");

    analyticsEvents.identify();
    
    setTimeout(function() {
      var expectProperties = {
        company: { id: "companyId", name: "companyName", companyIndustry: "K-12 Education", parentId: "parent123" },
        companyId: "companyId",
        companyName: "companyName",
        companyIndustry: "K-12 Education",
        parentId: "parent123",
        userId: "username",
        email: undefined,
        firstName: "",
        lastName: "",
        companyRole: "",
        registeredDate: "2020-01-01",
        subscriptionRenewalDate: undefined,
        subscriptionStatus: "Free",
        subscriptionTrialExpiryDate: undefined
      };
      identifySpy.should.have.been.calledWith("username",expectProperties);

      expect($window.dataLayer[$window.dataLayer.length-2].event).to.equal("analytics.identify");
      expect($window.dataLayer[$window.dataLayer.length-2].userId).to.equal("username");
      expect($window.dataLayer[$window.dataLayer.length-2].analytics.user.properties).to.deep.equal(expectProperties);

      trackSpy.should.have.been.calledWithMatch("logged in",expectProperties);
      expect($window.dataLayer[$window.dataLayer.length-1].event).to.equal("analytics.track");
      var actualProperties = $window.dataLayer[$window.dataLayer.length-1].analytics.event.properties;
      Object.keys(expectProperties).forEach(function(key) {
        expect(actualProperties[key]).to.deep.equal(expectProperties[key]);
      });
      expect(actualProperties.loginDate).to.be.a("date");

      done();
    }, 10);
  });

  it("should identify user and track logged in event with correct profile data", function(done) {
    var identifySpy = sinon.spy(analyticsFactory, "identify");
    var trackSpy = sinon.spy(analyticsFactory, "track");
    profile.firstName = "firstName";
    profile.lastName = "lastName";
    profile.companyRole = "companyRole";
    profile.email = "user@email.com";

    analyticsEvents.identify();
    
    setTimeout(function() {
      var expectProperties = {
        company: { id: "companyId", name: "companyName", companyIndustry: "K-12 Education", parentId: "parent123" },
        companyId: "companyId",
        companyName: "companyName",
        companyIndustry: "K-12 Education",
        parentId: "parent123",
        userId: "username",
        email: "user@email.com",
        firstName: "firstName",
        lastName: "lastName",
        companyRole: "companyRole",
        registeredDate: "2020-01-01",
        subscriptionRenewalDate: undefined,
        subscriptionStatus: "Free",
        subscriptionTrialExpiryDate: undefined
      };
      identifySpy.should.have.been.calledWith("username",expectProperties);

      expect($window.dataLayer[$window.dataLayer.length-2].event).to.equal("analytics.identify");
      expect($window.dataLayer[$window.dataLayer.length-2].userId).to.equal("username");
      expect($window.dataLayer[$window.dataLayer.length-2].analytics.user.properties).to.deep.equal(expectProperties);

      trackSpy.should.have.been.calledWithMatch("logged in",expectProperties);
      expect($window.dataLayer[$window.dataLayer.length-1].event).to.equal("analytics.track");
      var actualProperties = $window.dataLayer[$window.dataLayer.length-1].analytics.event.properties;
      Object.keys(expectProperties).forEach(function(key) {
        expect(actualProperties[key]).to.deep.equal(expectProperties[key]);
      });
      expect(actualProperties.loginDate).to.be.a("date");

      done();
    }, 10);
  });

  it("should identify user but not send 'logged in' event if user has not finalized registration", function(done) {
    var identifySpy = sinon.spy(analyticsFactory, "identify");
    var trackSpy = sinon.spy(analyticsFactory, "track");

    profile.termsAcceptanceDate = undefined;

    analyticsEvents.identify();
    
    setTimeout(function() {
      var expectProperties = {
        company: { id: "companyId", name: "companyName", companyIndustry: "K-12 Education", parentId: "parent123" },
        companyId: "companyId",
        companyName: "companyName",
        companyIndustry: "K-12 Education",
        parentId: "parent123",
        userId: "username",
        email: undefined,
        firstName: "",
        lastName: "",
        companyRole: "",
        registeredDate: undefined,
        subscriptionRenewalDate: undefined,
        subscriptionStatus: "Free",
        subscriptionTrialExpiryDate: undefined
      };
      identifySpy.should.have.been.calledWith("username",expectProperties);

      trackSpy.should.not.have.been.called;
      
      done();
    }, 10);
  });

  it("should identify user when authorized and track logged in event", function(done) {
    var identifySpy = sinon.spy(analyticsFactory, "identify");
    var trackSpy = sinon.spy(analyticsFactory, "track");

    $scope.$broadcast("risevision.user.authorized");
    $scope.$digest();
    
    setTimeout(function() {
      var expectedProperties = {
        company: { id: "companyId", name: "companyName", companyIndustry: "K-12 Education", parentId: "parent123" },
        companyId: "companyId",
        companyName: "companyName",
        companyIndustry: "K-12 Education",
        parentId: "parent123",
        userId: "username",
        email: undefined,
        firstName: "",
        lastName: "",
        companyRole: "",
        registeredDate: "2020-01-01",
        subscriptionRenewalDate: undefined,
        subscriptionStatus: "Free",
        subscriptionTrialExpiryDate: undefined
      };

      identifySpy.should.have.been.calledWith("username",expectedProperties);

      trackSpy.should.have.been.calledWithMatch("logged in",expectedProperties);

      done();
    }, 10);
  });

  it("should not send company information if company is undefined", function(done) {
    var identifySpy = sinon.spy(analyticsFactory, "identify");    

    companyId = null;
    
    $scope.$broadcast("risevision.user.authorized");
    $scope.$digest();
    
    setTimeout(function() {
      identifySpy.should.have.been.calledWith("username",{
        userId: "username",
        email: undefined,
        firstName: "",
        lastName: "",
        companyRole: "",
        registeredDate: "2020-01-01"
      });
      done();
    }, 10);
  });
  
  it("should track page views", function(done) {
    var pageSpy = sinon.spy(analyticsFactory, "page");

    $scope.$broadcast("$viewContentLoaded");
    $scope.$digest();
    
    setTimeout(function() {
      var expectProperties = {url:"/somepath", path:"/somepath", referrer:"", category: "apps"};
           
      pageSpy.should.have.been.calledWith(expectProperties);
      expect(analyticsFactory.location).to.equal("/somepath");

      expect($window.dataLayer[$window.dataLayer.length-1].event).to.equal("analytics.page");
      expect($window.dataLayer[$window.dataLayer.length-1].eventName).to.equal("page viewed");
      expect($window.dataLayer[$window.dataLayer.length-1].analytics.event.properties).to.deep.equal(expectProperties);
      
      done();
    }, 10);
  });

  it("should track events", function() {
    var properties = {name:"name"};
    analyticsFactory.track("test", properties);
    
    expect($window.dataLayer[$window.dataLayer.length-1].event).to.equal("analytics.track");
    expect($window.dataLayer[$window.dataLayer.length-1].eventName).to.equal("test");
    properties.category = "apps";
    expect($window.dataLayer[$window.dataLayer.length-1].analytics.event.properties).to.equal(properties);
  });

});
