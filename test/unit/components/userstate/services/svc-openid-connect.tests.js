/*jshint expr:true */

"use strict";

describe("Services: openidConnect", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(function() {
    openidClient = {
      getUser: function() { return Q.resolve({ profile: 'profile' }); },
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
  });

  describe("getUser: ", function() {
    it("should exist, be a function", function() {
      expect(openidConnect.getUser).to.be.ok;
      expect(openidConnect.getUser).to.be.a("function");
    });
  });

});
