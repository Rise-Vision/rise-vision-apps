'use strict';

describe('service: brandingFactory', function() {

  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranlate()));

  beforeEach(module(function($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('blueprintFactory', function() {
      return {
        hasBranding: sinon.stub()
      };
    });
    $provide.service('userState', function() {
      return {
        getSelectedCompanyId: sinon.stub().returns('companyId'),
        getCopyOfSelectedCompany: sinon.stub().returns({}),
        updateCompanySettings: sinon.stub(),
        _restoreState: function() {}
      };
    });
    $provide.service('updateCompany', function() {
      return sinon.stub().returns(Q.resolve('updatedCompany'));
    });
  }));

  var brandingFactory, $rootScope, userState, blueprintFactory, updateCompany;

  beforeEach(function() {
    inject(function($injector) {
      brandingFactory = $injector.get('brandingFactory');
      
      $rootScope = $injector.get('$rootScope');
      blueprintFactory = $injector.get('blueprintFactory');
      userState = $injector.get('userState');
      updateCompany = $injector.get('updateCompany');
    });
  });

  it('should initialize', function () {
    expect(brandingFactory).to.be.ok;
    expect(brandingFactory.getBrandingComponent).to.be.a('function');
    expect(brandingFactory.publishBranding).to.be.a('function');
    expect(brandingFactory.updateDraftColors).to.be.a('function');
    expect(brandingFactory.updateDraftLogo).to.be.a('function');
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
        logoFile: undefined
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
        logoFile: undefined
      });
    });

  });

  describe('risevision.company.updated: ', function() {
    it('should load branding settings on event', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {}
      });

      $rootScope.$emit('risevision.company.updated');
      $rootScope.$digest();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: undefined,
        logoFile: undefined
      });
    });

    it('should update branding settings on subsequent events', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {}
      });

      $rootScope.$emit('risevision.company.updated');
      $rootScope.$digest();

      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'logoFile'
        }
      });

      $rootScope.$emit('risevision.company.updated');
      $rootScope.$digest();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: undefined,
        logoFile: 'logoFile'
      });
    });

  });

  describe('risevision.company.selectedCompanyChanged: ', function() {
    it('should update branding settings on event', function() {
      brandingFactory.brandingSettings = 'previousBranding';

      userState.getCopyOfSelectedCompany.returns({
        settings: {}
      });

      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: undefined,
        logoFile: undefined
      });
    });

  });


  describe('brandingSettings: ', function() {
    it('should apply draft settings if available', function() {
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
          brandingDraftAccentColor: 'draftAccentColor'
        }
      });

      brandingFactory.getBrandingComponent();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: undefined,
        accentColor: 'draftAccentColor',
        logoFile: 'draftLogoFile'
      });
    });

    it('should apply published settings if draft is not available', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingLogoFile: 'logoFile',
          brandingBaseColor: 'baseColor',
          brandingAccentColor: 'accentColor'
        }
      });

      $rootScope.$emit('risevision.company.updated');
      $rootScope.$digest();

      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'logoFile'
        }
      });

      brandingFactory.getBrandingComponent();

      expect(brandingFactory.brandingSettings).to.deep.equal({
        baseColor: 'baseColor',
        accentColor: 'accentColor',
        logoFile: 'logoFile'
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
      brandingFactory.isRevised.restore();
    });

    it('should publish if the settings are revised', function(done) {
      brandingFactory.publishBranding().then(function() {
        updateCompany.should.have.been.called;

        done();
      });
    });

    it('should not publish if the settings are not revised', function(done) {
      brandingFactory.isRevised.returns(false);

      brandingFactory.publishBranding().then(function() {
        updateCompany.should.not.have.been.called;

        done();
      });
    });

    it('should publish settings and clear drafts', function(done) {
      brandingFactory.publishBranding().then(function() {
        updateCompany.should.have.been.calledWith('companyId', {
          settings: {
            brandingLogoFile: 'draftLogoFile',
            brandingDraftLogoFile: '',
            brandingBaseColor: 'draftBaseColor',
            brandingDraftBaseColor: '',
            brandingAccentColor: 'draftAccentColor',
            brandingDraftAccentColor: ''
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
      updateCompany.returns(Q.reject('err'));

      brandingFactory.publishBranding().then(function() {
        done('no error');
      }).then(null, function(err) {
        expect(err).to.equal('err');

        done();
      });
    });
  });

  it('updateDraftColors: ', function(done) {
    brandingFactory.brandingSettings = {
      baseColor: 'draftBaseColor',
      accentColor: 'draftAccentColor'
    };

    brandingFactory.updateDraftColors().then(function() {
      updateCompany.should.have.been.calledWith('companyId', {
        settings: {
          brandingDraftBaseColor: 'draftBaseColor',
          brandingDraftAccentColor: 'draftAccentColor'
        }
      });

      done();
    });
  });

  it('updateDraftLogo: ', function(done) {
    brandingFactory.brandingSettings = {
      logoFile: 'draftLogoFile'
    };

    brandingFactory.updateDraftLogo().then(function() {
      updateCompany.should.have.been.calledWith('companyId', {
        settings: {
          brandingDraftLogoFile: 'draftLogoFile'
        }
      });

      done();
    });
  });

  describe('isRevised', function() {
    it('should be false if settings does not exist', function() {
      expect(brandingFactory.isRevised()).to.be.false;
    });

    it('should be false if none of the draft settings exist', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingLogoFile: 'logoFile',
          brandingBaseColor: 'baseColor',
          brandingAccentColor: 'accentColor'
        }
      });

      expect(brandingFactory.isRevised()).to.be.false;
    });

    it('should be true if the draft settings exist', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftLogoFile: 'draftLogoFile',
          brandingDraftBaseColor: 'draftBaseColor',
          brandingDraftAccentColor: 'draftAccentColor'
        }
      });

      expect(brandingFactory.isRevised()).to.be.true;
    });

    it('should be true if any of the the draft settings exist', function() {
      userState.getCopyOfSelectedCompany.returns({
        settings: {
          brandingDraftAccentColor: 'draftAccentColor'
        }
      });

      expect(brandingFactory.isRevised()).to.be.true;
    });

  });

});
