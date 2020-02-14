"use strict";

describe("Services: $exceptionHandler", function() {
  beforeEach(module('risevision.common.components.logging'));
  var $exceptionHandler, bigQueryLogging, analyticsFactory;

  beforeEach(module(function($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.factory("bigQueryLogging", [function () {
      return {
        logEvent: sinon.stub()
      };
    }]);
    $provide.factory("analyticsFactory", [function () {
      return {
        track: sinon.stub()
      };
    }]);

  }));

  beforeEach(function() {      
    inject(function($injector){
      $exceptionHandler = $injector.get("$exceptionHandler");
      bigQueryLogging = $injector.get("bigQueryLogging");
      analyticsFactory = $injector.get("analyticsFactory");
    });
  });

  it("should exist",function() {
    expect($exceptionHandler).to.be.a("function");
  });

  describe("logException:", function(){
    it("should handle caught exceptions",function() {
      $exceptionHandler("exception","details", true);

      bigQueryLogging.logEvent.should.have.been.calledWith('Exception', sinon.match.string);
      analyticsFactory.track.should.have.been.calledWith('Exception', sinon.match.object);
    });

    it("should handle uncaught exceptions",function() {
      $exceptionHandler("exception","details", false);

      bigQueryLogging.logEvent.should.have.been.calledWith('Uncaught Exception', sinon.match.string);
    });

    it("should handle exception cause",function() {
      $exceptionHandler("exception","details", true);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'value: exception; cause: details');
    });

    it("should parse errors",function() {
      var error = new Error("failure");
      $exceptionHandler(error, null, false);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'error: Error: failure');
    });

    it("should parse responses",function() {
      var response = {
        code: "404",
        message: "Not found"
      };
      $exceptionHandler(response, null, false);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'response: 404: Not found');
    });

    it("should stringify other objects",function() {
      var exception = {
        message: "Not found"
      };
      $exceptionHandler(exception, null, false);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'value: {"message":"Not found"}');
    });

    it("should handle failure to stringify",function() {
      var circularReference = {otherData: 123};
      circularReference.myself = circularReference;

      $exceptionHandler(circularReference, null, false);

      bigQueryLogging.logEvent.should.have.been.calledWith(sinon.match.string, 'value: [object Object]');
    });

  }); 
});
