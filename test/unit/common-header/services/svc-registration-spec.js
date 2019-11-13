/*jshint expr:true */

describe("Services: Registration", function() {
  var loggedIn;
  
  beforeEach(module("risevision.common.registration"));

  beforeEach(module(function($provide) {
    loggedIn = false;
    $provide.service("$q", function() {return Q;});

    $provide.factory("userState", [function () {
      return {
        isLoggedIn: function() {
          return loggedIn;
        },
        getUsername: function() {},
        _restoreState: function() {}
      };
    }]);
  }));

  it("should exist", function(done) {
    inject(function(uiStatusDependencies) {
      expect(uiStatusDependencies).to.be.ok;
      done();
    });
  });
  
  describe("signedInWithGoogle: ", function() {
    var signedInWithGoogle;
    
    beforeEach(function() {      
      inject(function($injector){
        signedInWithGoogle = $injector.get("signedInWithGoogle");
      });
    });
    
    it("should exist", function() {
      expect(signedInWithGoogle).to.be.ok;
    });

    it("should succeed", function(done) {
      loggedIn = true;
      
      signedInWithGoogle().then(function() {
        done();
      })
      .then(null,done);
    });

    it("should fail", function(done) {
      loggedIn = false;
      
      signedInWithGoogle().then(function() {
        done("failed");
      }, function() {
        done();
      })
      .then(null,done);
    });

  });
  
  describe("notLoggedIn: ", function() {
    var notLoggedIn;
    
    beforeEach(function() {      
      inject(function($injector){
        notLoggedIn = $injector.get("notLoggedIn");
      });
    });
    
    it("should exist", function() {
      expect(notLoggedIn).to.be.ok;
    });

    it("should succeed", function(done) {
      loggedIn = false;
      
      notLoggedIn().then(function() {
        done();
      })
      .then(null,done);
    });

    it("should fail", function(done) {
      loggedIn = true;
      
      notLoggedIn().then(function() {
        done("failed");
      }, function() {
        done();
      })
      .then(null,done);
    });

  });
    
  describe("registeredAsRiseVisionUser: ", function() {
    var registeredAsRiseVisionUser;
    var registered, error;
    
    beforeEach(module(function($provide) {
      registered = false, error = false;
      
      $provide.factory("getUserProfile", [function() {
        return function() {
          var deferred = Q.defer();
          
          if (!error) {
            var profile = {
              email: "user@gmail.com",
              mailSyncEnabled: false
            };
            deferred.resolve(registered ? profile : {});
          }
          else {
            deferred.reject(error);
          }
          
          return deferred.promise;
        };
      }]);
    }));
    
    beforeEach(function() {      
      inject(function($injector){
        registeredAsRiseVisionUser = $injector.get("registeredAsRiseVisionUser");
      });
    });
    
    it("should exist", function() {
      expect(registeredAsRiseVisionUser).to.be.ok;
    });

    it("registered user should succeed", function(done) {
      registered = true;
      
      registeredAsRiseVisionUser().then(function(profile) {
        expect(profile.email).to.equal("user@gmail.com");
        
        done();
      })
      .then(null,done);
    });

    it("profile data missing should fail", function(done) {
      registered = false;
      
      registeredAsRiseVisionUser().then(function() {
        done("failed");
      }, function(result) {
        expect(result).to.equal("registeredAsRiseVisionUser");

        done();
      })
      .then(null,done);
    });

    it("profile not found should fail on 403 error", function(done) {
      error = {code: 403};
      
      registeredAsRiseVisionUser().then(function() {
        done("failed");
      }, function(result) {
        expect(result).to.equal("registeredAsRiseVisionUser");

        done();
      })
      .then(null,done);
    });

    it("should fail on other errors but not return the registeredAsRiseVisionUser status", function(done) {
      error = true;
      
      registeredAsRiseVisionUser().then(function() {
        done("failed");
      }, function(result) {
        expect(result).to.not.be.ok;

        done();
      })
      .then(null,done);
    });

  });

});
