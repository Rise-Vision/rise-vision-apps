'use strict';

describe('service: brandingFactory', function() {

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.services'));

  var brandingFactory, blueprintData, blueprintFactory;

  beforeEach(function() {
    blueprintData = {};

    inject(function($injector) {
      brandingFactory = $injector.get('brandingFactory');
      blueprintFactory = $injector.get('blueprintFactory');
      blueprintFactory.blueprintData = blueprintData;
    });
  });

  it('should initialize', function () {
    expect(brandingFactory).to.be.ok;
    expect(brandingFactory.getBrandingComponent).to.be.a('function');
  });

  describe('getBrandingComponent: ', function() {
    it('should not return the component if blueprint data is missing', function() {
      expect(brandingFactory.getBrandingComponent()).to.be.null;
    });

    it('should not return the component if the template is not branded', function() {
      blueprintData.branding = false;

      expect(brandingFactory.getBrandingComponent()).to.be.null;
    });

    it('should return the component details if the template is branded', function() {
      blueprintData.branding = true;

      expect(brandingFactory.getBrandingComponent()).to.be.ok;
      expect(brandingFactory.getBrandingComponent()).to.deep.equal({
        type: 'rise-branding'
      });
    });

  });

});
