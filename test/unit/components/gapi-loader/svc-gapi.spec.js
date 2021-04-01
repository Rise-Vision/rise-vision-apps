/* jshint expr:true */
"use strict";

describe("Services: gapi", function() {
  beforeEach(module("risevision.common.gapi"));

  describe("gapi loader (old)", function() {
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
      $provide.value("$exceptionHandler", sinon.stub());
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

        $window.gapi = {
          client: {
            load: sinon.spy(function(path, version, cb, url) {
              if (loadApi) {
                $window.gapi.client[path] = {version: version};
                return Q.resolve();
              } else {
                return Q.reject({});
              }
            })
          }
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
  });

  // NEW
  describe("rejectOnTimeout:", function() {
    var $timeout, $log, rejectOnTimeout;
    
    beforeEach(function () {
      inject(function($injector) {
        $timeout = $injector.get("$timeout");
        $log = $injector.get("$log");
        rejectOnTimeout = $injector.get("rejectOnTimeout");

        sinon.stub($log, 'error');
      });
    });

    it("should reject if the timeout expires", function(done) {
      var deferred = Q.defer();

      deferred.promise
        .then(done)
        .catch(function(error) {
          expect(error).to.deep.equal({
            code: -1,
            message: 'api Load Timeout'
          });

          $log.error.should.have.been.called;

          done();
        });

      rejectOnTimeout(deferred, 'api');

      $timeout.flush();
    });

    it("should not reject if the promise is resolved", function(done) {
      var deferred = Q.defer();

      deferred.promise
        .catch(done)
        .finally(function() {
          $timeout.verifyNoPendingTasks();

          $log.error.should.not.have.been.called;

          done();            
        });

      rejectOnTimeout(deferred, 'api');

      deferred.resolve();
    });

  });  

  describe("gapiLoader:", function() {
    beforeEach(module(function ($provide) {
      $provide.service("$q", function() {return Q;});

      $provide.value("$exceptionHandler", sinon.stub());
      $provide.value("rejectOnTimeout", sinon.stub());
    }));
    
    var $window, $exceptionHandler, rejectOnTimeout, gapiLoader, element;
    
    beforeEach(function () {
      inject(function($injector) {
        $window = $injector.get("$window");
        $exceptionHandler = $injector.get("$exceptionHandler");
        rejectOnTimeout = $injector.get("rejectOnTimeout");
        gapiLoader = $injector.get("gapiLoader");

        element = $window.document.createElement('script');

        sinon.stub(element, "setAttribute");
        sinon.stub($window.document, "createElement").returns(element);

        delete $window.gapiLoadingStatus;
      });
    });

    afterEach(function() {
      $window.document.createElement.restore();
    });

    it("should initialize handler", function() {
      expect($window.handleClientJSLoad).to.be.a("function");
    });

    it("should dispatch event", function(done) {
      $window.addEventListener('gapi.loaded', function() {
        done();
      });

      $window.handleClientJSLoad();

      expect($window.gapiLoadingStatus).to.equal("loaded");
    });

    it("should set loading status", function() {
      gapiLoader();

      expect($window.gapiLoadingStatus).to.equal("loading");

      rejectOnTimeout.should.have.been.calledWith(sinon.match.object, "gapi");
    });

    it("should return window.gapi object if already exists", function(done) {
      $window.gapiLoadingStatus = "loaded";
      $window.gapi = {};

      gapiLoader().then(function (gApi) {
        expect(gApi).to.equal($window.gapi);

        element.setAttribute.should.not.have.been.called;

        rejectOnTimeout.should.not.have.been.called;

        done();
      });
    });

    it("should initialize and add script element", function() {
      gapiLoader();

      element.setAttribute.should.have.been.calledTwice;
      element.setAttribute.should.have.been.calledWith('type', 'text/javascript');
      element.setAttribute.should.have.been.calledWith('src', '//apis.google.com/js/client.js?onload=handleClientJSLoad');

      expect(element.onerror).to.be.a("function");
    });

    it("should only create script once", function() {
      gapiLoader();
      gapiLoader();

      element.setAttribute.should.have.been.calledTwice;
    });

    it("should load gapi", function(done) {
      $window.gapi = {};

      $window.handleClientJSLoad();

      gapiLoader().then(function (gApi) {
        expect(gApi).to.equal($window.gapi);

        $exceptionHandler.should.not.have.been.called;

        done();
      });
    });

    it("should handle element load failure", function(done) {
      gapiLoader()
        .then(done)
        .catch(function (error) {
          expect(error).to.equal("loadError");

          $exceptionHandler.should.have.been.calledWith('loadError', 'gapiLoader Error.', true);

          done();
        });

      element.onerror("loadError");
    });

  });

  describe("gapiClientLoaderGenerator:", function() {
    beforeEach(module(function ($provide) {
      gApi = {
        client: {
          load: sinon.stub().callsFake(function() {
            gApi.client.custom = "API";
            return Q.resolve();
          })
        }
      };

      $provide.service("$q", function() {return Q;});

      $provide.value("$exceptionHandler", sinon.stub());

      $provide.service("gapiLoader", function() {
        return sinon.stub().returns(Q.resolve(gApi));
      });

      $provide.value("rejectOnTimeout", sinon.stub());
    }));

    var $exceptionHandler, gapiClientLoaderGenerator, gapiLoader, rejectOnTimeout, gApi;

    beforeEach(function() {
      inject(function($injector) {
        $exceptionHandler = $injector.get("$exceptionHandler");
        gapiClientLoaderGenerator = $injector.get("gapiClientLoaderGenerator");
        gapiLoader = $injector.get("gapiLoader");
        rejectOnTimeout = $injector.get("rejectOnTimeout");
      });
    });

    it("should exist", function() {
      expect(gapiClientLoaderGenerator).to.be.ok;      
      expect(gapiClientLoaderGenerator).to.be.a('function');
    });

    it("should load a gapi client lib", function (done) {
      var loaderFn = gapiClientLoaderGenerator("custom", "v0", "someUrls");

      loaderFn().then(function (clientAPI) {
        gApi.client.load.should.have.been.called;
        gApi.client.load.should.have.been.calledWith("custom", "v0", null, "someUrls");

        rejectOnTimeout.should.have.been.calledWith(sinon.match.object, "custom.v0");

        $exceptionHandler.should.not.have.been.called;

        expect(clientAPI).to.equal("API");

        done();
      }, done);
    });

    it("should return lib if existing", function (done) {
      gApi.client.custom = "existingAPI";
      var loaderFn = gapiClientLoaderGenerator("custom", "v0", "someUrls");

      loaderFn().then(function (clientAPI) {
        gApi.client.load.should.not.have.been.called;

        rejectOnTimeout.should.not.have.been.called;

        $exceptionHandler.should.not.have.been.called;

        expect(clientAPI).to.equal("existingAPI");

        done();
      }, done);
    });

    it("should handle failure to load a gapi client lib", function (done) {
      gApi.client.load.returns(Q.resolve());

      var loaderFn = gapiClientLoaderGenerator("custom", "v0", "someUrls");
      loaderFn().then(done)
      .catch(function(err) {
        gApi.client.load.should.have.been.called;

        expect(gApi.client.custom).to.not.be.ok;

        expect(err).to.be.ok;
        expect(err).to.equal('custom.v0 Load Failed');

        $exceptionHandler.should.have.been.calledWith(undefined, 'custom.v0 Load Failed', true);

        done();
      });
    });

    it("should handle gapi client load failure", function (done) {
      gApi.client.load.returns(Q.reject("error"));

      var loaderFn = gapiClientLoaderGenerator("custom", "v0", "someUrls");
      loaderFn().then(done)
      .catch(function(err) {
        gApi.client.load.should.have.been.called;

        expect(gApi.client.custom).to.not.be.ok;

        expect(err).to.be.ok;
        expect(err).to.equal('error');

        $exceptionHandler.should.have.been.calledWith('error', 'custom.v0 Load Failed', true);

        done();
      });
    });

    it("should handle timeout failure", function (done) {
      gApi.client.load.returns(Q.defer().promise);

      var loaderFn = gapiClientLoaderGenerator("custom", "v0", "someUrls");
      loaderFn().then(done)
      .catch(function(err) {
        gApi.client.load.should.have.been.called;

        expect(err).to.be.ok;
        expect(err).to.equal('timeout');

        $exceptionHandler.should.have.been.calledWith('timeout', 'custom.v0 Load Failed', true);

        done();
      });

      setTimeout(function() {
        rejectOnTimeout.getCall(0).args[0].reject('timeout')
      });
    });

    it("should handle gapiLoader failures", function (done) {
      gapiLoader.returns(Q.reject("failure"));

      var loaderFn = gapiClientLoaderGenerator("custom", "v0", "someUrls");
      loaderFn().then(done)
      .catch(function(err) {
        gApi.client.load.should.not.have.been.called;

        expect(gApi.client.custom).to.not.be.ok;

        expect(err).to.be.ok;
        expect(err).to.equal('failure');

        $exceptionHandler.should.not.have.been.called;

        done();
      });
    });

  });

  describe("DedupingGenerator:", function () {
    beforeEach(module(function ($provide) {
      $provide.value("CORE_URL", "coreUrl");
      $provide.value("STORE_ENDPOINT_URL", "storeUrl");

      $provide.service("gapiClientLoaderGenerator", function() {
        return sinon.stub().returns(generatorFn = sinon.stub().returns(Q.resolve()));
      });
    }));

    var DedupingGenerator, gapiClientLoaderGenerator, generatorFn;

    beforeEach(function() {
      inject(function($injector) {
        DedupingGenerator = $injector.get("DedupingGenerator");
        gapiClientLoaderGenerator = $injector.get("gapiClientLoaderGenerator");
      });
    });

    it("should exist", function() {
      expect(DedupingGenerator).to.be.ok;      
      expect(DedupingGenerator).to.be.a('function');
      expect(new DedupingGenerator()).to.be.a('function');
    });

    it("should load the gapi version", function (done) {
      var loaderFn = new DedupingGenerator("custom", "v0", "someUrls");

      loaderFn().then(function () {
        gapiClientLoaderGenerator.should.have.been.called;
        gapiClientLoaderGenerator.should.have.been.calledWith("custom", "v0", "someUrls");

        generatorFn.should.have.been.called;

        done();
      }, done);
    });

    it("should call load once", function (done) {
      var loaderFn = new DedupingGenerator("custom", "v0", "someUrls");

      loaderFn();
      loaderFn();
      
      setTimeout(function() {
        gapiClientLoaderGenerator.should.have.been.calledOnce;
        generatorFn.should.have.been.calledOnce;

        done();
      }, 10);
    });

    it("should clear response and call load again", function (done) {
      var loaderFn = new DedupingGenerator("custom", "v0", "someUrls");

      loaderFn().then(function () {
        gapiClientLoaderGenerator.should.have.been.calledOnce;
        generatorFn.should.have.been.calledOnce;

        loaderFn().then(function () {
          gapiClientLoaderGenerator.should.have.been.calledTwice;
          generatorFn.should.have.been.calledTwice;

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
          gapiClientLoaderGenerator.should.have.been.calledTwice;
          generatorFn.should.have.been.calledTwice;

          gapiClientLoaderGenerator.should.have.been.calledWith("core", "v1", "coreUrl");
          gapiClientLoaderGenerator.should.have.been.calledWith("store", "v0.01", "storeUrl");

          done();
        }, 10);
      });
    });
  });

  describe("client API loaders:", function() {
    beforeEach(module(function ($provide) {
      //stub services
      $provide.value("CORE_URL", "coreUrl");
      $provide.value("STORE_ENDPOINT_URL", "storeUrl");
      $provide.value("STORAGE_ENDPOINT_URL", "storageUrl");
      
      $provide.value("$location", {
        search: sinon.stub().returns({})
      });
      $provide.service("DedupingGenerator", function() {
        return sinon.stub().returns({
          api: "API"
        });
      });

    }));
    
    var $location, DedupingGenerator;
    
    beforeEach(function () {
      inject(function($injector) {
        $location = $injector.get("$location");
        DedupingGenerator = $injector.get("DedupingGenerator");
      });
    });

    describe("coreAPILoader", function () {
      it("should load", function() {
        inject(function (coreAPILoader) {
          expect(coreAPILoader).to.be.ok;
          expect(coreAPILoader.api).to.equal("API");

          DedupingGenerator.should.have.been.calledWith("core", "v1", "coreUrl");
        });
      });

      it("should use custom url", function() {
        $location.search.returns({
          core_api_base_url: 'customUrl'
        });

        inject(function (coreAPILoader) {
          DedupingGenerator.should.have.been.calledWith("core", "v1", "customUrl/_ah/api");
        });
      });
    });

    describe("riseAPILoader", function () {
      it("should load", function() {
        inject(function (riseAPILoader) {
          expect(riseAPILoader).to.be.ok;
          expect(riseAPILoader.api).to.equal("API");

          DedupingGenerator.should.have.been.calledWith("rise", "v0", "coreUrl");
        });
      });

      it("should use custom url", function() {
        $location.search.returns({
          core_api_base_url: 'customUrl'
        });

        inject(function (riseAPILoader) {
          DedupingGenerator.should.have.been.calledWith("rise", "v0", "customUrl/_ah/api");
        });
      });
    });

    describe("storeAPILoader", function () {
      it("should load", function() {
        inject(function (storeAPILoader) {
          expect(storeAPILoader).to.be.ok;
          expect(storeAPILoader.api).to.equal("API");

          DedupingGenerator.should.have.been.calledWith("store", "v0.01", "storeUrl");
        });
      });

      it("should use custom url", function() {
        $location.search.returns({
          store_api_base_url: 'customUrl'
        });

        inject(function (storeAPILoader) {
          DedupingGenerator.should.have.been.calledWith("store", "v0.01", "customUrl/_ah/api");
        });
      });
    });
    
    describe("storageAPILoader", function () {
      it("should load", function() {
        inject(function (storageAPILoader) {
          expect(storageAPILoader).to.be.ok;
          expect(storageAPILoader.api).to.equal("API");

          DedupingGenerator.should.have.been.calledWith("storage", "v0.02", "storageUrl");
        });
      });

      it("should use custom url", function() {
        $location.search.returns({
          storage_api_base_url: 'customUrl'
        });

        inject(function (storageAPILoader) {
          DedupingGenerator.should.have.been.calledWith("storage", "v0.02", "customUrl/_ah/api");
        });
      });
    });

  });

});
