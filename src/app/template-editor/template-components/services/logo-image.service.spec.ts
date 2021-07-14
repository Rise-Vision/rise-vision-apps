import { assert, expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { LogoImageService } from './logo-image.service';
import { ModalService } from 'src/app/components/modals/modal.service';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';
import { BrandingService } from './branding.service';

describe('LogoImageService', () => {
  let logoImageFactory: LogoImageService;
  let brandingFactory, ngModalService;
  let sandbox = sinon.sandbox.create();

  beforeEach(() => {
    ngModalService = {
      confirmDanger: sandbox.stub().resolves()
    };
    brandingFactory = {
      brandingSettings: {},
      setUnsavedChanges: sandbox.stub()
    };

    TestBed.configureTestingModule({
      providers: [
        { useValue: brandingFactory, provide: BrandingService },
        { useValue: ngModalService, provide: ModalService },
        { useValue: new PromiseUtilsService(), provide: PromiseUtilsService }
      ]
    });
    logoImageFactory = TestBed.inject(LogoImageService);
  });

  afterEach(function() {
  sandbox.restore();
  });


  it('should initialize', function () {
    expect(logoImageFactory).to.be.ok;
    expect(logoImageFactory.getImagesAsMetadata).to.be.a('function');
    expect(logoImageFactory.getAvailableAttributeData).to.be.a('function');
    expect(logoImageFactory.setDuration).to.be.a('function');
    expect(logoImageFactory.getBlueprintData).to.be.a('function');
    expect(logoImageFactory.areChecksCompleted).to.be.a('function');
    expect(logoImageFactory.removeImage).to.be.a('function');
    expect(logoImageFactory.updateMetadata).to.be.a('function');
  });

  describe('getImagesAsMetadata: ', function() {
    it('should return branding logo metadata', function() {
      brandingFactory.brandingSettings.logoFile = 'file1';
      brandingFactory.brandingSettings.logoFileMetadata = ['metadata'];
      var data = logoImageFactory.getImagesAsMetadata();      

      expect(data).to.deep.equals(['metadata']);
    });

    it('should return empty if no logo', function() {
      var data = logoImageFactory.getImagesAsMetadata();
      expect(data).to.deep.equals([]);
    });

    it('should return default data if metadata not yet available', function() {
      brandingFactory.brandingSettings.logoFile = 'file1';
      var data = logoImageFactory.getImagesAsMetadata();      

      expect(data).to.deep.equals(
        [{
          exists: true,
          file: brandingFactory.brandingSettings.logoFile,
          'thumbnail-url': 'https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon-no-transparency%402x.png',
          'time-created': '0'
        }]
      );
    });
  });

  describe('getAvailableAttributeData: ', function() {
    it('should return null, as it does not apply to logo', function() {
      var data = logoImageFactory.getAvailableAttributeData();      
      expect(data).to.be.null;
    });
  });

  describe('setDuration: ', function() {
    it('should not perform any action, as it does not apply to logo', function() {
      logoImageFactory.setDuration(55);      
    });
  });

  describe('getBlueprintData: ', function() {
    it('should return null, as it does not apply to logo', function() {
      expect(logoImageFactory.getBlueprintData('key')).to.equals(null);
    });
  });

  describe('areChecksCompleted: ', function() {
    it('should return true if logo metadata is loaded', function() {
      brandingFactory.brandingSettings.logoFileMetadata = {};

      expect(logoImageFactory.areChecksCompleted()).to.be.true;
    });

    it('should return false if logo metadata is not loaded', function() {
      expect(logoImageFactory.areChecksCompleted()).to.be.false
    });
  });

  describe('removeImage: ', function() {
    it('should remove all images and clear metadata on confirm', function(done) {
      var metadata = [{file:'logo1'},{file:'logo2'}];
      sandbox.stub(logoImageFactory,'_canRemoveImage').returns(Promise.resolve());
      sandbox.stub(logoImageFactory,'updateMetadata').returns([]);

      logoImageFactory.removeImage({file:'logo1'},metadata).then(function(data){
        expect(data).to.deep.equals([]);
        logoImageFactory.updateMetadata.should.have.been.calledWith([]);
        done();
      });
    });

    it('should resolve previous metadata on cancel', function(done) {
      var metadata = [{file:'logo1'},{file:'logo2'}];
      sandbox.stub(logoImageFactory,'_canRemoveImage').returns(Promise.reject());
      sandbox.stub(logoImageFactory,'updateMetadata').returns([]);

      logoImageFactory.removeImage({file:'logo1'},metadata).then(function(data){
        expect(data).to.deep.equals(metadata);
        logoImageFactory.updateMetadata.should.not.have.been.called;
        done();
      });
    });
  });

  describe('updateMetadata: ', function() {
    it('should set branding attributes if metadata available', function() {
      var metadata = [{file:'logo1'}];
      var data = logoImageFactory.updateMetadata(metadata);      

      expect(data).to.deep.equals(metadata);
      expect(brandingFactory.brandingSettings.logoFile).to.equal('logo1');
      expect(brandingFactory.brandingSettings.logoFileMetadata).to.deep.equals(metadata);
      
      brandingFactory.setUnsavedChanges.should.have.been.called;
    });

    it('should set branding attributes with last metadata item and ignore the rest', function() {
      var lastFile = {file:'logo3'};
      var metadata = [{file:'logo1'},{file:'logo2'},lastFile];
      var data = logoImageFactory.updateMetadata(metadata);      

      expect(data).to.deep.equals([lastFile]);
      expect(brandingFactory.brandingSettings.logoFile).to.equal('logo3');
      expect(brandingFactory.brandingSettings.logoFileMetadata).to.deep.equals([lastFile]);
      
      brandingFactory.setUnsavedChanges.should.have.been.called;
    });

    it('should clear branding attributes if no metadata items', function() {
      var metadata = [];
      var data = logoImageFactory.updateMetadata(metadata);      

      expect(data).to.deep.equals(metadata);
      expect(brandingFactory.brandingSettings.logoFile).to.equal('');
      expect(brandingFactory.brandingSettings.logoFileMetadata).to.deep.equals([]);
      
      brandingFactory.setUnsavedChanges.should.have.been.called;
    });
  });

  describe('_canRemoveImage: ', function() {
    it('should show confirmation modal and resolve on confirm', function(done) {      

      logoImageFactory._canRemoveImage().then(function(){
        ngModalService.confirmDanger.should.have.been.calledWith('Are you sure you want to remove your logo?',
          'This will remove your logo from all Templates.',
          'Yes, Remove It',
          'No, Keep It'
        );
        done();
      }).catch(function(){
        assert.fail('Should not reject');
      });
    });

    it('should show confirmation modal and reject on close', function(done) {      
      ngModalService.confirmDanger.rejects();

      logoImageFactory._canRemoveImage().then(function(){
        assert.fail('Should not resolve');
      }).catch(function(){
        ngModalService.confirmDanger.should.have.been.called;        
        done();
      });
    });
  });

  describe('setTransition: ', function() {
    it('should not perform any action, as it does not apply to logo', function() {
      logoImageFactory.setTransition('fadeIn');      
    });
  });

  describe('getHelpText: ', function() {
    it('should return null, as it does not apply to logo', function() {
      var text = logoImageFactory.getHelpText();      
      expect(text).to.be.null;
    });
  });
});
