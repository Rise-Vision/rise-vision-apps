'use strict';

describe('Services: playerLicenseFactory', function() {
  var storeApiFailure;

  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    storeApiFailure = false;

    $provide.service('$q', function() {return Q;});
    $provide.service('userState', function () {
      return {
        _restoreState: function () {},
        getSelectedCompanyId: function () {
          return null;
        },
        getCopyOfSelectedCompany: function() {
          return {};
        },
        updateCompanySettings: sandbox.stub()
      };
    });
    $provide.service('currentPlanFactory', function() {
      return currentPlanFactory = {
        isPlanActive: function() {
          return true;
        },
        isProSubscribed: function() {
          return true;
        },
        currentPlan: {
          playerProTotalLicenseCount: 2,
          playerProAvailableLicenseCount: 1
        }
      };
    });
    $provide.service('plansFactory', function() {
      return plansFactory = {
        confirmAndPurchase: sandbox.stub()
      };
    });
    $provide.factory('confirmModal', function() {
      return confirmModal = sandbox.stub().returns(Q.resolve());
    });
    $provide.factory('enableCompanyProduct', function() {
      return enableCompanyProduct = sandbox.stub().returns(Q.resolve());
    });
    $provide.factory('processErrorCode', function() {
      return sandbox.stub().returns('processedError');
    });
    
  }));

  var sandbox, userState, playerLicenseFactory, currentPlanFactory, plansFactory, confirmModal, enableCompanyProduct;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector) {
      userState =  $injector.get('userState');
      playerLicenseFactory = $injector.get('playerLicenseFactory');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect(playerLicenseFactory).to.be.ok;
    expect(playerLicenseFactory.hasProfessionalLicenses).to.be.a('function');
    expect(playerLicenseFactory.getProLicenseCount).to.be.a('function');
    expect(playerLicenseFactory.getProAvailableLicenseCount).to.be.a('function');
    expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.be.a('function');
    expect(playerLicenseFactory.areAllProLicensesUsed).to.be.a('function');
  });
  
  describe('hasProfessionalLicenses: ', function() {
    it('should return true if Licenses are available', function() {
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 5;

      expect(playerLicenseFactory.hasProfessionalLicenses()).to.be.true;
    });

    it('should return false no licenses are available', function() {
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 0;

      expect(playerLicenseFactory.hasProfessionalLicenses()).to.be.false;
    });
  });

  describe('getProLicenseCount:', function() {
    it('should return the number of licenses', function () {
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 5;

      expect(playerLicenseFactory.getProLicenseCount()).to.equal(5);
    });

    it('should return zero licenses (correct handling of null value)', function () {
      currentPlanFactory.currentPlan = {};

      expect(playerLicenseFactory.getProLicenseCount()).to.equal(0);
    });

  });

  describe('getProAvailableLicenseCount:', function() {
    it('should return the number of licenses', function () {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 5;

      expect(playerLicenseFactory.getProAvailableLicenseCount()).to.equal(5);
    });

    it('should return zero licenses (correct handling of null value)', function () {
      currentPlanFactory.currentPlan = {};

      expect(playerLicenseFactory.getProAvailableLicenseCount()).to.equal(0);
    });

  });

  describe('getProUsedLicenseCount:', function() {
    it('should return the number of used licenses', function () {
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 5;
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 3;

      expect(playerLicenseFactory.getProUsedLicenseCount()).to.equal(2);
    });

    it('should return zero licenses (correct handling of null value)', function () {
      currentPlanFactory.currentPlan = {};

      expect(playerLicenseFactory.getProUsedLicenseCount()).to.equal(0);
    });

  });

  describe('areAllProLicensesUsed:', function() {
    it('should return all licenses are used if no licenses are Available', function () {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;

      expect(playerLicenseFactory.areAllProLicensesUsed()).to.be.true;
    });

    it('should return all licenses are used if negative licenses are Available (this should not happen)', function () {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = -5;

      expect(playerLicenseFactory.areAllProLicensesUsed()).to.be.true;
    });

    it('should return not all licenses are used if assigned list length is lower than license count', function () {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 3;

      expect(playerLicenseFactory.areAllProLicensesUsed()).to.be.false;
    });
  });

  describe('toggleDisplayLicenseLocal: ', function() {
    it('should decrease Available License count if a Display is added', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: 5
      });

      playerLicenseFactory.toggleDisplayLicenseLocal(true);

      expect(userState.updateCompanySettings).to.have.been.calledWith({
        playerProAvailableLicenseCount: 4
      });
    });

    it('should increase Available License count if a Display is removed', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: 4
      });

      playerLicenseFactory.toggleDisplayLicenseLocal(false);

      expect(userState.updateCompanySettings).to.have.been.calledWith({
        playerProAvailableLicenseCount: 5
      });
    });

    it('should decrease Available License count if more than a Display is added', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: 5
      });

      playerLicenseFactory.toggleDisplayLicenseLocal(true, 3);

      expect(userState.updateCompanySettings).to.have.been.calledWith({
        playerProAvailableLicenseCount: 2
      });
    });

    it('should increase Available License count if more than a Display is removed', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: 4
      });

      playerLicenseFactory.toggleDisplayLicenseLocal(false, 3);

      expect(userState.updateCompanySettings).to.have.been.calledWith({
        playerProAvailableLicenseCount: 7
      });
    });

    it('should not set negative Available License count', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: 0
      });

      playerLicenseFactory.toggleDisplayLicenseLocal(true);

      expect(userState.updateCompanySettings).to.have.been.calledWith({
        playerProAvailableLicenseCount: 0
      });
    });

    it('should handle invalid values', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: null
      });

      playerLicenseFactory.toggleDisplayLicenseLocal(false);

      expect(userState.updateCompanySettings).to.have.been.calledWith({
        playerProAvailableLicenseCount: 1
      });
    });
  });

  describe('confirmAndLicense:', function() {
    it('should prompt users to assign licenses', function(done) {
      playerLicenseFactory.confirmAndLicense(['displayId']).then(function() {
        confirmModal.should.have.been.calledWith(
          'License 1 display?',
          'You are about to assign licenses to 1 display. Would you like to proceed?',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
        );
        done();
      });
    });

    it('should prompt users with plural message when licensing more than one display', function(done) {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 3;

      playerLicenseFactory.confirmAndLicense(['displayId', 'displayId2']).then(function() {
        confirmModal.should.have.been.calledWith(
          'License 2 displays?',
          'You are about to assign licenses to 2 displays. Would you like to proceed?',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
        );
        done();
      });
    });

    it('should reject and show purchase options if there are not enough licenses', function(done) {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;

      playerLicenseFactory.confirmAndLicense(['displayId']).catch(function() {
        confirmModal.should.have.been.called;
        plansFactory.confirmAndPurchase.should.have.been.called;

        done();
      });
    });

    it('should license displays', function(done) {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 2;

      playerLicenseFactory.confirmAndLicense(['displayId', 'displayId2']).then(function() {
        
        enableCompanyProduct.should.have.been.called;
        expect(playerLicenseFactory.updatingLicense).to.be.false;
        expect(playerLicenseFactory.apiError).to.equal('');

        done();
      });      
    });

    it('should handle licensing failures', function(done) {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 2;
      enableCompanyProduct.returns(Q.reject('apiError'));

      playerLicenseFactory.confirmAndLicense(['displayId', 'displayId2']).catch(function() {
        
        enableCompanyProduct.should.have.been.called;
        expect(playerLicenseFactory.updatingLicense).to.be.false;       
        expect(playerLicenseFactory.apiError).to.equal('processedError');

        done();
      });
    });
  });
});
