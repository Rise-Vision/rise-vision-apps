'use strict';

describe('service: financialLicenseFactory:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('blueprintFactory', function() { 
      return {
        blueprintData: {}
      };
    });
    $provide.service('ngModalService',function(){
      return {
        confirm : sandbox.stub().resolves()
      };
    });
  }));

  var financialLicenseFactory, ngModalService, $window, blueprintFactory;

  beforeEach(function() {
    inject(function($injector) {
      financialLicenseFactory = $injector.get('financialLicenseFactory');
      blueprintFactory = $injector.get('blueprintFactory');
      ngModalService = $injector.get('ngModalService');
      $window = $injector.get('$window');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should initialize', function() {
    expect(financialLicenseFactory).to.be.ok;

    expect(financialLicenseFactory.needsFinancialDataLicense).to.be.a.function;
    expect(financialLicenseFactory.showFinancialDataLicenseRequiredMessage).to.be.a.function;
  });

  describe('needsFinancialDataLicense', function() {
    it('should open modal if rise-data-financial component is present',function() {
      blueprintFactory.blueprintData.components = [{type: 'rise-data-financial'}];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.true;

      blueprintFactory.blueprintData.components = [{type: 'rise-data-financial'},{type: 'rise-data-financial'}];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.true;

      blueprintFactory.blueprintData.components = [{type: 'rise-image'},{type: 'rise-data-financial'}];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.true;
    });

    it('should not do anything if there is no blueprint data',function() {
      delete blueprintFactory.blueprintData;
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.false;
    });

    it('should not do anything if there are no rise-data-financial components',function() {
      blueprintFactory.blueprintData.components = [{type: 'rise-image'}];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.false;

      blueprintFactory.blueprintData.components = [];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.false;
    });

    it('should not do anything on empty blueprint data',function() {
      financialLicenseFactory.needsFinancialDataLicense();
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.false;
    });
  });

  describe('showFinancialDataLicenseRequiredMessage',function() {
    it('should open modal',function(){
      financialLicenseFactory.showFinancialDataLicenseRequiredMessage();
      
      ngModalService.confirm.should.have.been.calledWith(
        'Financial Data License Required',
        'This Presentation requires a Financial Data License to show on your Display(s). Contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> for a 30 day free trial.',
        'Get a 30 Day Free Trial', 
        'Close'
      );
    });

    it('should open Contact Us on page confirm', function(done){
      sandbox.stub($window,'open');

      financialLicenseFactory.showFinancialDataLicenseRequiredMessage();

      setTimeout(function(){
        $window.open.should.have.been.calledWith('https://www.risevision.com/contact-us?form_selected=sales&content_hide=true', "_blank"); 
        done() 
      },10);
    });
  });
  
});
