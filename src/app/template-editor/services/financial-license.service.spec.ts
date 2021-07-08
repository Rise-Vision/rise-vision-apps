import {expect} from 'chai';

import { TestBed } from '@angular/core/testing';

import { FinancialLicenseService } from './financial-license.service';

import { BlueprintService } from './blueprint.service';
import { ModalService } from 'src/app/components/modals/modal.service';

describe('FinancialLicenseService', () => {
  let sandbox = sinon.sandbox.create();

  let service: FinancialLicenseService;
  let blueprintFactory, modalService;

  beforeEach(() => {
    blueprintFactory = {
      blueprintData: {}
    },
    modalService = {
      confirm : sandbox.stub().resolves()
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: ModalService, useValue: modalService},
        {provide: BlueprintService, useValue: blueprintFactory}
      ]
    });
    service = TestBed.inject(FinancialLicenseService);

    sandbox.stub(window, 'open');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should be created', () => {
    expect(service).to.be.ok;
  });

  describe('needsFinancialDataLicense', function() {
    it('should open modal if rise-data-financial component is present',function() {
      blueprintFactory.blueprintData.components = [{type: 'rise-data-financial'}];
      expect(service.needsFinancialDataLicense()).to.be.true;

      blueprintFactory.blueprintData.components = [{type: 'rise-data-financial'},{type: 'rise-data-financial'}];
      expect(service.needsFinancialDataLicense()).to.be.true;

      blueprintFactory.blueprintData.components = [{type: 'rise-image'},{type: 'rise-data-financial'}];
      expect(service.needsFinancialDataLicense()).to.be.true;
    });

    it('should not do anything if there is no blueprint data',function() {
      delete blueprintFactory.blueprintData;
      expect(service.needsFinancialDataLicense()).to.be.false;
    });

    it('should not do anything if there are no rise-data-financial components',function() {
      blueprintFactory.blueprintData.components = [{type: 'rise-image'}];
      expect(service.needsFinancialDataLicense()).to.be.false;

      blueprintFactory.blueprintData.components = [];
      expect(service.needsFinancialDataLicense()).to.be.false;
    });

    it('should not do anything on empty blueprint data',function() {
      service.needsFinancialDataLicense();
      expect(service.needsFinancialDataLicense()).to.be.false;
    });
  });

  describe('showFinancialDataLicenseRequiredMessage',function() {
    it('should open modal',function(){
      service.showFinancialDataLicenseRequiredMessage();
      
      modalService.confirm.should.have.been.calledWith(
        'Financial Data License Required',
        'This Presentation requires a Financial Data License to show on your Display(s). Contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> for a 30 day free trial.',
        'Get a 30 Day Free Trial', 
        'Close'
      );
    });

    it('should open Contact Us on page confirm', function(done){
      service.showFinancialDataLicenseRequiredMessage();

      setTimeout(function(){
        window.open.should.have.been.calledWith('https://www.risevision.com/contact-us?form_selected=sales&content_hide=true', "_blank"); 
        done() 
      },10);
    });
  });

});
