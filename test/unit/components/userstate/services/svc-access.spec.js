"use strict";
describe("service: access:", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("userAuthFactory", function() {
      return {
        authenticate : function(){
          var deferred = Q.defer();
                  
          if (authenticate) {
            deferred.resolve("auth");
          }
          else {
            deferred.reject("not auth");
          }
          
          return deferred.promise;
        }        
      };
    });
    $provide.service("userState",function(){
      return {
        isRiseVisionUser : function(){
          return isRiseVisionUser;
        },
        isLoggedIn: function() {
          return isLoggedIn;
        },
        _restoreState: function(){},
        _state: {}
      };
    });
    $provide.service("$state", function() {
      return $state = {
        go: sinon.spy(),
        get: sinon.spy(function() {
          return stateAvailable;
        })
      };
    });
    $provide.service("urlStateService", function() {
      return {
        get: function() {
          return "newState";
        }
      };
    });
  }));
  
  var canAccessApps, $state, stateAvailable, authenticate, isRiseVisionUser, isLoggedIn;
  beforeEach(function(){
    isRiseVisionUser = true;
    authenticate = true;
    isLoggedIn = true;
    stateAvailable = true;

    inject(function($injector){
      canAccessApps = $injector.get("canAccessApps");
    });
  });

  it("should exist",function(){
    expect(canAccessApps).to.be.truely;
    expect(canAccessApps).to.be.a("function");
  });

  it("should resolve if authenticated",function(done){
    canAccessApps()
    .then(function(){
      done();
    })
    .then(null, function() {
      done("error");
    });
  });
  
  it("should reject if user is not Rise Vision User",function(done){
    isRiseVisionUser = false;
    authenticate = true;
    isLoggedIn = true;

    canAccessApps()
    .then(function() {
      done("authenticated");
    })
    .then(null, function(result) {
      expect(result).to.equal('unauthenticated');

      $state.go.should.have.been.calledWith("common.auth.unregistered", {
        state: "newState"
      }, {
        reload: true,
        location: 'replace'
      });

      done();
    });  
  });
  
  it("should not replace location if we want to allowReturn to the original page",function(done){
    isRiseVisionUser = false;
    authenticate = true;
    isLoggedIn = true;

    canAccessApps(undefined, true)
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      $state.go.should.have.been.calledWith("common.auth.unregistered", {
        state: "newState"
      }, {
        reload: true,
        location: true
      });

      done();
    });  
  });
  
  it("should resolve and not redirect if unregistered state is not available",function(done){
    isRiseVisionUser = false;
    authenticate = true;
    isLoggedIn = true;
    stateAvailable = false;

    canAccessApps()
    .then(function() {
      $state.go.should.not.have.been.called;

      done();
    })
    .then(null, function() {
      done("error");
    });  
  });
  
  it("should reject if user is not Rise Vision User",function(done){
    isRiseVisionUser = false;
    authenticate = true;
    isLoggedIn = false;

    canAccessApps()
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      $state.go.should.have.been.calledWith("common.auth.unauthorized", {
        state: "newState"
      }, {
        reload: true,
        location: 'replace'
      });

      done();
    });
  });
  
  it("should reject if user is not authenticated",function(done){
    isRiseVisionUser = true;
    authenticate = false;
    isLoggedIn = false;

    canAccessApps()
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      $state.go.should.have.been.calledWith("common.auth.unauthorized", {
        state: "newState"
      }, {
        reload: true,
        location: 'replace'
      });

      done();
    });
  });
  
  it("should redirect to login page if signup is true",function(done){
    isRiseVisionUser = true;
    authenticate = false;
    isLoggedIn = false;

    canAccessApps(true)
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      $state.go.should.have.been.calledWith("common.auth.createaccount", {
        state: "newState"
      }, {
        reload: true,
        location: 'replace'
      });

      done();
    });
  });

});
