/* jshint expr:true */
"use strict";

describe("Services: gapi loader", function() {

  beforeEach(module("risevision.common.gapi"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.value("CORE_URL", "coreUrl");
    $provide.value("STORE_ENDPOINT_URL", "storeUrl");
    $provide.value("STORAGE_ENDPOINT_URL", "storageUrl");
    
    $provide.value("$location", {
      search: sinon.stub().returns({}),
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
  
  var $window, $location, loadApi;
  
  beforeEach(function () {
    loadApi = true;

    inject(function($injector) {
      $window = $injector.get("$window");
      $location = $injector.get("$location");

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

      $window.gapi = {};
      
      $window.gapi.load = function(path, cb) {
        if (path === "client") {
          $window.gapi[path] = gapiClient;
        } else {
          $window.gapi[path] = {};
        }
        cb();
      };
      
      $window.handleClientJSLoad();
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
  
  describe("clientAPILoader", function () {
    it("should load", function(done) {
      inject(function (clientAPILoader) {
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

  describe("DedupingGenerator", function () {
    var DedupingGenerator;

    beforeEach(function() {
      inject(function($injector) {
        DedupingGenerator = $injector.get("DedupingGenerator");
      });
    });

    it("should exist", function() {
      expect(DedupingGenerator).to.be.ok;      
      expect(DedupingGenerator).to.be.a('function');
      expect(new DedupingGenerator()).to.be.a('function');
    });

    it("should return load the gapi version", function (done) {
      var loaderFn = new DedupingGenerator("custom", "v0", "someUrls");

      loaderFn().then(function () {
        $window.gapi.client.load.should.have.been.calledWith("custom", "v0", null, "someUrls");

        done();
      }, done);
    });

    it("should call load once", function (done) {
      var loaderFn = new DedupingGenerator("custom", "v0", "someUrls");

      loaderFn();
      loaderFn();
      
      setTimeout(function() {
        expect($window.gapi).to.be.ok;
        expect($window.gapi.client.custom).to.be.ok;

        $window.gapi.client.load.should.have.been.calledOnce;

        done();
      }, 10);
    });

    it("should clear response and call load again", function (done) {
      var loaderFn = new DedupingGenerator("custom", "v0", "someUrls");

      loaderFn().then(function () {
        $window.gapi.client.load.should.have.been.calledOnce;

        loaderFn().then(function () {
          $window.gapi.client.load.should.have.been.calledTwice;
          done();
        }, done);

        done();
      }, done);
    });

    it("should load separate apis", function(done) {
      inject(function (coreAPILoader, storeAPILoader) {
        coreAPILoader();
        storeAPILoader();
        
        setTimeout(function () {
          expect($window.gapi.client.core).to.be.ok;
          expect($window.gapi.client.store).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("core", "v1", null, "coreUrl");
          $window.gapi.client.load.should.have.been.calledWith("store", "v0.01", null, "storeUrl");

          done();
        }, 10);
      });
    });
  });

  describe("coreAPILoader", function () {
    it("should load", function(done) {
      inject(function (coreAPILoader) {
        expect(coreAPILoader).to.be.ok;
        coreAPILoader().then(function () {
          expect($window.gapi.client.core).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("core", "v1", null, "coreUrl");

          done();
        }, done);
      });
    });

    it("should use custom url", function(done) {
      $location.search.returns({
        core_api_base_url: 'customUrl'
      });

      inject(function (coreAPILoader) {
        coreAPILoader();
        setTimeout(function () {
          expect($window.gapi.client.core).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("core", "v1", null, "customUrl/_ah/api");

          done();
        }, 10);
      });
    });

    it("should use deduping and call load only once", function (done) {
      inject(function (coreAPILoader) {
        coreAPILoader();
        coreAPILoader();
        
        setTimeout(function() {
          $window.gapi.client.load.should.have.been.calledOnce;

          done();
        }, 10);
      });
    });
  });

  describe("riseAPILoader", function () {
    it("should load", function(done) {
      inject(function (riseAPILoader) {
        expect(riseAPILoader).to.be.ok;
        riseAPILoader().then(function () {
          expect($window.gapi.client.rise).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("rise", "v0", null, "coreUrl");

          done();
        }, done);
      });
    });

    it("should use custom url", function(done) {
      $location.search.returns({
        core_api_base_url: 'customUrl'
      });

      inject(function (riseAPILoader) {
        riseAPILoader();
        setTimeout(function () {
          expect($window.gapi.client.rise).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("rise", "v0", null, "customUrl/_ah/api");

          done();
        }, 10);
      });
    });

    it("should use deduping and call load only once", function (done) {
      inject(function (riseAPILoader) {
        riseAPILoader();
        riseAPILoader();
        
        setTimeout(function() {
          $window.gapi.client.load.should.have.been.calledOnce;

          done();
        }, 10);
      });
    });
  });

  describe("storeAPILoader", function () {
    it("should load", function(done) {
      inject(function (storeAPILoader) {
        expect(storeAPILoader).to.be.ok;
        storeAPILoader().then(function () {
          expect($window.gapi.client.store).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("store", "v0.01", null, "storeUrl");

          done();
        }, done);
      });
    });

    it("should use custom url", function(done) {
      $location.search.returns({
        store_api_base_url: 'customUrl'
      });

      inject(function (storeAPILoader) {
        storeAPILoader().then(function () {
          expect($window.gapi.client.store).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("store", "v0.01", null, "customUrl/_ah/api");

          done();
        }, 10);
      });
    });

    it("should use deduping and call load only once", function (done) {
      inject(function (storeAPILoader) {
        storeAPILoader();
        storeAPILoader();
        
        setTimeout(function() {
          $window.gapi.client.load.should.have.been.calledOnce;

          done();
        }, 10);
      });
    });
  });

  describe("storageAPILoader", function () {
    it("should load", function(done) {
      inject(function (storageAPILoader) {
        expect(done).to.be.ok;
        storageAPILoader().then(function () {
          expect($window.gapi.client.storage).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("storage", "v0.02", null, "storageUrl");

          done();
        }, done);
      });
    });

    it("should use custom url", function(done) {
      $location.search.returns({
        storage_api_base_url: 'customUrl'
      });

      inject(function (storageAPILoader) {
        storageAPILoader().then(function () {
          expect($window.gapi.client.storage).to.be.ok;

          $window.gapi.client.load.should.have.been.calledWith("storage", "v0.02", null, "customUrl/_ah/api");

          done();
        }, 10);
      });
    });

    it("should use deduping and call load only once", function (done) {
      inject(function (storageAPILoader) {
        storageAPILoader();
        storageAPILoader();
        
        setTimeout(function() {
          $window.gapi.client.load.should.have.been.calledOnce;

          done();
        }, 10);
      });
    });
  });

});
