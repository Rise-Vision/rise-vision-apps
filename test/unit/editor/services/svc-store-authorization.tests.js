'use strict';
describe('service: storeAuthorization:', function() {
  var STORE_SERVER_URL = 'http://example.com';
  var STORE_AUTHORIZATION_URL = STORE_SERVER_URL + '/v1/widget/auth';
  var TEMPLATE_LIBRARY_PRODUCT_CODE = 'templates-library';
  var TEMPLATE_TEST_CODE = 'template-test';
  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.value('STORE_SERVER_URL', STORE_SERVER_URL);
    $provide.value('TEMPLATE_LIBRARY_PRODUCT_CODE', TEMPLATE_LIBRARY_PRODUCT_CODE);
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
  
  var storeAuthorization, httpReturn, $httpBackend, checkTemplateAccess;
  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      storeAuthorization = $injector.get('storeAuthorization');
      checkTemplateAccess = $injector.get('checkTemplateAccess');
    });
  });

  it('should exist',function(){
    expect(storeAuthorization).to.be.ok;
    expect(storeAuthorization.check).to.be.a('function');
    expect(checkTemplateAccess).to.be.a('function');
  });
  
  it('should validate product code',function(done){
    $httpBackend.expect('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=pc&startTrial=false').respond(200, {authorized: true});
    storeAuthorization.check('pc').then(function(authorized){
      expect(authorized).to.be.true;
      done();
    });
    setTimeout(function(){
      $httpBackend.flush();
    },10);    
  });

  it('should reject not authorized product',function(done){
    $httpBackend.expect('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=pc&startTrial=false').respond(200, {authorized: false});
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

  describe('checkTemplateAccess:', function() {
    it('should give access to premium templates if subscribed to Templates Library', function(done) {
      $httpBackend.expect('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=' + TEMPLATE_LIBRARY_PRODUCT_CODE + '&startTrial=false').respond(200, {authorized: true});

      checkTemplateAccess(TEMPLATE_TEST_CODE)
      .then(function() {
        done();
      });

      setTimeout(function(){
        $httpBackend.flush();
      }, 0);
    });

    it('should give access to premium templates if subscribed to the template', function(done) {
      $httpBackend.when('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=' + TEMPLATE_LIBRARY_PRODUCT_CODE + '&startTrial=false').respond(200, {authorized: false});

      checkTemplateAccess(TEMPLATE_TEST_CODE)
      .then(function() {
        done();
      });

      setTimeout(function(){
        $httpBackend.flush();
        $httpBackend.when('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=' + TEMPLATE_TEST_CODE + '&startTrial=false').respond(200, {authorized: true});

        setTimeout(function(){
          $httpBackend.flush();
        }, 0);
      }, 0);
    });

    it('should reject access to premium templates if not subscribed to Templates Library or to the template', function(done) {
      $httpBackend.when('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=' + TEMPLATE_LIBRARY_PRODUCT_CODE + '&startTrial=false').respond(200, {authorized: false});

      checkTemplateAccess(TEMPLATE_TEST_CODE)
      .then(null, function() {
        done();
      });

      setTimeout(function(){
        $httpBackend.flush();
        $httpBackend.when('GET', STORE_AUTHORIZATION_URL+'?cid=cid&pc=' + TEMPLATE_TEST_CODE + '&startTrial=false').respond(200, {authorized: false});

        setTimeout(function(){
          $httpBackend.flush();
        }, 0);
      }, 0);
    });
  });
});
