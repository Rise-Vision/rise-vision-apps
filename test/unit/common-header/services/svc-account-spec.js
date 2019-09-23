/*jshint expr:true */
"use strict";

describe("Services: account", function() {
  var riseApiFailure;

  beforeEach(module("risevision.common.account"));

  beforeEach(module(function ($provide) {
    riseApiFailure = false;
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.service("riseAPILoader", function () {
      return function() {
        var deferred = Q.defer();
        
        var riseApiResponse = function() {
          return {
            execute: function(callback) {
              if (riseApiFailure) {
                callback({
                  error: "some error"
                });
              }
              else {
                callback({
                  result: {},
                  item: {}
                });
              }
            }
          };
        };
        
        deferred.resolve({
          account: {
            agreeToTerms: riseApiResponse,
            add: riseApiResponse,
            get: riseApiResponse
          }
        });
        
        return deferred.promise;
      };
    });
    $provide.service("updateUser", function() {
      return function() {
        var deferred = Q.defer();
        
        deferred.resolve({});
        
        return deferred.promise;
      };
    });
  }));
  
  describe("agreeToTerms: ", function() {
    var agreeToTerms;
    
    beforeEach(function() {      
      inject(function($injector){
        agreeToTerms = $injector.get("agreeToTerms");
      });
    });

    it("should exist", function() {      
      expect(agreeToTerms).to.be.ok;
      expect(agreeToTerms).to.be.a("function");
    });

    it("should succeed", function(done) {
      agreeToTerms().then(function() {
        done();
      })
      .then(null, done);
    });
    
    it("should fail", function(done) {
      riseApiFailure = true;
      agreeToTerms().then(function() {
        done("success");
      }, function() {
        done();
      });
    });

  });

  describe("agreeToTermsAndUpdateUser: ", function() {
    var agreeToTermsAndUpdateUser;
    
    beforeEach(function() {      
      inject(function($injector){
        agreeToTermsAndUpdateUser = $injector.get("agreeToTermsAndUpdateUser");
      });
    });

    it("should exist", function() {      
      expect(agreeToTermsAndUpdateUser).to.be.ok;
      expect(agreeToTermsAndUpdateUser).to.be.a("function");
    });    

    it("should succeed", function(done) {
      agreeToTermsAndUpdateUser().then(function() {
        done();
      })
      .then(null, done);
    });
    
    it("should fail", function(done) {
      riseApiFailure = true;
      agreeToTermsAndUpdateUser().then(function() {
        done("success");
      }, function() {
        done();
      });
    });
  });  

  describe("registerAccount: ", function() {
    var registerAccount;
    
    beforeEach(function() {      
      inject(function($injector){
        registerAccount = $injector.get("registerAccount");
      });
    });

    it("should exist", function() {      
      expect(registerAccount).to.be.ok;
      expect(registerAccount).to.be.a("function");
    });    

    it("should succeed", function(done) {
      registerAccount().then(function() {
        done();
      })
      .then(null, done);
    });
    
    it("should fail", function(done) {
      riseApiFailure = true;
      registerAccount().then(function() {
        done("success");
      }, function() {
        done();
      });
    });
  });
  
  describe("addAccount: ", function() {
    var addAccount;
    
    beforeEach(function() {      
      inject(function($injector){
        addAccount = $injector.get("addAccount");
      });
    });

    it("should exist", function() {      
      expect(addAccount).to.be.ok;
      expect(addAccount).to.be.a("function");
    });    

    it("should succeed", function(done) {
      addAccount().then(function() {
        done();
      })
      .then(null, done);
    });
    
    it("should fail", function(done) {
      riseApiFailure = true;
      addAccount().then(function() {
        done("success");
      }, function() {
        done();
      });
    });
  });

  describe("getAccount: ", function() {
    var getAccount;
    
    beforeEach(function() {      
      inject(function($injector){
        getAccount = $injector.get("getAccount");
      });
    });

    it("should exist", function() {      
      expect(getAccount).to.be.ok;
      expect(getAccount).to.be.a("function");
    });    

    it("should succeed", function(done) {
      getAccount().then(function() {
        done();
      })
      .then(null, done);
    });
    
    it("should fail", function(done) {
      riseApiFailure = true;
      getAccount().then(function() {
        done("success");
      }, function() {
        done();
      });
    });
  });

});
