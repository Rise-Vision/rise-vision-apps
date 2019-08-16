'use strict';

describe('service: blueprint factory', function() {
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranlate()));

  var PRODUCT_CODE = "template123";
  var blueprintFactory, httpReturn, $httpBackend;
  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      blueprintFactory = $injector.get('blueprintFactory');
    });
  });

  it('should exist',function(){
    expect(blueprintFactory).to.be.ok;
    expect(blueprintFactory.load).to.be.a('function');
    expect(blueprintFactory.hasBranding).to.be.a('function');
  });

  describe('load: ', function() {

    it('should call API and return blueprintData',function(done) {
      $httpBackend.expect('GET', 'https://widgets.risevision.com/beta/templates/template123/blueprint.json').respond(200, 'blueprintData');

      blueprintFactory.load(PRODUCT_CODE)
        .then(function(resp) {
          expect(resp).to.equal('blueprintData');
          done();
        });

      $httpBackend.flush();
    });

    it('should populate factory object on load',function(done) {
      $httpBackend.expect('GET', 'https://widgets.risevision.com/beta/templates/template123/blueprint.json').respond(200, 'blueprintData');

      blueprintFactory.load(PRODUCT_CODE)
        .then(function(resp) {
          expect(blueprintFactory.blueprintData).to.equal('blueprintData');
          done();
        });

      $httpBackend.flush();
    });

    it('should reject on http error',function(done) {
      $httpBackend.expect('GET', 'https://widgets.risevision.com/beta/templates/template123/blueprint.json').respond(500, { error: 'Error' });

      blueprintFactory.load(PRODUCT_CODE)
        .then(null,function(error) {
          expect(error).to.be.ok;
          done();
        });

      $httpBackend.flush();
    });    
  });

  describe('hasBranding: ', function() {

    it('should return false if blueprintData is not populated',function() {
      expect(blueprintFactory.hasBranding()).to.be.false;
    });

    it('should return true if blueprintData.branding is true',function() {
      blueprintFactory.blueprintData = {
        branding: true
      };

      expect(blueprintFactory.hasBranding()).to.be.true;
    });

    it('should return false otherwise',function() {
      blueprintFactory.blueprintData = {
        branding: false
      };

      expect(blueprintFactory.hasBranding()).to.be.false;
    });    
  });

});
