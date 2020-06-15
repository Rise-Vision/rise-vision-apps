/* jshint expr:true */
"use strict";

describe("Services: gapi loader", function() {

  beforeEach(module("risevision.common.gapi"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.value("CORE_URL", "");
    $provide.value("MONITORING_SERVICE_URL", "");
    $provide.value("STORAGE_ENDPOINT_URL", "");
    
    $provide.value("$location", {
      search: function () {
        return {};
      },
      protocol: function () {
        return "protocol";
      }
    });
    $provide.service("getBaseDomain", function() {
      return function() {
        return "domain";
      };
    });

  }));
  
  var $window, gapiAuth2, auth2APILoader, loadApi;
  
  beforeEach(function () {
    loadApi = true;

    inject(function($injector) {
      $window = $injector.get("$window");

      var gapiClient = {
        load: sinon.spy(function(path, version, cb, url) {
          if (loadApi) {
            $window.gapi.client[path] = {version: version};
            return Q.resolve();
          } else {
            return Q.reject({});
          }
        })
      };

      gapiAuth2 = {
        init: sinon.stub().returns(Q.resolve()),
        getAuthInstance: sinon.stub()
      };

      $window.gapi = {};
      
      $window.gapi.load = function(path, cb) {
        if (path === "client") {
          $window.gapi[path] = gapiClient;
        } else if (path === "auth2") {
          $window.gapi[path] = gapiAuth2;
        } else {
          $window.gapi[path] = {};
        }
        cb();
      };
      
      $window.handleClientJSLoad();
      
      auth2APILoader = $injector.get("auth2APILoader");
    });
  });

  describe("gapiLoader", function () {
    it("should load gapi", function(done) {
      inject(function (gapiLoader) {
        expect(gapiLoader).to.be.ok;
        gapiLoader().then(function () {
          done();
        });
      });
    });
  });

  describe("auth2APILoader", function () {
    it("should load and initialize auth2", function(done) {
      expect(auth2APILoader).to.be.ok;
      auth2APILoader().then(function (auth2) {
        expect(auth2).to.be.an("object");
        expect($window.gapi.auth2).to.be.ok;
        
        expect(gapiAuth2.init.args[0][0]).to.deep.equal({
          "client_id": "614513768474.apps.googleusercontent.com",
          "scope": "profile",
          "cookie_policy": "protocol://domain:9876"
        });

        done();
      }, done);
    });

    it("should return auth2 instance", function(done) {
      auth2APILoader().then(function () {
        gapiAuth2.getAuthInstance.should.not.have.been.called;

        auth2APILoader().then(function (auth2) {
          expect(auth2).to.be.an("object");
          gapiAuth2.getAuthInstance.should.have.been.called;

          done();
        }, done);
      }, done);
    });
  });
  
  describe("clientAPILoader", function () {
    it("should load", function(done) {
      inject(function (clientAPILoader, $window) {
        expect(clientAPILoader).to.be.ok;
        clientAPILoader().then(function () {
          expect($window.gapi.client).to.be.ok;
          done();
        }, done);
      });
    });
  });

  describe("gapiClientLoaderGenerator", function () {
    var gapiClientLoaderGenerator;
    beforeEach(function() {
      inject(function($injector) {
        gapiClientLoaderGenerator = $injector.get("gapiClientLoaderGenerator");
      });
    });

    it("should exist", function() {
      expect(gapiClientLoaderGenerator).to.be.ok;      
      expect(gapiClientLoaderGenerator).to.be.a('function');
    });

    it("should load a gapi client lib", function (done) {
      var loaderFn = gapiClientLoaderGenerator("custom", "v0", "someUrls");
      loaderFn().then(function () {
        expect($window.gapi).to.be.ok;
        expect($window.gapi.client.custom).to.be.ok;
        done();
      }, done);
    });

    it("should handle failure to load a gapi client lib", function (done) {
      loadApi = false;
      var loaderFn = gapiClientLoaderGenerator("custom", "v0", "someUrls");
      loaderFn().then(done)
      .catch(function() {
        expect($window.gapi).to.be.ok;
        expect($window.gapi.client.custom).to.not.be.ok;
        done();
      });
    });
  });

  describe("coreAPILoader", function () {
    it("should load", function(done) {
      inject(function (coreAPILoader, $window) {
        expect(coreAPILoader).to.be.ok;
        coreAPILoader().then(function () {
          expect($window.gapi.client.core).to.be.ok;
          done();
        }, done);
      });
    });
  });

  describe("riseAPILoader", function () {
    it("should load", function(done) {
      inject(function (riseAPILoader, $window) {
        expect(done).to.be.ok;
        riseAPILoader().then(function () {
          expect($window.gapi.client.rise).to.be.ok;
          done();
        }, done);
      });
    });
  });
  
  describe("storageAPILoader", function () {
    it("should load", function(done) {
      inject(function (storageAPILoader, $window) {
        expect(done).to.be.ok;
        storageAPILoader().then(function () {
          expect($window.gapi.client.storage).to.be.ok;
          done();
        }, done);
      });
    });
  });

  describe("discoveryAPILoader", function () {
    it("should load", function(done) {
        inject(function (discoveryAPILoader, $window) {
            expect(done).to.be.ok;
            discoveryAPILoader().then(function () {
                expect($window.gapi.client.discovery).to.be.ok;
                done();
            })
            .then(null,done);
        });
    });
  });

  describe("monitoringAPILoader", function () {
      it("should load", function(done) {
          inject(function (monitoringAPILoader, $window) {
              expect(done).to.be.ok;
              monitoringAPILoader().then(function () {
                  expect($window.gapi.client.monitoring).to.be.ok;
                  done();
              }, done);
          });
      });
  });

});
