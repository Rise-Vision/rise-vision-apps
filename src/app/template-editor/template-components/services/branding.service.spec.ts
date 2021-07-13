import { expect, assert } from 'chai';
import { TestBed } from '@angular/core/testing';
import { BrandingService } from './branding.service';
import { UserState, UpdateCompany } from 'src/app/ajs-upgraded-providers';
import { BroadcasterService } from 'src/app/shared/services/broadcaster.service';
import { BlueprintService } from '../../services/blueprint.service';
import { FileExistenceCheckService } from './file-existence-check.service';

describe('BrandingService', () => {
  let brandingFactory: BrandingService;
  var broadcaster, userState, blueprintFactory, updateCompany, fileExistenceCheckService, subscription;


  beforeEach(() => {
    broadcaster = new BroadcasterService({
      $broadcast: sinon.stub()
    })
    sinon.spy(broadcaster,'emit');
    sinon.spy(broadcaster,'subscribe');    

    blueprintFactory = {
      hasBranding: sinon.stub()
    };
    userState = {
      getSelectedCompanyId: sinon.stub().returns('companyId'),
      getCopyOfSelectedCompany: sinon.stub().returns({}),
      updateCompanySettings: sinon.stub(),
      _restoreState: function() {}
    };
    updateCompany = sinon.stub().returns(Promise.resolve('updatedCompany'));
    fileExistenceCheckService = {
      requestMetadataFor: sinon.stub().returns(Promise.resolve('metadata'))
    };

    TestBed.configureTestingModule({
      providers: [
        { useValue: userState, provide: UserState},
        { useValue: broadcaster, provide: BroadcasterService},
        { useValue: blueprintFactory, provide: BlueprintService},
        { useValue: updateCompany, provide: UpdateCompany},
        { useValue: fileExistenceCheckService, provide: FileExistenceCheckService},
      ]
    });
    brandingFactory = TestBed.inject(BrandingService);
    
    subscription = broadcaster.subscribe.returnValues[0];
    sinon.spy(subscription,'unsubscribe');
  });


  it('should initialize', function () {
    expect(brandingFactory).to.be.ok;
    expect(brandingFactory.hasUnsavedChanges).to.be.false;
    expect(brandingFactory.getBrandingComponent).to.be.a('function');
    expect(brandingFactory.publishBranding).to.be.a('function');
    expect(brandingFactory.saveBranding).to.be.a('function');
    expect(brandingFactory.setUnsavedChanges).to.be.a('function');
    expect(brandingFactory.isRevised).to.be.a('function');
  });

  describe('getBrandingComponent: ', function() {
    it('should not return the component if the template is not branded', function() {
      blueprintFactory.hasBranding.returns(false);

      expect(brandingFactory.getBrandingComponent()).to.be.null;
    });

    it('should return the component details if the template is branded', function() {
      blueprintFactory.hasBranding.returns(true);

      expect(brandingFactory.getBrandingComponent()).to.be.ok;
      expect(brandingFactory.getBrandingComponent()).to.deep.equal({
        type: 'rise-branding'
      });
    });

    it('should load branding settings', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {}
      });

      brandingFactory.getBrandingComponent();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: undefined,
        logoFile: undefined,
        logoFileMetadata: []
      });
    });

    it('should only load branding settings once when getting component', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {}
      });

      brandingFactory.getBrandingComponent();

      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'logoFile'
        }
      });

      brandingFactory.getBrandingComponent();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: undefined,
        logoFile: undefined,
        logoFileMetadata: []
      });
    });

  });

  describe('risevision.company.selectedCompanyChanged: ', function() {
    it('should update branding settings on event', function() {
      brandingFactory.brandingSettings = 'previousBranding';

      userState.getCopyOfSelectedCompany.returns({
        settings: {}
      });

      broadcaster.emit('risevision.company.selectedCompanyChanged');

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: undefined,
        logoFile: undefined,
        logoFileMetadata: []
      });
    });

    it('should reset unsaved changes', function() {
      brandingFactory.hasUnsavedChanges = true;

      userState.getCopyOfSelectedCompany.returns({
        settings: {}
      });

      broadcaster.emit('risevision.company.selectedCompanyChanged');

      expect(brandingFactory.hasUnsavedChanges).to.be.false;
    });

    it('should update branding settings on subsequent events', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {}
      });

      broadcaster.emit('risevision.company.selectedCompanyChanged');

      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'logoFile'
        }
      });

      broadcaster.emit('risevision.company.selectedCompanyChanged');

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: undefined,
        logoFile: 'logoFile'
      });
    });

  });

  describe('_refreshMetadata()', function() {
    it('should update metadata when logo is available', function(done) {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'logoFile'
        }
      });

      brandingFactory.getBrandingComponent();

      fileExistenceCheckService.requestMetadataFor.should.have.been.calledWith(['logoFile'], sinon.match.string);

      setTimeout(function() {
        expect(brandingFactory.brandingSettings).to.deep.equal({
          baseColor: undefined,
          accentColor: undefined,
          logoFile: 'logoFile',
          logoFileMetadata: 'metadata'
        });

        done();
      }, 10);
    });

    it('should refresh metadata every time', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'logoFile'
        }
      });

      brandingFactory.getBrandingComponent();
      brandingFactory.getBrandingComponent();

      fileExistenceCheckService.requestMetadataFor.should.have.been.calledTwice;
    });

  });

  describe('brandingSettings: ', function() {
    it('should apply draft settings if in draft', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingLogoFile: 'logoFile',
          brandingDraftLogoFile: 'draftLogoFile',
          brandingBaseColor: 'baseColor',
          brandingDraftBaseColor: 'draftBaseColor',
          brandingAccentColor: 'accentColor',
          brandingDraftAccentColor: 'draftAccentColor',
          brandingRevisionStatusName: 'Revised'
        }
      });

      brandingFactory.getBrandingComponent();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: 'draftBaseColor',
        accentColor: 'draftAccentColor',
        logoFile: 'draftLogoFile'
      });
    });

    it('should apply some draft settings if available', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingLogoFile: 'logoFile',
          brandingDraftLogoFile: 'draftLogoFile',
          brandingBaseColor: 'baseColor',
          brandingAccentColor: 'accentColor',
          brandingDraftAccentColor: 'draftAccentColor',
          brandingRevisionStatusName: 'Revised'
        }
      });

      brandingFactory.getBrandingComponent();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: 'draftAccentColor',
        logoFile: 'draftLogoFile'
      });
    });

    it('should apply draft settings even if published', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'draftLogoFile',
          brandingDraftBaseColor: 'draftBaseColor',
          brandingDraftAccentColor: 'draftAccentColor',
          brandingRevisionStatusName: 'Published'
        }
      });

      brandingFactory.getBrandingComponent();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: 'draftBaseColor',
        accentColor: 'draftAccentColor',
        logoFile: 'draftLogoFile'
      });
    });
  });

  describe('publishBranding', function() {
    beforeEach(function() {
      sinon.stub(brandingFactory, 'isRevised').returns(true);

      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingLogoFile: 'logoFile',
          brandingDraftLogoFile: 'draftLogoFile',
          brandingBaseColor: 'baseColor',
          brandingDraftBaseColor: 'draftBaseColor',
          brandingAccentColor: 'accentColor',
          brandingDraftAccentColor: 'draftAccentColor'
        }
      });
    });

    afterEach(function() {
      (brandingFactory.isRevised as any).restore();
    });

    it('should publish if the settings are revised', function(done) {
      brandingFactory.publishBranding().then(function() {
        updateCompany.should.have.been.called;

        done();
      });
    });

    it('should not publish if the settings are not revised', function(done) {
      (brandingFactory.isRevised as any).returns(false);

      brandingFactory.publishBranding().then(function() {
        updateCompany.should.not.have.been.called;

        done();
      });
    });

    it('should publish settings based on draft values', function(done) {
      brandingFactory.publishBranding().then(function() {
        updateCompany.should.have.been.calledWith('companyId', {
          settings: {
            brandingLogoFile: 'draftLogoFile',
            brandingBaseColor: 'draftBaseColor',
            brandingAccentColor: 'draftAccentColor',
            brandingRevisionStatusName: 'Published'
          }
        });

        done();
      });
    });

    it('should update user state object', function(done) {
      brandingFactory.publishBranding().then(function() {
        userState.updateCompanySettings.should.have.been.calledWith('updatedCompany');

        done();
      });
    });

    it('should reject on company update error', function(done) {
      updateCompany.returns(Promise.reject('err'));

      brandingFactory.publishBranding().then(function() {
        assert.fail('no error');
      }).then(null, function(err) {
        expect(err).to.equal('err');

        done();
      });
    });
  });

  describe('saveBranding: ', function() {
    beforeEach(function() {
      blueprintFactory.hasBranding.returns(true);
      brandingFactory.brandingSettings = {};
    });

    it('should save if the settings are unsaved', function(done) {
      brandingFactory.hasUnsavedChanges = true;

      brandingFactory.saveBranding().then(function() {
        updateCompany.should.have.been.called;

        done();
      });
    });

    it('should not save if Template is not branded', function(done) {
      brandingFactory.hasUnsavedChanges = true;
      blueprintFactory.hasBranding.returns(false);

      brandingFactory.saveBranding().then(function() {
        updateCompany.should.not.have.been.called;

        done();
      });
    });

    it('should not save if the settings are not unsaved', function(done) {
      brandingFactory.saveBranding().then(function() {
        updateCompany.should.not.have.been.called;

        done();
      });
    });

    it('should save values from brandingSettings: ', function(done) {
      brandingFactory.hasUnsavedChanges = true;
      brandingFactory.brandingSettings = {
        baseColor: 'draftBaseColor',
        accentColor: 'draftAccentColor',
        logoFile: 'draftLogoFile'
      };

      brandingFactory.saveBranding().then(function() {
        updateCompany.should.have.been.calledWith('companyId', {
          settings: {
            brandingDraftBaseColor: 'draftBaseColor',
            brandingDraftAccentColor: 'draftAccentColor',
            brandingDraftLogoFile: 'draftLogoFile',
            brandingRevisionStatusName: 'Revised'
          }
        });

        done();
      });
    });

    it('should reset hasUnsavedChanges: ', function(done) {
      brandingFactory.hasUnsavedChanges = true;

      brandingFactory.saveBranding().then(function() {
        expect(brandingFactory.hasUnsavedChanges).to.be.false;

        done();
      });
    });

  });

  it('setUnsavedChanges: ', function() {
    brandingFactory.setUnsavedChanges();
    
    expect(brandingFactory.hasUnsavedChanges).to.be.true;

    broadcaster.emit.should.have.been.calledWith('risevision.template-editor.brandingUnsavedChanges');
  });

  describe('isRevised', function() {
    beforeEach(function() {
      blueprintFactory.hasBranding.returns(true);
    });

    it('should be false if settings does not exist', function() {
      expect(brandingFactory.isRevised()).to.be.false;
    });

    it('should be false if flag does not exist', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingLogoFile: 'logoFile',
        }
      });

      expect(brandingFactory.isRevised()).to.be.false;
    });

    it('should be false if Template is not branded', function() {
      blueprintFactory.hasBranding.returns(false);

      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'draftLogoFile',
          brandingRevisionStatusName: 'Revised'
        }
      });

      expect(brandingFactory.isRevised()).to.be.false;
    });

    it('should be true revision status equals revised', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'draftLogoFile',
          brandingRevisionStatusName: 'Revised'
        }
      });

      expect(brandingFactory.isRevised()).to.be.true;
    });

    it('should be false otherwise', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftAccentColor: 'draftAccentColor',
          brandingRevisionStatusName: 'Published'
        }
      });

      expect(brandingFactory.isRevised()).to.be.false;
    });

  });

  describe('ngOnDestroy', () => {
    it('should unregister from broadcaster', () => {      
      brandingFactory.ngOnDestroy();

      subscription.unsubscribe.should.have.been.called;
    });
  });
});
