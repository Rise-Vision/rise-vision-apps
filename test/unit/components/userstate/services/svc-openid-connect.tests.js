"use strict";

describe("Services: openidConnect", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(function() {
    openidClient = {
      getUser : function() {
        return Q.resolve({ profile: 'profile' });
      },
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
  });

});
