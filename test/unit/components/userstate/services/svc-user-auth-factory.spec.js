/*jshint expr:true */

"use strict";

xdescribe("Services: userAuthFactory", function() {
  var path = "";

  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.value("$location", {
      search: function () {
        return {};
      },
      path: function () {
        return path;
      },
      protocol: function () {
        return "protocol";
      },
      url: function() {
        return "";
      }
    });

    $provide.value("$loading", $loading = {
      startGlobal: sinon.spy(),
      stopGlobal: sinon.spy()
    });

    $provide.service("userState", function() {
      return userState = {
        _state: {
          user: {
            username: "username@test.com"
          },
          profile: {
            username: "username@test.com"
          }
        },
        getUsername: function() {
          return "username@test.com";
        },
        getSelectedCompanyId: function() {
          return "companyId";
        },
        refreshProfile: sinon.stub().returns(Q.resolve()),
        isRiseAuthUser: function() {
          return isRiseAuthUser;
        },
        _resetState: sinon.spy(),
        _restoreState: function() {},
        _setIsRiseAuthUser: sinon.spy()
      };
    });

    $provide.service("googleAuthFactory", function() {
      return googleAuthFactory = {
        authenticate: sinon.stub().resolves({
          id: "id",
          email: "username@test.com",
          picture: "picture"
        }),
        signOut: sinon.stub().resolves()
      };
    });

    $provide.service("customAuthFactory", function() {
      return customAuthFactory = {
        authenticate: sinon.stub().resolves({
          id: "id",
          email: "username@test.com",
          picture: "picture"
        }),
      };
    });

    $provide.factory("rvTokenStore", function () {
      return rvTokenStore = {
        read: sinon.spy(),
        write: sinon.spy(),
        clear: sinon.spy()
      };
    });

    $provide.factory("externalLogging", [function () {
      return externalLogging = {
        logEvent: sinon.spy()
      };
    }]);

  }));

  var userAuthFactory, userState, isRiseAuthUser, $loading,
  googleAuthFactory, customAuthFactory, rvTokenStore, $broadcastSpy,
  externalLogging, $window;

  beforeEach(function() {
    inject(function($injector){
      userAuthFactory = $injector.get("userAuthFactory");
      isRiseAuthUser = false;

      var $rootScope = $injector.get("$rootScope");
      $window = $injector.get("$window");

      $window.performance = {
        timing: {
          navigationStart:0
        }
      };
      $broadcastSpy = sinon.spy($rootScope, "$broadcast");
    });
  });

  it("should exist, also methods", function() {
    expect(userAuthFactory.authenticate).to.be.ok;
    expect(userAuthFactory.signOut).to.be.ok;

    ["authenticate", "signOut",
    "addEventListenerVisibilityAPI", "removeEventListenerVisibilityAPI"]
      .forEach(function (method) {
        expect(userAuthFactory).to.have.property(method);
        expect(userAuthFactory[method]).to.be.a("function");
      });
  });

  describe("authenticate: ", function() {
    it("should load gapi, cache authenticate promise", function() {
      var initialPromise = userAuthFactory.authenticate();

      expect(initialPromise.then).to.be.a("function");
      expect(userAuthFactory.authenticate()).to.equal(initialPromise);

      userState._resetState.should.not.have.been.called;
      $loading.startGlobal.should.not.have.been.called;
      googleAuthFactory.authenticate.should.have.been.calledOnce;
    });

    it("should return new promise and start spinner if forceAuth", function() {
      var initialPromise = userAuthFactory.authenticate();

      expect(userAuthFactory.authenticate(true)).to.not.equal(initialPromise);

      $loading.startGlobal.should.have.been.calledOnce;
      $loading.startGlobal.should.have.been.calledWith("risevision.user.authenticate");
      googleAuthFactory.authenticate.should.have.been.calledTwice;
      userState._resetState.should.not.have.been.called;
    });

    describe("googleAuthFactory: ", function() {
      it("should call factory authenticate", function() {
        userAuthFactory.authenticate(true);

        googleAuthFactory.authenticate.should.have.been.called;
        customAuthFactory.authenticate.should.not.have.been.called;
      });

      it("should call factory when no userToken.token is available and no credentials", function() {
        userState._state.userToken = {};

        userAuthFactory.authenticate();

        googleAuthFactory.authenticate.should.have.been.called;
        customAuthFactory.authenticate.should.not.have.been.called;
      });

    });

    describe("customAuthFactory", function() {
      it("should call factory when a userToken.token is available", function() {
        userState._state.userToken = {
          token: "testToken"
        };

        userAuthFactory.authenticate(true);

        customAuthFactory.authenticate.should.have.been.called;
        googleAuthFactory.authenticate.should.not.have.been.called;
      });

    });

    describe("authenticate failure: ", function() {
      beforeEach(function() {
        userState._state.userToken = { test: "testToken" };
        googleAuthFactory.authenticate = function() {
          return Q.reject("Authentication Failure");
        };
      });

      it("should handle authentication failure", function(done) {
        userAuthFactory.authenticate(true).then(done, function(msg) {
          expect(msg).to.equal("Authentication Failure");

          // _clearUserToken
          expect(userState._state.userToken).to.be.undefined;
          rvTokenStore.clear.should.have.been.called;
          userState._resetState.should.have.been.calledOnce;
          googleAuthFactory.signOut.should.have.been.called;

          $broadcastSpy.should.not.have.been.calledWith("risevision.user.authorized");

          done();
        })
        .then(null,done);
      });

      it("should not sign user out if not using rise auth", function(done) {
        isRiseAuthUser = true;

        userAuthFactory.authenticate(true).then(done, function(msg) {
          googleAuthFactory.signOut.should.not.have.been.called;

          done();
        })
        .then(null,done);
      });

      it("should hide spinner and log page load time regardless of failure", function(done) {
        userAuthFactory.authenticate(true);

        setTimeout(function() {
          $loading.stopGlobal.should.have.been.calledWith("risevision.user.authenticate");
          externalLogging.logEvent.should.have.been.calledWith("page load time", "authenticated user", sinon.match.number, "username@test.com", "companyId");

          done();
        }, 10);
      });

    });

    describe("authenticate success: ", function() {
      var authenticatedUser;

      beforeEach(function() {
        authenticatedUser = {
          id: "id",
          email: "username@test.com",
          picture: "picture"
        };

        googleAuthFactory.authenticate = function() {
          return Q.resolve(authenticatedUser);
        };
      });

      it("should reject if no authenticated user is returned", function(done) {
        authenticatedUser = undefined;

        userAuthFactory.authenticate(true).then(done, function(msg) {
          expect(msg).to.equal("No user");

          // _clearUserToken
          expect(userState._state.userToken).to.be.undefined;
          rvTokenStore.clear.should.have.been.called;
          userState._resetState.should.have.been.calledOnce;

          $broadcastSpy.should.not.have.been.calledWith("risevision.user.authorized");

          done();
        })
        .then(null,done);

      });

      it("should not update if users match", function(done) {
        userAuthFactory.authenticate(true).then(function() {
          expect(userState._state.user).to.deep.equal({ username: "username@test.com" });

          userState.refreshProfile.should.not.have.been.called;

          $broadcastSpy.should.not.have.been.calledWith("risevision.user.authorized");
          $broadcastSpy.should.not.have.been.calledWith("risevision.user.userSignedIn");

          done();
        })
        .then(null,done);
      });

      it("should update if users don't match", function(done) {
        authenticatedUser.email = "username2@test.com";

        userAuthFactory.authenticate(true).then(function() {
          expect(userState._state.user).to.deep.equal({
            userId: "id",
            username: "username2@test.com",
            picture: "picture"
          });

          userState.refreshProfile.should.have.been.called;

          $broadcastSpy.should.have.been.calledWith("risevision.user.authorized");
          $broadcastSpy.should.have.been.calledWith("risevision.user.userSignedIn");

          done();
        })
        .then(null,done);
      });

      it("should handle refresh profile errors", function(done) {
        userState.refreshProfile.returns(Q.reject("error"));
        authenticatedUser.email = "username2@test.com";

        userAuthFactory.authenticate(true).then(done)
          .catch(function() {
            userState.refreshProfile.should.have.been.called;

            $broadcastSpy.should.not.have.been.called;
            $broadcastSpy.should.not.have.been.called;

            done();
          })
          .then(null,done);
      });

      it("should update user even if they are not registered", function(done) {
        userState.refreshProfile.returns(Q.reject({code: 403}));
        authenticatedUser.email = "username2@test.com";

        userAuthFactory.authenticate(true).then(function() {
          expect(userState._state.user).to.deep.equal({
            userId: "id",
            username: "username2@test.com",
            picture: "picture"
          });

          userState.refreshProfile.should.have.been.called;

          $broadcastSpy.should.have.been.calledWith("risevision.user.authorized");
          $broadcastSpy.should.have.been.calledWith("risevision.user.userSignedIn");

          done();
        })
        .then(null,done);
      });

    });

  });

  describe("signOut: ", function() {
    it("should return a promise", function() {
      expect(userAuthFactory.signOut().then).to.be.a("function");
    });

    it("should sign out Rise user", function(done) {
      isRiseAuthUser = true;
      userState._state.userToken = {};

      userAuthFactory.signOut().then(function() {
        googleAuthFactory.signOut.should.not.have.been.called;

        // _clearUserToken
        expect(userState._state.userToken).to.be.undefined;
        rvTokenStore.clear.should.have.been.called;

        userState._resetState.should.have.been.called;

        $broadcastSpy.should.have.been.calledWith("risevision.user.signedOut");

        done();
      })
      .then(null,done);
    });

    it("should sign out Google user", function(done) {
      userState._state.userToken = {};

      userAuthFactory.signOut().then(function() {
        googleAuthFactory.signOut.should.have.been.called;

        // _clearUserToken
        expect(userState._state.userToken).to.be.undefined;
        rvTokenStore.clear.should.have.been.called;

        userState._resetState.should.have.been.called;

        $broadcastSpy.should.have.been.calledWith("risevision.user.signedOut");

        done();
      })
      .then(null,done);
    });

    it("should log user out of their Google account", function(done) {
      $window.logoutFrame = {};
      userAuthFactory.signOut(true).then(function() {
        googleAuthFactory.signOut.should.have.been.calledWith(true);

        done();
      })
      .then(null,done);
    });

    it("should reset authenticate promise", function(done) {
      var initialPromise = userAuthFactory.authenticate();

      setTimeout(function() {
        userAuthFactory.signOut().then(function() {
          expect(userAuthFactory.authenticate()).to.not.equal(initialPromise);

          done();
        });
      }, 10);
    });
  });

});
