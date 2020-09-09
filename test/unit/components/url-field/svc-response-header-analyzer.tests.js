'use strict';

describe('Response Header Analyzer', function() {
  var sandbox = sinon.sandbox.create();
  var $httpBackend,
    responseHeaderAnalyzer;

  beforeEach(module('risevision.widget.common.url-field.response-header-analyzer'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', 'https://proxy.risevision.com/http://www.google.com')
      .respond(200, '', { 'x-frame-options': 'SAMEORIGIN' });
    $httpBackend.when('GET', 'https://proxy.risevision.com/http://www.risevision.com')
      .respond(200, '', {});
    $httpBackend.when('GET', 'https://proxy.risevision.com/https://www.fireeye.com')
      .respond(200, '', {
        'content-security-policy': 'default-src https: data: \'unsafe-inline\' \'unsafe-eval\';frame-ancestors \'self\' https://content.fireeye.com'
      });
    $httpBackend.when('GET', 'https://proxy.risevision.com/https://www.cnn.com')
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
    });
  });

  describe('getOptions', function() {
    it('should exist', function() {
      expect(responseHeaderAnalyzer.getOptions).be.defined;
      expect(responseHeaderAnalyzer.getOptions).to.be.a('function');
    });

    it('should return "X-Frame-Options" when X-Frame-Options header is present in response of webpage request', function(done) {
      responseHeaderAnalyzer.getOptions('http://www.google.com')
      .then(function(options) {
        expect(options).to.deep.equal([ 'X-Frame-Options' ]);
        done();
      });
      $httpBackend.flush();
    });

    it('should return empty options when X-Frame-Options header is not present in response of webpage request', function(done) {
      responseHeaderAnalyzer.getOptions('http://www.risevision.com')
      .then(function(options) {
        expect(options).to.deep.equal([]);
        done();
      });
      $httpBackend.flush();
    });

    it('should return "frame-ancestors" when content-security-policy header is present and restricts by frame-ancestors', function(done) {
      responseHeaderAnalyzer.getOptions('https://www.fireeye.com')
      .then(function(options) {
        expect(options).to.deep.equal([ 'frame-ancestors' ]);
        done();
      });
      $httpBackend.flush();
    });
  });

  describe('validate',function() {
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
      },function(){
        done()
      });
      $httpBackend.flush();
    });

    it('rejects on frame-ancestors',function(done){      
      responseHeaderAnalyzer.validate('https://www.fireeye.com').then(function(){
        done('should not have resolved');
      },function(){
        done()
      });
      $httpBackend.flush();
    });
  })

});
