"use strict";
describe("service: storeAuthorization:", function() {
  var STORE_SERVER_URL = "http://example.com/";
  var STORE_AUTHORIZATION_URL = STORE_SERVER_URL + "v1/widget/auth";
  
  beforeEach(module("risevision.store.authorization"));

  beforeEach(module(function ($provide) {
    $provide.value("environment", {
      STORE_SERVER_URL: STORE_SERVER_URL
    });
    $provide.service("$q", function() {return Q;});
    $provide.service("userState",function(){
      return {
        _restoreState: function(){},
        getSelectedCompanyId: function(){
          return "cid";
        }
      };
    });
  }));
  
  var storeAuthorization, $httpBackend;
  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get("$httpBackend");
      storeAuthorization = $injector.get("storeAuthorization");
    });
  });

  it("should exist",function(){
    expect(storeAuthorization).to.be.ok;
    expect(storeAuthorization.check).to.be.a("function");
  });
  
  it("should validate product code",function(done){
    $httpBackend.expect("GET", STORE_AUTHORIZATION_URL+"?cid=cid&pc=pc&startTrial=false").respond(200, {authorized: true});
    storeAuthorization.check("pc").then(function(authorized){
      expect(authorized).to.be.true;
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);    
  });

  it("should reject not authorized product",function(done){
    $httpBackend.expect("GET", STORE_AUTHORIZATION_URL+"?cid=cid&pc=pc&startTrial=false").respond(200, {authorized: false});
    storeAuthorization.check("pc").then(null,function(authorized){
      expect(authorized).to.be.false;
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);   
  });

  it("should reject on http error",function(done){
    $httpBackend.expect("GET", STORE_AUTHORIZATION_URL+"?cid=cid&pc=pc&startTrial=false").respond(500, {error: "Error"});
    storeAuthorization.check("pc").then(null,function(error){
      expect(error).be.ok;
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);   
  });
});
