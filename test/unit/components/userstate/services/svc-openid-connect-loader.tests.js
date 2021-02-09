"use strict";

describe("Services: openidConnectLoader", function() {
  beforeEach(module("risevision.common.components.userstate"));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.service("localStorageService", function() {
      return { isSupported: function() { return true; } };
    });

    $provide.service("userState", function() {
      return {
        getUsername: function() { return 'a username' },
        _restoreState: function() {}
      };
    });
  }));

  var openidConnectLoader;

  describe("no Oidc library: ", function() {
    beforeEach(function() {
      inject(function($injector) {
        var $window = $injector.get("$window");
        $window.Oidc = null;

        openidConnectLoader = $injector.get("openidConnectLoader");
      });
    });

    it("should reject", function(done) {
      openidConnectLoader().catch( function(error) {
        expect(error).to.equal('Oidc client not found!');

        done();
      });
    });
  });

  describe("Oidc library: ", function() {
    var WebStorageStateStore, UserManager;

    beforeEach(function() {
      WebStorageStateStore = (function() {
        return function() {};
      }());

      UserManager = (function() {
        function UserManager(settings) {
          this.settings = settings;
        }

        UserManager.prototype.signinSilent = function(params) {
          this.params = params;
        }

        return UserManager;
      }());
    });

    beforeEach(function() {
      inject(function($injector) {
        var $window = $injector.get("$window");
        $window.Oidc = {
          Log: {
            WARN: 'WARN'
          },
          UserManager: UserManager,
          WebStorageStateStore: WebStorageStateStore
        };

        openidConnectLoader = $injector.get("openidConnectLoader");
      });
    });

    it("should return client", function(done) {
      openidConnectLoader().then( function(client) {
        expect(client).to.be.ok;
        expect(client.settings).to.be.ok;
        expect(client.settings.authority).to.equal('https://accounts.google.com/');
        expect(client.settings.prompt).to.equal('select_account');

        expect(client.signinSilent).to.be.ok;
        expect(client.signinSilent).to.be.a("function");

        done();
      });
    });

    it("should pass through params to signinSilent", function(done) {
      openidConnectLoader().then( function(client) {
        client.signinSilent({ param: 'param' });

        expect(client.params).to.deep.equal({ param: 'param' });

        done();
      });
    });

    it("should use params with login_hint if no params were provided", function(done) {
      openidConnectLoader().then( function(client) {
        client.signinSilent();

        expect(client.params).to.deep.equal({ login_hint: 'a username' });

        done();
      });
    });
  });

});
