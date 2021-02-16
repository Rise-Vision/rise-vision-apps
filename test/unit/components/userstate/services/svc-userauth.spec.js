"use strict";
describe("service: userauth:", function() {
  beforeEach(module("risevision.common.components.userstate"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.service("riseAPILoader",function () {
      return function(){
        var deferred = Q.defer();

        deferred.resolve({
          userauth: {
            add: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.data).to.be.ok;
              expect(obj.data.username).to.be.ok;
              expect(obj.data.password).to.be.ok;

              if (returnResult) {
                return Q.resolve({
                  result: obj.data.username
                });
              } else {
                return Q.reject("API Failed");
              }
            },
            updatePassword: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.data).to.be.ok;
              expect(obj.data.username).to.be.ok;
              expect(obj.data.oldPassword).to.be.ok;
              expect(obj.data.newPassword).to.be.ok;

              if (returnResult) {
                return Q.resolve({
                  result: obj.data.username
                });
              } else {
                return Q.reject("API Failed");
              }
            }, 
            login: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.data).to.be.ok;
              expect(obj.data.username).to.be.ok;
              expect(obj.data.password).to.be.ok;

              if (returnResult) {
                return Q.resolve("token");
              } else {
                return Q.reject("API Failed");
              }
            },
            refreshToken: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.data).to.be.ok;
              expect(obj.data.token).to.be.ok;

              if (returnResult) {
                return Q.resolve("refreshedToken");
              } else {
                return Q.reject("API Failed");
              }
            },
            requestPasswordReset: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.data).to.be.ok;
              expect(obj.data.username).to.be.ok;

              if (returnResult) {
                return Q.resolve("requested password reset");
              } else {
                return Q.reject("requestPasswordReset Failed");
              }
            },
            resetPassword: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.data).to.be.ok;
              expect(obj.data.username).to.be.ok;

              if (returnResult) {
                return Q.resolve("reseted password");
              } else {
                return Q.reject("resetPassword Failed");
              }
            },
          }
        });
        return deferred.promise;
      };
    });

  }));
  var userauth, returnResult;
  beforeEach(function(){
    returnResult = true;

    inject(function($injector){
      userauth = $injector.get("userauth");
    });
  });

  it("should exist",function(){
    expect(userauth).to.be.ok;
    expect(userauth.add).to.be.a("function");
    expect(userauth.updatePassword).to.be.a("function");
    expect(userauth.login).to.be.a("function");
    expect(userauth.refreshToken).to.be.a("function");
  });

  describe("add:",function(){
    it("should add user auth",function(done){
      userauth.add("username", "newpass")
        .then(function(resp){
          expect(resp).to.be.ok;
          expect(resp.result).to.be.ok;
          expect(resp.result).to.equal("username");

          done();
        })
        .then(null,done);
    });

    it("should handle failure to add user auth",function(done){
      returnResult = false;
      userauth.add("username", "newpass")
        .then(function(resp) {
          done(resp);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal("API Failed");
          done();
        })
        .then(null,done);
    });
  });  

  describe("update password:",function(){
    it("should update user auth",function(done){
      userauth.updatePassword("username", "oldpass", "newpass")
        .then(function(resp){
          expect(resp).to.be.ok;
          expect(resp.result).to.be.ok;
          expect(resp.result).to.equal("username");

          done();
        })
        .then(null,done);
    });

    it("should handle failure to update user auth",function(done){
      returnResult = false;
      userauth.updatePassword("username", "oldpass", "newpass")
        .then(function(resp) {
          done(resp);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal("API Failed");
          done();
        })
        .then(null,done);
    });
  });
  
  describe("login:",function(){
    it("should login user",function(done){
      userauth.login("username", "pass")
        .then(function(resp){
          expect(resp).to.be.ok;
          expect(resp).to.equal("token");

          done();
        })
        .then(null,done);
    });

    it("should handle failure to login user",function(done){
      returnResult = false;
      userauth.login("username", "pass")
        .then(function(resp) {
          done(resp);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal("API Failed");
          done();
        })
        .then(null,done);
    });
  });
  
  describe("refreshToken:",function(){
    it("should login user",function(done){
      userauth.refreshToken("username", "newToken")
        .then(function(resp){
          expect(resp).to.be.ok;
          expect(resp).to.equal("refreshedToken");

          done();
        })
        .then(null,done);
    });

    it("should handle failure to login user",function(done){
      returnResult = false;
      userauth.refreshToken("username", "newToken")
        .then(function(resp) {
          done(resp);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal("API Failed");
          done();
        })
        .then(null,done);
    });
  });

  describe("requestPasswordReset:",function(){
    it("should request a password reset",function(done){
      userauth.requestPasswordReset("username")
        .then(function(resp){
          expect(resp).to.be.ok;
          expect(resp).to.equal("requested password reset");

          done();
        })
        .then(null,done);
    });

    it("should handle failure to request a password reset",function(done){
      returnResult = false;
      userauth.requestPasswordReset("username")
        .then(function(resp) {
          done(resp);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal("requestPasswordReset Failed");
          done();
        })
        .then(null,done);
    });
  });

  describe("resetPassword:",function(){
    it("should reset the password",function(done){
      userauth.resetPassword("username", "passwordResetToken", "newPassword")
        .then(function(resp){
          expect(resp).to.be.ok;
          expect(resp).to.equal("reseted password");

          done();
        })
        .then(null,done);
    });

    it("should handle failure to reset the password",function(done){
      returnResult = false;
      userauth.resetPassword("username", "badPasswordResetToken", "newPassword")
        .then(function(resp) {
          done(resp);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal("resetPassword Failed");
          done();
        })
        .then(null,done);
    });
  });

});
