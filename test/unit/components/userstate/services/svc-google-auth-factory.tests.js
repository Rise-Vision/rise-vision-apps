/*jshint expr:true */

"use strict";

describe("Services: googleAuthFactory", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.value("$stateParams", {
      state: "someState"
    });
    $provide.service("userState", function() {
      return userState = {
        _state: {
          inRVAFrame: false
        },
        refreshProfile: sinon.spy(function() { return Q.resolve(); }),
        _setUserToken: sinon.spy(),
        _persistState: sinon.spy(),
        _restoreState: sinon.spy()
      };
    });
    $provide.service("uiFlowManager", function() {
      return uiFlowManager = {
        persist: sinon.spy()
      };
    });
    $provide.service("urlStateService", function() {
      return urlStateService = {
        clearStatePath: function() {
          return "clearedPath";
        },
        redirectToState: sinon.spy()
      };
    });

    $provide.service("gapiLoader", function () {
      return gapiLoader = sinon.spy(function() {
        return Q.resolve({
          setToken: function(paramToken) {
            token = paramToken;
          }
        });
      });
    });

    user = {
      expires_in: 100,
      profile: {
        sub: 'userId',
        email: 'userEmail',
        picture: 'imageUrl'
      }
    }

    $provide.service("openidConnect", function () {
      return openidConnect = {
        getUser: sinon.stub().resolves(user),
        signinSilent: sinon.stub().resolves(user),
        signinPopup: sinon.stub(),
        signinRedirect: sinon.stub(),
        removeUser: sinon.stub()
      };
    });

  }));

  var googleAuthFactory, userState, uiFlowManager, $window, $rootScope,
    urlStateService, gapiLoader, openidConnect, user;

  var isSignedIn;

  describe("authenticate: ", function() {
    beforeEach(function() {
      isSignedIn = true;

      inject(function($injector) {
        $rootScope = $injector.get("$rootScope");

        $window = $injector.get("$window");
        googleAuthFactory = $injector.get("googleAuthFactory");
      });
    });

    beforeEach(function() {
      $rootScope.redirectToRoot = true;
    });

    it("should exist, return a promise", function() {
      expect(googleAuthFactory.authenticate).to.be.ok;
      expect(googleAuthFactory.authenticate).to.be.a("function");

      expect(googleAuthFactory.authenticate().then).to.be.a("function");
      expect(googleAuthFactory.authenticate(true).then).to.be.a("function");
    });

    it("should handle authorization failure", function(done) {
      openidConnect.getUser = function() {
        return Q.reject("Failed to authorize user (auth2)");
      };

      googleAuthFactory.authenticate()
      .then(done)
      .then(null, function(error) {
        expect(error).to.equal("Failed to authorize user (auth2)");
        done();
      })
      .then(null,done);
    });

    describe("_getUserProfile: ", function() {
      it("should retrieve user profile correctly", function(done) {
        googleAuthFactory.authenticate().then(function(resp) {
          openidConnect.signinSilent.should.not.have.been.called;
          urlStateService.redirectToState.should.not.have.been.called;

          expect(resp).to.deep.equal({
            id: "userId",
            email: "userEmail",
            picture: "imageUrl"
          });

          done();
        })
        .then(null,done);
      });

      it("should signin silently if expiration is low", function(done) {
        user.expires_in = 10;

        googleAuthFactory.authenticate().then(function(resp) {
          openidConnect.signinSilent.should.have.been.calledWith('userId');
          urlStateService.redirectToState.should.not.have.been.called;

          expect(resp).to.deep.equal({
            id: "userId",
            email: "userEmail",
            picture: "imageUrl"
          });

          done();
        })
        .then(null,done);
      });

      it("should signin silently if there's no user, but there's a user token", function(done) {
        openidConnect.getUser = function() { return Q.resolve(null); };
        userState._state.userToken = { id: 'tokenId' };

        googleAuthFactory.authenticate().then(function(resp) {
          openidConnect.signinSilent.should.have.been.calledWith('tokenId');
          urlStateService.redirectToState.should.not.have.been.called;

          expect(resp).to.deep.equal({
            id: "userId",
            email: "userEmail",
            picture: "imageUrl"
          });

          done();
        })
        .then(null,done);
      });

      it("should reject if there's no user and no user token", function(done) {
        openidConnect.getUser = function() { return Q.resolve(null); };

        googleAuthFactory.authenticate().catch( function(error) {
          expect(error).to.equal("No user");
          done();
        });
      });

      it("should redirect and clear state if present", function(done) {
        userState._state.redirectState = "someState";

        googleAuthFactory.authenticate().then(function() {
          urlStateService.redirectToState.should.have.been.calledWith("someState");

          expect(userState._state.redirectState).to.be.undefined;

          done();
        })
        .then(null,done);
      });
    });
  });

  describe("forceAuthenticate", function() {
    beforeEach(module(function ($provide) {
      $provide.value("$window", {
        location: {
          href: "http://localhost:8000/editor/list?cid=companyId#somehash",
          origin: "http://localhost:8000",
          pathname: "/editor/list",
          search: "?cid=companyId",
          hash: ""
        }
      });
    }));

    beforeEach(function() {
      inject(function($injector){
        $rootScope = $injector.get("$rootScope");

        $window = $injector.get("$window");
        googleAuthFactory = $injector.get("googleAuthFactory");
      });
    });

    beforeEach(function() {
      $rootScope.redirectToRoot = true;
    });

    it("should save current state variables", function() {
      googleAuthFactory.forceAuthenticate();

      expect(userState._state.redirectState).to.equal("someState");

      userState._persistState.should.have.been.called;
      uiFlowManager.persist.should.have.been.called;
      openidConnect.signinRedirect.should.have.been.called;
    });

    it("should clear state path", function() {
      $rootScope.redirectToRoot = false;

      googleAuthFactory.forceAuthenticate();

      expect(userState._state.redirectState).to.equal("clearedPath");

      userState._persistState.should.have.been.called;
      uiFlowManager.persist.should.have.been.called;
      openidConnect.signinRedirect.should.have.been.called;
    });

    xit("should authenticate with popup via select_account", function(done) {
      userState._state.inRVAFrame = true;

      googleAuthFactory.authenticate(true);

      setTimeout(function() {
        expect(authInstance.signIn.args[0][0]).to.deep.equal({
          "response_type":"token",
          "prompt":"select_account",
          "ux_mode":"popup",
          "redirect_uri":"http://localhost:8000/"
        });

        done();
      }, 10);
    });

    xit("should authenticate with popup via select_account if in iframe", function(done) {
      $window.self = 1;
      $window.top = 0;
      googleAuthFactory.authenticate(true);

      setTimeout(function() {
        expect(authInstance.signIn.args[0][0]).to.deep.equal({
          "response_type":"token",
          "prompt":"select_account",
          "ux_mode":"popup",
          "redirect_uri":"http://localhost:8000/"
        });

        done();
      }, 10);
    });

    xit("should authorize user after popup authentication", function(done) {
      userState._state.inRVAFrame = true;

      isSignedIn = true;

      googleAuthFactory.authenticate(true).then(function(resp) {
        authInstance.signIn.should.have.been.called;
        authInstance.isSignedIn.get.should.have.been.called;

        expect(resp).to.deep.equal({
          id: "userId",
          email: "userEmail",
          picture: "imageUrl"
        });

        done();
      })
      .then(null,done);
    });

    xit("should reject if user closes popup authentication", function(done) {
      userState._state.inRVAFrame = true;

      isSignedIn = false;

      googleAuthFactory.authenticate(true)
        .then(done)
        .then(null, function(error) {
          authInstance.signIn.should.have.been.called;
          authInstance.isSignedIn.get.should.not.have.been.called;

          expect(error).to.equal("popup closed");
          done();
        })
        .then(null,done);
    });

  });

});
