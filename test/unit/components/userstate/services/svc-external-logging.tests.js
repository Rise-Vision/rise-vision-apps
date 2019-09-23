"use strict";

describe("Services: externalLogging", function() {
  beforeEach(module("risevision.common.components.logging"));
  var externalLogging, httpResp, httpCalls, postUrl, postData, postConfig, forceHttpError, clock;
  var providedToken = "123";

  beforeEach(module(function($provide) {
    $provide.value("ENABLE_EXTERNAL_LOGGING", true);
    $provide.service("$q", function() {return Q;});
    $provide.factory("$http", [function () {
      return {
        post: function(url,data, config) {
          httpCalls++;
          postUrl = url;
          postData = data;
          postConfig = config;
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
  }));

  beforeEach(function() { 
    clock = sinon.useFakeTimers(new Date(2015,8,4).getTime());     
    inject(function($injector){
      httpCalls = 0;
      forceHttpError = false;
      externalLogging = $injector.get("externalLogging");
    });
  });

  it("should exist",function() {
    expect(externalLogging.logEvent).to.be.a("function");
    expect(externalLogging.getToken).to.be.a("function");
  });

  describe("getToken:", function(){
    it("should get token",function(done){
      httpResp = {data: {access_token : providedToken }};
      externalLogging.getToken().then(function(token){
        expect(token).to.equal(providedToken);
        done();
      }).then(null,done);
    });

    it("should cache token",function(done){
      httpResp = {data: {access_token : providedToken }};
      externalLogging.getToken().then(function(){
        expect(httpCalls).to.equal(1);
        externalLogging.getToken().then(function(token){
          expect(httpCalls).to.equal(1);
          expect(token).to.equal(providedToken);
          done();
        });
      }).then(null,done);
    });  
  });

  describe("logEvent:", function(){
    it("should POST to big query",function(done){
      externalLogging.logEvent("eventName","details",1).then(function(){
        expect(postUrl).to.equal("https://www.googleapis.com/bigquery/v2/projects/client-side-events/datasets/Apps_Events/tables/apps_events/insertAll");

        expect(postData.rows[0].json.event).to.equal("eventName");
        expect(postData.rows[0].json.event_details).to.equal("details");
        expect(postData.rows[0].json.event_value).to.equal(1);
        clock.restore();
        done();
      }).then(null,done);
    });

    it("should handle http error",function(done){
      forceHttpError = true;
      externalLogging.logEvent("eventName","details",1).then(function(){
        done(new Error("Should have rejected"));
      },function(){
        done();
      }).then(null,done);
    });

    it("should provide token and content type",function(done){
      externalLogging.logEvent("eventName","details",1).then(function(){
        expect(postConfig.headers.Authorization).to.equal("Bearer "+providedToken);
        expect(postConfig.headers["Content-Type"]).to.equal("application/json");
        done();
      }).then(null,done);
    });

    it("should use correct templatePrefix",function(done){
      externalLogging.logEvent("eventName","details",1).then(function(){
        expect(postUrl).to.equal("https://www.googleapis.com/bigquery/v2/projects/client-side-events/datasets/Apps_Events/tables/apps_events/insertAll");
        expect(postData.templateSuffix).to.equal("20150904");
        done();
      }).then(null,done);
    });
  }); 

  afterEach(function(){
    clock.restore();
  });

});
