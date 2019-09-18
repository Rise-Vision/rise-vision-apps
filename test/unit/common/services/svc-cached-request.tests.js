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

});
