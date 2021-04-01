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
        updateCompanySettings: sandbox.stub(),
        hasRole: sandbox.stub().returns(true)
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
      return enableCompanyProduct = sandbox.stub().returns(Q.resolve({ 
        item: {
          displays: {
            'displayId': true,
            'displayId2': true
          }
        }
      }));
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

    expect(playerLicenseFactory.getUsedLicenseString).to.be.a('function');
    expect(playerLicenseFactory.isProAvailable).to.be.a('function');
    expect(playerLicenseFactory.hasProfessionalLicenses).to.be.a('function');
    expect(playerLicenseFactory.getProLicenseCount).to.be.a('function');
    expect(playerLicenseFactory.getProAvailableLicenseCount).to.be.a('function');
    expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.be.a('function');
    expect(playerLicenseFactory.areAllProLicensesUsed).to.be.a('function');
    expect(playerLicenseFactory.licenseDisplaysByCompanyId).to.be.a('function');
  });

  describe('getUsedLicenseString:', function() {
    it('should handle 0 case', function () {
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 0;
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;

      expect(playerLicenseFactory.getUsedLicenseString()).to.equal('0 Licensed Displays / 0 Available Licenses');
    });

    it('should handle 1 case', function () {
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 2;
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 1;

      expect(playerLicenseFactory.getUsedLicenseString()).to.equal('1 Licensed Display / 1 Available License');
    });

    it('should handle multiples case', function () {
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 4;
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 2;

      expect(playerLicenseFactory.getUsedLicenseString()).to.equal('2 Licensed Displays / 2 Available Licenses');
    });

  });

  describe('isProAvailable:', function() {
    var display;

    beforeEach(function() {
      display = { playerProAuthorized: false };
    });

    it('should return false if no hasProfessionalLicenses = false', function () {
      sandbox.stub(playerLicenseFactory, 'hasProfessionalLicenses').returns(false);

      expect(playerLicenseFactory.isProAvailable(display)).to.be.false;
    });

    it('should return false if available licenses are zero (Free Plan)', function () {
      sandbox.stub(playerLicenseFactory, 'hasProfessionalLicenses').returns(true);
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 0;

      expect(playerLicenseFactory.isProAvailable(display)).to.be.false;
    });

    it('should return false if all available licenses are used', function () {
      sandbox.stub(playerLicenseFactory, 'hasProfessionalLicenses').returns(true);
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;

      expect(playerLicenseFactory.isProAvailable(display)).to.be.false;
    });

    it('should return true if there are available licenses', function () {
      sandbox.stub(playerLicenseFactory, 'hasProfessionalLicenses').returns(true);

      expect(playerLicenseFactory.isProAvailable(display)).to.be.true;
    });
  });

  describe('areAllProLicensesUsed:', function() {
    it('should return false if no licenses are available', function () {
      var display = {
        playerProAssigned: false
      };
      currentPlanFactory.currentPlan.playerProTotalLicenseCount = 0;
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;

      expect(playerLicenseFactory.areAllProLicensesUsed(display)).to.be.false;
    });

    it('should return false if not all licenses are used', function () {
      var display = {
        playerProAssigned: false
      };

      expect(playerLicenseFactory.areAllProLicensesUsed(display)).to.be.false;
    });

    it('should handle null display', function () {
      var display = null;

      expect(playerLicenseFactory.areAllProLicensesUsed(display)).to.be.false;
    });

    it('should return true if display is not playerProAssigned', function () {
      var display = {
        playerProAssigned: false
      };
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;

      expect(playerLicenseFactory.areAllProLicensesUsed(display)).to.be.true;
    });

    it('should return false if display is playerProAssigned', function () {
      var display = {
        playerProAssigned: true
      };
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;

      expect(playerLicenseFactory.areAllProLicensesUsed(display)).to.be.false;
    });
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

  describe('isProToggleEnabled:', function() {
    var display;

    beforeEach(function() {
      display = { playerProAuthorized: false };
    });

    it('should return true if not authorized', function () {
      expect(playerLicenseFactory.isProToggleEnabled(display)).to.be.true;
    });

    it('should return true if playerProAuthorized = true', function () {
      display = { playerProAuthorized: true };

      expect(playerLicenseFactory.isProToggleEnabled(display)).to.be.true;
    });

    it('should return true if not all licenses are used, even if plan is purchased by parent', function () {
      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      expect(playerLicenseFactory.isProToggleEnabled(display)).to.be.true;
    });

    it('should return true if all licenses are used but plan is not purchased by parent', function () {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;

      expect(playerLicenseFactory.isProToggleEnabled(display)).to.be.true;
    });

    it('should return false if all licenses are used but plan is purchased by parent', function () {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;
      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      expect(playerLicenseFactory.isProToggleEnabled(display)).to.be.false;
    });
    
    it('should return true if authorized even if all licenses are used and the plan is purchased by parent', function () {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 0;
      currentPlanFactory.currentPlan.isPurchasedByParent = true;
      display = { playerProAuthorized: true };

      expect(playerLicenseFactory.isProToggleEnabled(display)).to.be.true;
    });

    it('should return false if user is not display administrator', function () {
      userState.hasRole.returns(false);

      expect(playerLicenseFactory.isProToggleEnabled(display)).to.be.false;
    });

  });

  describe('updateDisplayLicenseLocal:', function() {
    it('should update playerProAssigned and playerProAuthorized', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: 1
      });
      var display = { playerProAuthorized: true };

      playerLicenseFactory.updateDisplayLicenseLocal(display);

      expect(display.playerProAssigned).to.be.true;
      expect(display.playerProAuthorized).to.be.true;
    });

    it('should assigne but not authorize if there are no licenses available', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: 0
      });
      var display = { playerProAuthorized: true };

      playerLicenseFactory.updateDisplayLicenseLocal(display);

      expect(display.playerProAssigned).to.be.true;
      expect(display.playerProAuthorized).to.be.false;
    });

    it('should authorize even if 0 license are available if display was originally assigned', function() {
      sandbox.stub(userState, 'getCopyOfSelectedCompany').returns({
        playerProAvailableLicenseCount: 0
      });
      var display = { 
        playerProAuthorized: true,
        originalPlayerProAuthorized: true
      };

      playerLicenseFactory.updateDisplayLicenseLocal(display);

      expect(display.playerProAssigned).to.be.true;
      expect(display.playerProAuthorized).to.be.true;
    });
  });

  describe('updateDisplayLicense:', function() {
    it('should license display', function(done) {
      var display = { id: 'displayId', playerProAuthorized: true };
      sandbox.stub(playerLicenseFactory, 'updateDisplayLicenseLocal');
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');

      playerLicenseFactory.updateDisplayLicense(display);

      expect(playerLicenseFactory.apiError).to.equal('');
      expect(playerLicenseFactory.updatingLicense).to.be.true;

      setTimeout(function() {
        expect(playerLicenseFactory.updateDisplayLicenseLocal).to.have.been.calledWith(display);
        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(display.playerProAuthorized);

        expect(playerLicenseFactory.apiError).to.equal('');
        expect(playerLicenseFactory.updatingLicense).to.be.false;

        done();
      });
    });

    it('should handle license update failure', function(done) {
      var display = { id: 'displayId', playerProAuthorized: true };
      enableCompanyProduct.returns(Q.reject());

      playerLicenseFactory.updateDisplayLicense(display)
        .catch(function() {
          expect(playerLicenseFactory.apiError).to.equal('processedError');
          expect(playerLicenseFactory.updatingLicense).to.be.false;

          done();
        });
    });

    it('should fail if display id is not on the returned list from server', function(done) {
      var display = { id: 'OTHER_displayId', playerProAuthorized: true };
      sandbox.stub(playerLicenseFactory, 'updateDisplayLicenseLocal');
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');

      playerLicenseFactory.updateDisplayLicense(display)
        .catch(function() {
          expect(playerLicenseFactory.apiError).to.equal('processedError');
          expect(playerLicenseFactory.updatingLicense).to.be.false;

          done();
        });
    });

    it('should toggle monitoring off when not licensed', function(done) {
      var display = { id: 'displayId', playerProAuthorized: false, monitoringEnabled: true };
      enableCompanyProduct.returns(Q.resolve({ 
        item: { displays: { 'displayId': false } }
      }));

      playerLicenseFactory.updateDisplayLicense(display)
        .then(function() {
          expect(display.monitoringEnabled).to.be.false;
          done();
        });
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

  describe('licenseDisplaysByCompanyId:', function() {
    beforeEach(function() {
      sinon.spy(playerLicenseFactory, 'toggleDisplayLicenseLocal');
    });

    it('should license displays', function(done) {
      playerLicenseFactory.licenseDisplaysByCompanyId('companyId', ['displayId', 'displayId2']).then(function() {
        
        enableCompanyProduct.should.have.been.called;
        playerLicenseFactory.toggleDisplayLicenseLocal.should.have.been.calledWith(true, 2);

        done();
      });      
    });

    it('should handle partial success - displays assigned but not all licensed', function(done) {
      enableCompanyProduct.returns(Q.resolve({ 
        item: {
          displays: {
            'displayId': true,
            'displayId2': false
          }
        }
      }));

      playerLicenseFactory.licenseDisplaysByCompanyId('companyId', ['displayId', 'displayId2']).catch(function() {
        
        enableCompanyProduct.should.have.been.called;
        playerLicenseFactory.toggleDisplayLicenseLocal.should.have.been.calledWith(true, 1);

        done();
      });      
    });

    it('should handle licensing failures', function(done) {
      enableCompanyProduct.returns(Q.reject());

      playerLicenseFactory.licenseDisplaysByCompanyId('companyId', ['displayId', 'displayId2']).catch(function() {
        
        enableCompanyProduct.should.have.been.called;
        playerLicenseFactory.toggleDisplayLicenseLocal.should.not.have.been.called;

        done();
      });
    });
  });

  describe('confirmAndLicense:', function() {
    beforeEach(function() {
      sinon.stub(playerLicenseFactory, 'licenseDisplaysByCompanyId').returns(Q.resolve());
    });

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
        plansFactory.confirmAndPurchase.should.have.been.calledWith(1);

        done();
      });
    });

    it('should license displays', function(done) {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 2;

      playerLicenseFactory.confirmAndLicense(['displayId', 'displayId2']).then(function() {
        
        playerLicenseFactory.licenseDisplaysByCompanyId.should.have.been.called;
        expect(playerLicenseFactory.updatingLicense).to.be.false;
        expect(playerLicenseFactory.apiError).to.equal('');

        done();
      });      
    });

    it('should handle licensing failures', function(done) {
      currentPlanFactory.currentPlan.playerProAvailableLicenseCount = 2;
      playerLicenseFactory.licenseDisplaysByCompanyId.returns(Q.reject('apiError'));

      playerLicenseFactory.confirmAndLicense(['displayId', 'displayId2']).catch(function() {
        
        playerLicenseFactory.licenseDisplaysByCompanyId.should.have.been.called;
        expect(playerLicenseFactory.updatingLicense).to.be.false;       
        expect(playerLicenseFactory.apiError).to.equal('processedError');

        done();
      });
    });
  });
});
