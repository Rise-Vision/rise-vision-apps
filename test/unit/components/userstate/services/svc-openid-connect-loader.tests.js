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

});
