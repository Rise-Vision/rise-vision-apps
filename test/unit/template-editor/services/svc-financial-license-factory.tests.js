'use strict';

describe('service: financialLicenseFactory:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('blueprintFactory', function() { 
      return {
        blueprintData: blueprintData
      };
    });
  }));

  var financialLicenseFactory, $modal, $window, blueprintData;

  beforeEach(function() {
    blueprintData = {};
    inject(function($injector) {
      financialLicenseFactory = $injector.get('financialLicenseFactory');
      $modal = $injector.get('$modal');
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
      blueprintData.components = [{type: 'rise-data-financial'}];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.true;

      blueprintData.components = [{type: 'rise-data-financial'},{type: 'rise-data-financial'}];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.true;

      blueprintData.components = [{type: 'rise-image'},{type: 'rise-data-financial'}];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.true;
    });

    it('should not do anything if there are no rise-data-financial components',function() {
      blueprintData.components = [{type: 'rise-image'}];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.false;

      blueprintData.components = [];
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.false;
    });

    it('should not do anything on empty blueprint data',function() {
      financialLicenseFactory.needsFinancialDataLicense();
      expect(financialLicenseFactory.needsFinancialDataLicense()).to.be.false;
    });
  });

  describe('showFinancialDataLicenseRequiredMessage',function() {
    it('should open modal',function(){
      sandbox.stub($modal,'open').returns({ result: { then: sandbox.stub() } });

      financialLicenseFactory.showFinancialDataLicenseRequiredMessage();
      
      $modal.open.should.have.been.calledWithMatch({
        controller: "confirmModalController",
        windowClass: 'madero-style centered-modal financial-data-license-message'
      });
    });

    it('should dismiss and open Contact Us on page confirm', function(done){
      var modalInstance = { result: Q.resolve(), dismiss: sinon.stub() };           
      sandbox.stub($modal,'open').returns(modalInstance);
      sandbox.stub($window,'open');

      financialLicenseFactory.showFinancialDataLicenseRequiredMessage();

      setTimeout(function(){
        modalInstance.dismiss.should.have.been.called;
        $window.open.should.have.been.calledWith('https://www.risevision.com/contact-us?form_selected=sales&content_hide=true', "_blank"); 
        done() 
      },10);
    });
  });
  
});
