/*jshint expr:true */

"use strict";

describe("Services: openidConnect", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.service("openidConnectLoader", function() {
      return openidConnectLoader = function() {
        return Q.resolve(openidClient);
      };
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

  beforeEach(function() {
    openidClient = {
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

  describe("events: ", function() {
    it("should exist", function() {
      expect(openidConnect).to.be.ok;

      expect(openidConnect.getUser).to.be.ok;
      expect(openidConnect.getUser).to.be.a("function");
    });
  });

});
