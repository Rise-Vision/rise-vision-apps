'use strict';

describe('service: brandingFactory', function() {

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function($provide) {
    $provide.service('templateEditorFactory', function() {
      return {
        blueprintData: blueprintData
      };
    });
  }));

  var brandingFactory, blueprintData;

  beforeEach(function() {
    blueprintData = {};

    inject(function($injector) {
      brandingFactory = $injector.get('brandingFactory');
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
