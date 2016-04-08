'use strict';
describe('service: canAccessStorage:', function() {
  beforeEach(module('risevision.storage.services'));

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
  
  var canAccessStorage, authenticate, isRiseVisionUser, isLoggedIn, newState;
  beforeEach(function(){
    isRiseVisionUser = true;
    authenticate = true;
    isLoggedIn = true;

    inject(function($injector){
      canAccessStorage = $injector.get('canAccessStorage');
    });
  });

  it('should exist',function(){
    expect(canAccessStorage).to.be.truely;
    expect(canAccessStorage).to.be.a('function');
  });
  
  it('should return resolve if authenticated',function(done){
    canAccessStorage()
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

    canAccessStorage()
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

    canAccessStorage()
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      expect(newState).to.equal('apps.storage.unauthorized');

      done();
    });  
  });
  
  it('should reject if user is not authenticated',function(done){
    isRiseVisionUser = true;
    authenticate = false;
    isLoggedIn = false;

    canAccessStorage()
    .then(function() {
      done("authenticated");
    })
    .then(null, function() {
      expect(newState).to.equal('apps.storage.unauthorized');

      done();
    });  
  });

});
