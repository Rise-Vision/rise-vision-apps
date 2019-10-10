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

    expect(financialLicenseFactory.checkFinancialDataLicenseMessage).to.be.a.function;
  });

  describe('checkFinancialDataLicenseMessage', function() {
    
    describe('checkFinancialDataLicenseMessage', function() {
      beforeEach(function() {
        sandbox.stub($modal,'open').returns({result: Q.resolve()});
      });

      it('should open modal if rise-data-financial component is present',function() {
        blueprintData.components = [{type: 'rise-data-financial'}];
        financialLicenseFactory.checkFinancialDataLicenseMessage();
        $modal.open.should.have.been.called;

        blueprintData.components = [{type: 'rise-data-financial'},{type: 'rise-data-financial'}];
        financialLicenseFactory.checkFinancialDataLicenseMessage();
        $modal.open.should.have.been.calledTwice;

        blueprintData.components = [{type: 'rise-image'},{type: 'rise-data-financial'}];
        financialLicenseFactory.checkFinancialDataLicenseMessage();
        $modal.open.should.have.been.calledThrice;
      });

      it('should not do anything if there are no rise-data-financial components',function() {
        blueprintData.components = [{type: 'rise-image'}];
        financialLicenseFactory.checkFinancialDataLicenseMessage();
        $modal.open.should.not.have.been.called;

        blueprintData.components = [];
        financialLicenseFactory.checkFinancialDataLicenseMessage();
        $modal.open.should.not.have.been.called;
      });

      it('should not do anything on empty blueprint data',function() {
        financialLicenseFactory.checkFinancialDataLicenseMessage();
        $modal.open.should.not.have.been.called;
      });
    });

    describe('showFinancialDataLicenseRequiredMessage',function() {
      beforeEach(function() {
        blueprintData.components = [{type: 'rise-data-financial'}];
      });

      it('should open modal',function(){
        sandbox.stub($modal,'open').returns({ result: { then: sandbox.stub() } });

        financialLicenseFactory.checkFinancialDataLicenseMessage();
        
        $modal.open.should.have.been.calledWithMatch({
          controller: "confirmModalController",
          windowClass: 'madero-style centered-modal financial-data-license-message'
        });
      });

      it('should dismiss and open Contact Us on page confirm', function(done){
        var modalInstance = { result: Q.resolve(), dismiss: sinon.stub() };           
        sandbox.stub($modal,'open').returns(modalInstance);
        sandbox.stub($window,'open');

        financialLicenseFactory.checkFinancialDataLicenseMessage();

        setTimeout(function(){
          modalInstance.dismiss.should.have.been.called;
          $window.open.should.have.been.calledWith('https://www.risevision.com/contact-us?form_selected=sales&content_hide=true', "_blank"); 
          done() 
        },10);
      });
    });
  });
  
});
