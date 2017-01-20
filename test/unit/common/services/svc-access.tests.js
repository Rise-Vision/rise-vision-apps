'use strict';
describe('service: access:', function() {
  beforeEach(module('risevision.apps.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        authenticate : function(){
          var deferred = Q.defer();
                  
          if (authenticate) {
            deferred.resolve("auth");
          }
          else {
            deferred.reject("not auth");
          }
          
          return deferred.promise
        },
        isRiseVisionUser : function(){
          return isRiseVisionUser;
        },
        isLoggedIn: function() {
          return isLoggedIn;
        },
        _restoreState: function(){}
      }
    });
    $provide.service('$state', function() {
      return {
        go: function(state) {
          newState = state;
        }
      };
    });
  }));
  
  var canAccessApps, authenticate, isRiseVisionUser, isLoggedIn, newState;
  beforeEach(function(){
    isRiseVisionUser = true;
    authenticate = true;
    isLoggedIn = true;

    inject(function($injector){
      canAccessApps = $injector.get('canAccessApps');
    });
  });

  it('should exist',function(){
    expect(canAccessApps).to.be.truely;
    expect(canAccessApps).to.be.a('function');
  });
  
  it('should return resolve if authenticated',function(done){
    canAccessApps()
    .then(function(){
      done();
    })
    .then(null, function() {
      done("error");
    });
  });
  
  it('should reject if user is not Rise Vision User',function(done){
    isRiseVisionUser = false;
    authenticate = true;
    isLoggedIn = true;

    canAccessApps()
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      expect(newState).to.equal('apps.launcher.unregistered');

      done();
    });  
  });
  
  it('should reject if user is not Rise Vision User',function(done){
    isRiseVisionUser = false;
    authenticate = true;
    isLoggedIn = false;

    canAccessApps()
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      expect(newState).to.equal('apps.launcher.unauthorized');

      done();
    });  
  });
  
  it('should reject if user is not authenticated',function(done){
    isRiseVisionUser = true;
    authenticate = false;
    isLoggedIn = false;

    canAccessApps()
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      expect(newState).to.equal('apps.launcher.unauthorized');

      done();
    });  
  });

});
