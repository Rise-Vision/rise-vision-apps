"use strict";

function getService(serviceName) {
  var injectedService;
  inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}

function mockQ() {
  return function($provide) {
    $provide.service("$q", function() {
      return Q;
    });
  };
}

function mockURL() {
	return function($provide) {
		$provide.service("COOKIE_CHECK_URL", function() {
			return "";
		});
	};
}

function mockHttp(resp) {
  return function($provide) {
    $provide.service("$http", function() {
      if (resp === "failed") {
        return {get: function() {return Q.reject();}};
      }
      return {get: function() {return Q.when({data: {check: resp}});}};
    });
  };
}

function mockStaticFilesLoader() {
  return function($provide) {
    $provide.service("$translateStaticFilesLoader", function() {
      return function() {
        return {
          then: function() {}
        };
      };
    });
  };
}

describe("Services: Cookies", function() {
  beforeEach(module("risevision.common.cookie"));
  beforeEach(module(mockQ()));
  beforeEach(module(mockURL()));
  beforeEach(module(mockStaticFilesLoader()));
  
  describe("With failed $http", function() {
    beforeEach(module(mockHttp("failed")));

    it("should not reject", function(done) {
      var cookieService = getService("cookieTester");
      cookieService.checkThirdPartyCookiePermission().then(function(resp) {
        expect(resp).to.equal(false);
        done();
      }, function() {
        done(new Error("Promise should be resolved"));
      });
    });
  });

  describe("With failed third party cookie", function() {
    beforeEach(module(mockHttp("false")));

    it("should fail on bad third party cookie", function(done) {
      var cookieService = getService("cookieTester");

      cookieService.checkThirdPartyCookiePermission().then(function() {
        done(new Error("Promise should not be resolved"));
      }, function(resp) {
        expect(resp).to.equal(false);
        done();
      }); 
    });

    it("should fail on bad third party cookie", function(done) {
      var cookieService = getService("cookieTester");

      cookieService.checkCookies().then(function() {
        done(new Error("Promise should not be resolved"));
      }, function() {
        done();
      }); 
    });
  });

  describe("With successful third party cookie", function() {
    beforeEach(module(mockHttp("true")));

    it("should pass", function(done) {
      var cookieService = getService("cookieTester");

      cookieService.checkCookies().then(function() {
        done();
      },function() {
        done(new Error("Promise should not be rejected"));
      });
    });
  });
});
