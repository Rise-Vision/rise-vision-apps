"use strict";

describe("Services: openidConnect", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(function() {
    openidClient = {
      getUser : function() {
        return Q.resolve({ profile: 'profile' });
      },
      removeUser: sinon.stub(),
      signinRedirect: sinon.stub(),
      signinRedirectCallback: sinon.stub(),
      signinSilent: sinon.stub().resolves({ profile: 'profile' }),
      events: {
        addUserLoaded: sinon.stub(),
        addUserUnloaded: sinon.stub(),
        addAccessTokenExpiring: sinon.stub(),
        addAccessTokenExpired: sinon.stub(),
        addSilentRenewError: sinon.stub(),
        addUserSignedOut: sinon.stub(),
      }
    };
  });

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.service("openidConnectLoader", function() {
      return openidConnectLoader = sinon.stub().resolves(openidClient);
    });

    $provide.service("openidTracker", function() {
      return openidTracker = sinon.stub();
    });
  }));

  var openidClient, openidConnect, openidConnectLoader, openidTracker;

  beforeEach(function() {
    inject(function($injector) {
      openidConnect = $injector.get("openidConnect");
    });
  });

  describe("events: ", function() {
    it("should exist", function() {
      expect(openidConnect).to.be.ok;
    });

    it("should register event handlers", function(done) {
      expect(openidConnectLoader).to.have.been.called;

      setTimeout(function() {
        expect(openidClient.events.addUserLoaded).to.have.been.called;
        expect(openidClient.events.addUserUnloaded).to.have.been.called;
        expect(openidClient.events.addAccessTokenExpiring).to.have.been.called;
        expect(openidClient.events.addAccessTokenExpired).to.have.been.called;
        expect(openidClient.events.addSilentRenewError).to.have.been.called;
        expect(openidClient.events.addUserSignedOut).to.have.been.called;

        done();
      }, 10);
    });

    it("should call tracker for user loaded event", function(done) {
      setTimeout(function() {
        var userLoadedHandler =
          openidClient.events.addUserLoaded.getCall(0).args[0]

        expect(userLoadedHandler).to.be.ok;
        expect(userLoadedHandler).to.be.a("function");

        userLoadedHandler({ profile: 'profile' });

        expect(openidTracker).to.have.been.calledWith('user loaded', 'profile');

        done();
      }, 10);
    });

    it("should call tracker for user unloaded event", function(done) {
      setTimeout(function() {
        var userUnloadedHandler =
          openidClient.events.addUserUnloaded.getCall(0).args[0]

        expect(userUnloadedHandler).to.be.ok;
        expect(userUnloadedHandler).to.be.a("function");

        userUnloadedHandler();

        setTimeout(function() {
          expect(openidTracker).to.have.been.calledWith('user unloaded', 'profile');

          done();
        }, 10);
      }, 10);
    });

    it("should send empty profile if there's no user", function(done) {
      openidClient.getUser = function() {
        return Q.resolve(null);
      };

      setTimeout(function() {
        var userUnloadedHandler =
          openidClient.events.addUserUnloaded.getCall(0).args[0]

        expect(userUnloadedHandler).to.be.ok;
        expect(userUnloadedHandler).to.be.a("function");

        userUnloadedHandler();

        setTimeout(function() {
          expect(openidTracker).to.have.been.calledWith('user unloaded', {});

          done();
        }, 10);
      }, 10);
    });

    it("should call tracker for token expiring event", function(done) {
      setTimeout(function() {
        var tokenExpiringHandler =
          openidClient.events.addAccessTokenExpiring.getCall(0).args[0]

        expect(tokenExpiringHandler).to.be.ok;
        expect(tokenExpiringHandler).to.be.a("function");

        tokenExpiringHandler();

        setTimeout(function() {
          expect(openidTracker).to.have.been.calledWith('access token expiring', 'profile');

          done();
        }, 10);
      }, 10);
    });

    it("should call tracker for token expired event", function(done) {
      setTimeout(function() {
        var tokenExpiredHandler =
          openidClient.events.addAccessTokenExpired.getCall(0).args[0]

        expect(tokenExpiredHandler).to.be.ok;
        expect(tokenExpiredHandler).to.be.a("function");

        tokenExpiredHandler();

        setTimeout(function() {
          expect(openidTracker).to.have.been.calledWith('access token expired', 'profile');

          done();
        }, 10);
      }, 10);
    });

    it("should call tracker for silent renew error", function(done) {
      setTimeout(function() {
        var silentRenewErrorHandler =
          openidClient.events.addSilentRenewError.getCall(0).args[0]

        expect(silentRenewErrorHandler).to.be.ok;
        expect(silentRenewErrorHandler).to.be.a("function");

        silentRenewErrorHandler({ message: 'network error' });

        setTimeout(function() {
          expect(openidTracker).to.have.been.calledWith('silent renew error', 'profile', {
            errorMessage: 'network error'
          });

          done();
        }, 10);
      }, 10);
    });

    it("should call tracker for user signed out event", function(done) {
      setTimeout(function() {
        var userSignedOutHandler =
          openidClient.events.addUserSignedOut.getCall(0).args[0]

        expect(userSignedOutHandler).to.be.ok;
        expect(userSignedOutHandler).to.be.a("function");

        userSignedOutHandler();

        setTimeout(function() {
          expect(openidTracker).to.have.been.calledWith('user signed out', 'profile');

          done();
        }, 10);
      }, 10);
    });
  });

  describe("getUser: ", function() {
    it("should exist, be a function", function() {
      expect(openidConnect.getUser).to.be.ok;
      expect(openidConnect.getUser).to.be.a("function");
    });

    it("return the user", function(done) {
      openidConnect.getUser().then((user) => {
        expect(user).to.deep.equal({ profile: 'profile' });

        done();
      });
    });
  });

  describe("signinRedirect: ", function() {
    it("should exist, be a function", function() {
      expect(openidConnect.signinRedirect).to.be.ok;
      expect(openidConnect.signinRedirect).to.be.a("function");
    });

    it("should call signin redirect", function(done) {
      var state = 'some state';

      openidConnect.signinRedirect(state).then(() => {
        expect(openidClient.signinRedirect).to.have.been.calledWith({
          state: 'some state'
        });

        done();
      });
    });
  });

  describe("signinRedirectCallback: ", function() {
    it("should exist, be a function", function() {
      expect(openidConnect.signinRedirectCallback).to.be.ok;
      expect(openidConnect.signinRedirectCallback).to.be.a("function");
    });

    it("should call signin redirect callback", function(done) {
      openidConnect.signinRedirectCallback().then(() => {
        expect(openidClient.signinRedirectCallback).to.have.been.called;

        done();
      });
    });
  });

  describe("signinPopup: ", function() {
    it("should exist, be a function", function() {
      expect(openidConnect.signinPopup).to.be.ok;
      expect(openidConnect.signinPopup).to.be.a("function");
    });

    it("should reject", function(done) {
      openidConnect.signinPopup().catch(e => {
        expect(e).to.equal('Not implemented');

        done();
      });
    });
  });

  describe("signinSilent: ", function() {
    it("should exist, be a function", function() {
      expect(openidConnect.signinSilent).to.be.ok;
      expect(openidConnect.signinSilent).to.be.a("function");
    });

    it("should reject if no username is provided", function(done) {
      openidConnect.signinSilent().catch(e => {
        expect(e).to.equal('Missing user id');

        done();
      });
    });

    it("should sign in silent", function(done) {
      openidConnect.signinSilent('a username').then(user => {
        expect(openidClient.signinSilent).to.have.been.calledWith({
          login_hint: 'a username'
        });

        expect(user).to.deep.equal({ profile: 'profile' });

        done();
      });
    });
  });

  describe("removeUser: ", function() {
    it("should exist, be a function", function() {
      expect(openidConnect.removeUser).to.be.ok;
      expect(openidConnect.removeUser).to.be.a("function");
    });

    it("should remove user", function(done) {
      openidConnect.removeUser().then(user => {
        expect(openidClient.removeUser).to.have.been.called;

        done();
      });
    });
  });

});
