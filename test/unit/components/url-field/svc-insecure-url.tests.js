'use strict';

describe('Insecure Url', function() {
  var sandbox = sinon.sandbox.create();
  var $httpBackend,
    insecureUrl;

  beforeEach(module('risevision.widget.common.url-field.insecure-url'));

  beforeEach(inject(function($injector) {
    insecureUrl = $injector.get('insecureUrl');
  }));

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect(insecureUrl).to.be.ok;
    expect(insecureUrl).to.be.a('function');
  });

  describe('getOptions', function() {
    it('should exist', function() {
      expect(insecureUrl.getOptions).be.defined;
    });
  })

  it('should show if url has http://', function() {
    expect(insecureUrl('http://someinsecure.site')).to.be.true;
  });

  it('should show if url has https:// or no protocol', function() {
    expect(insecureUrl('https://risevision.com')).to.be.false;
    expect(insecureUrl('://risevision.com')).to.be.false;
  });

  it('should not show if url is blank', function() {
    expect(insecureUrl()).to.be.false;
  });

});
