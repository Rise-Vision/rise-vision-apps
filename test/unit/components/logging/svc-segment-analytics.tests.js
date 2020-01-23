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
    expect(segmentAnalytics.load).to.be.ok;
    ["load", "trackSubmit", "trackClick", "trackLink",
      "trackForm",
      "pageview", "identify", "group", "track", "ready", "alias",
      "page",
      "once", "off", "on"].forEach(
    function (method) {
      expect(segmentAnalytics).to.have.property(method);
      expect(segmentAnalytics[method]).to.be.a("function");
    });
    expect($window.analytics.SNIPPET_VERSION).to.equal("4.0.0");
  });

  it("should register ready callback", function() {
    expect($window.analytics).to.be.an("array");

    expect($window.analytics).to.have.length.greaterThan(1);
    expect($window.analytics[0][0]).to.equal("ready");
  });

  it("should identify user", function(done) {
    var identifySpy = sinon.spy(segmentAnalytics, "identify");    

    analyticsEvents.identify();
    
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
  
  it("should call page()", function(done) {
    var pageSpy = sinon.spy(segmentAnalytics, "page");

    $scope.$broadcast("$viewContentLoaded");
    $scope.$digest();
    
    setTimeout(function() {
      pageSpy.should.have.been.calledWith({url:"/somepath", path:"/somepath", referrer:""});
      expect(segmentAnalytics.location).to.equal("/somepath");
      
      done();
    }, 10);
  });

  it("should add url property", function() {
    var res = segmentAnalytics.track("test", {});

    var addedEvent = res.pop();
    var eventProps = addedEvent[2];

    expect(eventProps.url).to.equal("test.com");
  });

});
