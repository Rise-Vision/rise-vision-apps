"use strict";
describe("service: customAuthFactory:", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("userauth", function() {
      return {
        add: function(username, password){
          var deferred = Q.defer();
          
          expect(username).to.equal("newUser");
          expect(password).to.equal("newPass");

          if (authenticateResult) {
            deferred.resolve(authenticateResult);
          } else {
            deferred.reject("not auth");
          }
          
          return deferred.promise;
        },
        login: function(username, password){
          var deferred = Q.defer();
          
          expect(username).to.equal("testUser");
          expect(password).to.equal("testPass");

          if (authenticateResult) {
            deferred.resolve(authenticateResult);
          } else {
            deferred.reject("not auth");
          }
          
          return deferred.promise;
        }        
      };
    });
    $provide.service("userState",function(){
      return userState = {
        _restoreState: function(){},
        _state: {}
      };
    });
    $provide.service("gapiLoader", function () {
      return gapiLoader = sinon.spy(function() {
        return Q.resolve({
          auth: gapiAuth = {
            setToken: sinon.spy()
          }
        });
      });
    });
  }));
  
  var customAuthFactory, userState, gapiLoader, gapiAuth, authenticateResult;
  beforeEach(function(){
    authenticateResult = true;

    inject(function($injector){
      customAuthFactory = $injector.get("customAuthFactory");
    });
  });

  it("should exist",function(){
    expect(customAuthFactory).to.be.ok;
    expect(customAuthFactory.authenticate).to.be.a("function");
    expect(customAuthFactory.addUser).to.be.a("function");
  });
  
  describe("authenticate", function() {
    it("should reject if no credentials are provided and no token exists",function(done){
      customAuthFactory.authenticate()
        .then(function() {
          done("authenticated");
        })
        .then(null, function() {
          done();
        });
    });

    it("should resolve and update gapi token if it exists",function(done){
      userState._state.userToken = {
        token: "token"
      };
      customAuthFactory.authenticate()
        .then(function(userToken){
          gapiLoader.should.have.been.called;
          gapiAuth.setToken.should.have.been.calledWith("token");

          expect(userToken).to.equal(userState._state.userToken);

          done();
        })
        .then(null, function() {
          done("error");
        });
    });

    it("should resolve if correct username/password are provided",function(done){
      authenticateResult = { 
        result: {
          item: "newToken"
        }
      };

      customAuthFactory.authenticate({username: "testUser", password: "testPass"})
        .then(function(userToken) {
          var token = {
            access_token: "newToken",
            expires_in: "3600",
            token_type: "Bearer"
          };

          gapiLoader.should.have.been.called;
          gapiAuth.setToken.should.have.been.calledWith(token);

          expect(userToken).to.deep.equal({
            email: "testUser",
            token: token
          });

          done();
        })
        .then(null, function() {
          done("error");
        });
    });
    
    it("should reject if authenticate call fails",function(done){
      authenticateResult = false;

      customAuthFactory.authenticate({username: "testUser", password: "testPass"})
        .then(function() {
          done("authenticated");
        })
        .then(null, function() {
          done();
        });
    });
    
    it("should reject if no token is provided",function(done){
      authenticateResult = { 
        result: {}
      };

      customAuthFactory.authenticate({username: "testUser", password: "testPass"})
        .then(function() {
          done("authenticated");
        })
        .then(null, function() {
          done();
        });
    });
        
  });
  
  describe("addUser: ", function() {
    it("should reject if no username/password are provided",function(done){
      customAuthFactory.addUser({username: "newUser"})
        .then(function() {
          done("authenticated");
        })
        .then(null, function() {
          done();
        });
    });

    it("should add user", function(done) {
      customAuthFactory.addUser({username: "newUser", password: "newPass"})
        .then(function(){
          done();
        })
        .then(null, function() {
          done("error");
        });
    });

    it("should handle failure to add user if newUser variable is true",function(done){
      authenticateResult = false;

      customAuthFactory.addUser({username: "newUser", password: "newPass"})
        .then(function() {
          done("authenticated");
        })
        .then(null, function() {
          done();
        });
    });
  });

});
