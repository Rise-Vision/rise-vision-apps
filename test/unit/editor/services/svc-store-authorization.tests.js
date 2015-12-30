'use strict';
describe('service: storeAuthorization:', function() {
  var STORE_AUTHORIZATION_URL = 'http://example.com/auth';
  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.value('STORE_AUTHORIZATION_URL', STORE_AUTHORIZATION_URL);
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        _restoreState: function(){},
        getSelectedCompanyId: function(){
          return 'cid';
        }
      }
    });
  }));
  
  var storeAuthorization, httpReturn, $httpBackend;
  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      storeAuthorization = $injector.get('storeAuthorization');
    });
  });

  it('should exist',function(){
    expect(storeAuthorization).to.be.ok;
    expect(storeAuthorization.check).to.be.a('function');
  });
  
  it('should validate product code',function(done){
    $httpBackend.expect('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=pc').respond(200, {authorized: true});
    storeAuthorization.check('pc').then(function(authorized){
      expect(authorized).to.be.true;
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);    
  });

  it('should reject not authorized product',function(done){
    $httpBackend.expect('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=pc').respond(200, {authorized: false});
    storeAuthorization.check('pc').then(null,function(authorized){
      expect(authorized).to.be.false;
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);   
  });

  it('should reject on http error',function(done){
    $httpBackend.expect('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=pc').respond(500, {error: 'Error'});
    storeAuthorization.check('pc').then(null,function(error){
      expect(error).be.ok;
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);   
  });
  

});
