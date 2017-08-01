'use strict';
describe('service: subscription statuses:', function() {
  var PRODUCT_CODE = "abc1";
  var STORE_SERVER_URL = 'http://example.com';
  var STORE_STATUSES_PATH = STORE_SERVER_URL + 'v1/product/' + PRODUCT_CODE + '/status?displayIds=';
  beforeEach(module('risevision.apps.services'));

  beforeEach(module(function ($provide) {
    $provide.value('STORE_SERVER_URL', STORE_SERVER_URL);
    $provide.service('$q', function() {return Q;});
  }));
  
  var getProductSubscriptionStatus, httpReturn, $httpBackend;
  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      getProductSubscriptionStatus = $injector.get('getProductSubscriptionStatus');
    });
  });

  it('should exist',function(){
    expect(getProductSubscriptionStatus).to.be.ok;
    expect(getProductSubscriptionStatus).to.be.a('function');
  });

  it('should return statuses map',function(done) {
    $httpBackend.expect('GET', STORE_STATUSES_PATH + 'A1,B2').respond(200, [{ displayId: 'A1', status: 'Subscribed' }, { displayId: 'B2', status: 'On Trial' }]);
    getProductSubscriptionStatus(PRODUCT_CODE, ['A1', 'B2'])
    .then(function(statusesMap) {
      expect(statusesMap.A1.status).to.equal('Subscribed');
      expect(statusesMap.B2.status).to.equal('On Trial');
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);    
  });

  it('should reject on http error',function(done){
    $httpBackend.expect('GET', STORE_STATUSES_PATH + 'A1,B2').respond(500, { error: 'Error' });
    getProductSubscriptionStatus(PRODUCT_CODE, ['A1', 'B2'])
    .then(null,function(error) {
      expect(error).be.ok;
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);   
  });
});
