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

  describe("logException:", function(){
    beforeEach(function() {
      sinon.stub(bigQueryLogging, "logEvent");
    });

    it("should handle caught exceptions",function() {
      bigQueryLogging.logException("exception","details", true);

      bigQueryLogging.logEvent.should.have.been.calledWith('Exception', sinon.match.string);
    });

    it("should handle uncaught exceptions",function() {
      bigQueryLogging.logException("exception","details", false);

      bigQueryLogging.logEvent.should.have.been.calledWith('Uncaught Exception', sinon.match.string);
    });

    it("should handle exception cause",function() {
      bigQueryLogging.logException("exception","details", true);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'value: exception; cause: details');
    });

    it("should parse errors",function() {
      var error = new Error("failure");
      bigQueryLogging.logException(error, null, false);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'error: Error: failure');
    });

    it("should parse responses",function() {
      var response = {
        code: "404",
        message: "Not found"
      };
      bigQueryLogging.logException(response, null, false);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'response: 404: Not found');
    });

    it("should stringify other objects",function() {
      var exception = {
        message: "Not found"
      };
      bigQueryLogging.logException(exception, null, false);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'value: {"message":"Not found"}');
    });

    it("should handle failure to stringify",function() {
      var circularReference = {otherData: 123};
      circularReference.myself = circularReference;

      bigQueryLogging.logException(circularReference, null, false);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'value: [object Object]');
    });

  }); 
});
