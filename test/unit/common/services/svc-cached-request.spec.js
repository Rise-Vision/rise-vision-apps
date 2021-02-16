'use strict';
describe('service: CachedRequest', function() {
  var sandbox = sinon.sandbox.create();
  var cachedRequest, request, args;

  beforeEach(module('risevision.apps.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {
      return Q;
    });
  }));

  beforeEach(function() {
    inject(function($injector) {
      var CachedRequest = $injector.get('CachedRequest');
      request = sandbox.stub().returns(Q.resolve('OK'))
      args = sandbox.stub();
      cachedRequest = new CachedRequest(request,args);
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('execute:', function(){
    it('should call the request with provided args', function(done) {
      cachedRequest.execute().then(function(resp){
        expect(request).to.have.been.calledWith(args);        
        expect(resp).to.equal('OK');
        done();
      });
      expect(cachedRequest.loading).to.be.true;
    });

    it('should the request only once and return cached value', function(done) {
      cachedRequest.execute().then(function(resp){
        expect(resp).to.equal('OK');
        expect(request).to.have.been.calledOnce;

        cachedRequest.execute().then(function(cachedResp){
          expect(cachedResp).to.equal(resp);
          expect(request).to.have.been.calledOnce;
          done();
        });
      });
    });

    it('should make the request again if forceRelod is true', function(done) {
      cachedRequest.execute().then(function(resp){
        expect(resp).to.equal('OK');
        expect(request).to.have.been.calledOnce;

        cachedRequest.execute(true).then(function(cachedResp){
          expect(request).to.have.been.calledTwice;
          done();
        });
      });
    });

    it('should set apiError on request failure',function(done){
      var errorResp = {message:'ERROR'};
      request.returns(Q.reject(errorResp));

      cachedRequest.execute().then(function(){
        done('should have rejected');
      }).catch(function(e){
        expect(e).to.equal(errorResp);
        expect(cachedRequest.apiError).to.equal('ERROR');
        done();
      });
    });

  });

  describe('reset:', function() {
    it('should not request again on reset', function(done) {
      cachedRequest.execute();
      cachedRequest.reset();

      setTimeout(function() {
        expect(request).to.have.been.calledOnce;

        done();
      }, 10);
    });

    it('should make the request again if api is called after reset', function(done) {
      cachedRequest.execute().then(function(resp){
        expect(resp).to.equal('OK');
        expect(request).to.have.been.calledOnce;

        cachedRequest.reset();

        cachedRequest.execute().then(function(cachedResp){
          expect(request).to.have.been.calledTwice;
          done();
        });
      });
    });
  });

  describe('promise caching:', function() {
    it('should only call API once on concurrent requests',function(done){
      var response = Q.defer();
      request.returns(response.promise);
      var promiseResolve = sandbox.stub();

      cachedRequest.execute().then(promiseResolve);
      cachedRequest.execute().then(promiseResolve);

      response.resolve('OK');

      setTimeout(function() {
        expect(request).to.have.been.calledOnce;
        expect(promiseResolve).to.have.been.calledTwice;

        done();
      }, 10);
    });

    it('should resolve correct promise on reset',function(done){
      var response = Q.defer();
      request.returns(response.promise);
      var promiseResolve1 = sandbox.stub();
      var promiseResolve2 = sandbox.stub();

      cachedRequest.execute().then(promiseResolve1);
      cachedRequest.reset();
      cachedRequest.execute().then(promiseResolve2);

      response.resolve('OK');

      setTimeout(function() {
        expect(request).to.have.been.calledTwice;
        expect(promiseResolve1).to.have.been.calledOnce;
        expect(promiseResolve2).to.have.been.calledOnce;

        done();
      }, 10);
    });

  });

});
