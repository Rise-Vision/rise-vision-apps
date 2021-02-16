/* jshint expr:true */
"use strict";

describe("User Profile: getUserProfile", function() {

  var alfredo = {"username": "Alfredo Sanchez"};

  beforeEach(module("risevision.core.userprofile"));
  beforeEach(module("risevision.core.util"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});

    $provide.value("coreAPILoader", function() {
      var deffered = Q.defer();
      var gapi = {
        user: {
          get: function () {
            return {
              execute: function (callback) {
                setTimeout(function () {
                  callback({result: true, item: angular.copy(alfredo)});
                }, 0);
              }
            };
          },
          add: function() {
            return {
              execute: function (callback) {
                setTimeout(function () {
                  callback({result: true});
                }, 0);
              }
            };
          },
          patch: function() {
            return {
              execute: function (callback) {
                setTimeout(function () {
                  callback({result: true});
                }, 0);
              }
            };
          } 
        }
      };
      deffered.resolve(gapi);
      return deffered.promise;
    });
    $provide.value("CORE_URL", "");
    $provide.service("userTracker", function() { 
      return sinon.spy();
    });
    $provide.service("userState", function() { 
      return {
        getUsername: sinon.stub().returns("username"),
        checkUsername: sinon.stub().returns(true)
      }
    });

  }));

  it("should exist", function(done) {
    inject(function (getUserProfile) {
      expect(getUserProfile).to.be.ok;
      expect(getUserProfile).to.be.a("function");
      done();
    });
  });

  it("should return user info", function(done) {
    inject(function (getUserProfile) {
      getUserProfile("someusername").then(function (resp) {
        expect(resp).to.deep.equal(alfredo);
        done();
      }, done);
    });
  });

  it("should handle multiple simultaneous calls", function(done) {
    inject(function (getUserProfile, $q) {
      $q.all([getUserProfile("someusername"),
      getUserProfile("someusername1"),
      getUserProfile("someusername2"),
      getUserProfile("someusername3")]).then(function(results){
        expect(results).to.deep.equal([alfredo, alfredo, alfredo, alfredo]);
        done();
      }, done);
    });
  });

  describe("addUser",function(){
    var clearGetUserProfileCacheUsername, clearGetUserProfileCache;
    beforeEach(module(function ($provide) {
      $provide.value("getUserProfile", function(username,clear) {
        clearGetUserProfileCacheUsername = username;
        clearGetUserProfileCache = clear;
        var deffered = Q.defer();
        deffered.resolve({});
        return deffered.promise;
      });
    }));

    it("should clear getUserProfile cache for the username on success",function(done){
      inject(function (addUser) {
        addUser("companyId", "myUsername", {}).then(function(){
          expect(clearGetUserProfileCacheUsername).to.equal("myUsername");
          expect(clearGetUserProfileCache).to.be.true;          
          done();
        });
      });      
    });
  });

  describe("updateUser", function() {
    beforeEach(module(function ($provide) {
      $provide.value("getUserProfile", function(username,clear) {
        return Q.resolve();
      });
    }));

    it("should update user and track event", function(done) {
      inject(function (updateUser, userTracker) {
        var profile = {
          companyRole: "other"
        };
        updateUser("username", profile).then(function(){
          userTracker.should.have.been.calledWith("User Updated", "username", true, {updatedUserId: "username", updatedUserCompanyRole: "other"});
          done();
        });
      });
    });
  });

});
