/*jshint expr:true */
"use strict";

describe("Services: segment analytics", function() {

  beforeEach(module("risevision.common.components.logging"));
  beforeEach(module(function ($provide) {
    $provide.factory("userState", [function () {
      return {
        getCopyOfProfile: function() {
          return {};
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
            companyIndustry: "K-12 Education"
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
  
  var segmentAnalytics, analyticsEvents, $scope, companyId, $window;
  beforeEach(function(){
    inject(function($rootScope, $injector){
      $scope = $rootScope;
      companyId = "companyId";
      
      segmentAnalytics = $injector.get("segmentAnalytics");
      $window = $injector.get("$window");
      segmentAnalytics.load(true);
      analyticsEvents = $injector.get("analyticsEvents");
      analyticsEvents.initialize();
    });
  });
  
  it("should exist, also methods", function() {
    expect(segmentAnalytics.load).to.be.a('function');
    expect(segmentAnalytics.track).to.be.a('function');
    expect(segmentAnalytics.identify).to.be.a('function');
    expect(segmentAnalytics.page).to.be.a('function');
  });

  it("should identify user", function(done) {
    var identifySpy = sinon.spy(segmentAnalytics, "identify");    

    analyticsEvents.identify();
    
    setTimeout(function() {
      var expectProperties = {
        company: { id: "companyId", name: "companyName", companyIndustry: "K-12 Education" },
        companyId: "companyId",
        companyName: "companyName",
        companyIndustry: "K-12 Education",
        email: undefined,
        firstName: "",
        lastName: ""
      };
      identifySpy.should.have.been.calledWith("username",expectProperties);

      expect($window.dataLayer[$window.dataLayer.length-1].event).to.equal("analytics.identify");
      expect($window.dataLayer[$window.dataLayer.length-1].userId).to.equal("username");
      expect($window.dataLayer[$window.dataLayer.length-1].analytics.user.properties).to.deep.equal(expectProperties);

      done();
    }, 10);
  });

  it("should identify user when authorized", function(done) {
    var identifySpy = sinon.spy(segmentAnalytics, "identify");    

    $scope.$broadcast("risevision.user.authorized");
    $scope.$digest();
    
    setTimeout(function() {
      identifySpy.should.have.been.calledWith("username",{
        company: { id: "companyId", name: "companyName", companyIndustry: "K-12 Education" },
        companyId: "companyId",
        companyName: "companyName",
        companyIndustry: "K-12 Education",
        email: undefined,
        firstName: "",
        lastName: ""
      });
      done();
    }, 10);
  });

  it("should not send company information if company is undefined", function(done) {
    var identifySpy = sinon.spy(segmentAnalytics, "identify");    

    companyId = null;
    
    $scope.$broadcast("risevision.user.authorized");
    $scope.$digest();
    
    setTimeout(function() {
      identifySpy.should.have.been.calledWith("username",{
        email: undefined,
        firstName: "",
        lastName: ""
      });
      done();
    }, 10);
  });
  
  it("should track page views", function(done) {
    var pageSpy = sinon.spy(segmentAnalytics, "page");

    $scope.$broadcast("$viewContentLoaded");
    $scope.$digest();
    
    setTimeout(function() {
      var expectProperties = {url:"/somepath", path:"/somepath", referrer:""};
           
      pageSpy.should.have.been.calledWith(expectProperties);
      expect(segmentAnalytics.location).to.equal("/somepath");

      expect($window.dataLayer[$window.dataLayer.length-1].event).to.equal("analytics.page");
      expect($window.dataLayer[$window.dataLayer.length-1].eventName).to.equal("page viewed");
      expect($window.dataLayer[$window.dataLayer.length-1].analytics.event.properties).to.deep.equal(expectProperties);
      
      done();
    }, 10);
  });

  it("should track events", function() {
    var properties = {name:"name"};
    segmentAnalytics.track("test", properties);
    
    expect($window.dataLayer[$window.dataLayer.length-1].event).to.equal("analytics.track");
    expect($window.dataLayer[$window.dataLayer.length-1].eventName).to.equal("test");
    expect($window.dataLayer[$window.dataLayer.length-1].analytics.event.properties).to.equal(properties);
  });

});
