'use strict';

describe('Response Header Analyzer', function() {
  var sandbox = sinon.sandbox.create();
  var $httpBackend,
    responseHeaderAnalyzer;

  beforeEach(module('risevision.widget.common.url-field.response-header-analyzer'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('HEAD', 'https://proxy.risevision.com/http://www.google.com')
      .respond(200, '', { 'x-frame-options': 'SAMEORIGIN' });
    $httpBackend.when('HEAD', 'https://proxy.risevision.com/http://www.risevision.com')
      .respond(200, '', {});
    $httpBackend.when('HEAD', 'https://proxy.risevision.com/https://www.fireeye.com')
      .respond(200, '', {
        'content-security-policy': 'default-src https: data: \'unsafe-inline\' \'unsafe-eval\';frame-ancestors \'self\' https://content.fireeye.com'
      });
    $httpBackend.when('HEAD', 'https://proxy.risevision.com/https://www.unsupported-content.com')
      .respond(200, '', { 'content-type': 'application/unsupported' });
    $httpBackend.when('HEAD', 'https://proxy.risevision.com/https://www.supported-content.com')
      .respond(200, '', { 'content-type': 'text/html' });
    $httpBackend.when('HEAD', 'https://proxy.risevision.com/https://www.cnn.com')
      .respond(401, '');
  }));

  beforeEach(inject(function(_responseHeaderAnalyzer_) {
    responseHeaderAnalyzer = _responseHeaderAnalyzer_;
  }));

  afterEach(function() {
    sandbox.restore();
  });

  describe('responseHeaderAnalyzer', function() {
    it('should exist', function() {
      expect(responseHeaderAnalyzer).to.be.defined;
      expect(responseHeaderAnalyzer.validate).to.be.a('function');
    });
  });

  describe('validate:',function() {
    it('resolves on empty options',function(done){      
      responseHeaderAnalyzer.validate('http://www.risevision.com').then(function(){
        done()
      },function(){
        done('should not have rejected');
      });
      $httpBackend.flush();
    });

    it('rejects on X-Frame-Options',function(done){      
      responseHeaderAnalyzer.validate('http://www.google.com').then(function(){
        done('should not have resolved');
      },function(reason){
        expect(reason).to.equal('X-Frame-Options');
        done()
      });
      $httpBackend.flush();
    });

    it('rejects on frame-ancestors',function(done){      
      responseHeaderAnalyzer.validate('https://www.fireeye.com').then(function(){
        done('should not have resolved');
      },function(reason){
        expect(reason).to.equal('frame-ancestors');
        done()
      });
      $httpBackend.flush();
    });

    it('rejects on request failure',function(done){      
      responseHeaderAnalyzer.validate('https://www.cnn.com').then(function(){
        done('should not have resolved');
      },function(reason){
        expect(reason).to.equal('not-reachable');
        done()
      });
      $httpBackend.flush();
    });

    it('rejects on unsupported content-type',function(done){      
      responseHeaderAnalyzer.validate('https://www.unsupported-content.com').then(function(){
        done('should not have resolved');
      },function(reason){
        expect(reason).to.equal('content-type');
        done()
      });
      $httpBackend.flush();
    });

    it('resolves on valid content-type',function(done){      
      responseHeaderAnalyzer.validate('https://www.supported-content.com').then(function(){
        done()
      },function(){
        done('should not have rejected');
      });
      $httpBackend.flush();
    });
  })

});
