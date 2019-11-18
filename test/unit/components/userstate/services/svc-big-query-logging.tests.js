"use strict";

describe("Services: bigQueryLogging", function() {
  beforeEach(module("risevision.common.components.logging"));
  var bigQueryLogging, httpResp, forceHttpError, externalLogEventSpy;

  beforeEach(module(function($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.factory("externalLogging", [function () {
      return {
        logEvent: function(eventName, eventDetails, eventValue,
          userId, companyId) {
          console.log(eventName, eventDetails, eventValue,userId, companyId);
          var deferred = Q.defer();
          if (forceHttpError) {
            deferred.reject("Http Error");
          } else {
            deferred.resolve(httpResp);  
          }
          deferred.resolve(httpResp);
          return deferred.promise;
        }
      };
    }]);
    $provide.factory("userState", [function () {
      return {
        getUsername: function() {return "user1";},
        getSelectedCompanyId: function() {return "company1";}
      };
    }]);

  }));

  beforeEach(function() {      
    inject(function($injector){
      forceHttpError = false;
      bigQueryLogging = $injector.get("bigQueryLogging");
      var externalLogging = $injector.get("externalLogging");
      externalLogEventSpy = sinon.spy(externalLogging,"logEvent");
    });
  });

  it("should exist",function() {
    expect(bigQueryLogging.logEvent).to.be.a("function");
  });

  describe("logEvent:", function(){
    it("should POST with userId and companyId if not provided",function(done){
      bigQueryLogging.logEvent("eventName","details",1).then(function(){
        externalLogEventSpy.should.have.been.calledWith("eventName","details",1,"user1","company1");
        done();
      }).then(null,done);
    });

    it("should POST with custom userId and companyId",function(done){
      bigQueryLogging.logEvent("eventName","details",1, "myUser", "myCompany").then(function(){
        externalLogEventSpy.should.have.been.calledWith("eventName","details",1,"myUser","myCompany");
        done();
      }).then(null,done);
    });

    it("should handle http error",function(done){
      forceHttpError = true;
      bigQueryLogging.logEvent("eventName","details",1).then(function(){
        done(new Error("Should have rejected"));
      },function(){
        done();
      }).then(null,done);
    });    
  }); 

});
