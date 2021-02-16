'use strict';
describe('directive: display fields', function() {
  var sandbox = sinon.sandbox.create();
  var displayId = '1234';

  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('playerProFactory', function() {
      return {        
        isDisplayControlCompatiblePlayer: sandbox.stub().returns(true)
      };
    });
    $provide.service('displayFactory', function() {
      return {
        display: {
          id: displayId,
          companyId: 'company'
        }
      };
    });
    $provide.service('display', function() {
      return {
        getCompanyProStatus: function() {
          return Q.resolve({status: 'Subscribed', statusCode: 'subscribed'});
        }
      }
    });
    $provide.service('displayControlFactory', function() {
      return {        
        openDisplayControlModal: sandbox.stub()
      };
    });
    $provide.service('playerActionsFactory', function() {
      return {};
    });
    $provide.factory('playerLicenseFactory', function() {
      return {
        toggleDisplayLicenseLocal: sinon.stub(),
        getProLicenseCount: function () {},
        areAllProLicensesUsed: function () {},
        hasProfessionalLicenses: function () {},
        isProAvailable: sinon.stub()
      };
    });
    $provide.service('scheduleFactory', function() {
      return {
        addToDistribution: sandbox.stub(),
        requiresLicense: sandbox.stub().returns(false)
      };
    });
    $provide.factory('plansFactory', function() {
      return {
        confirmAndPurchase: sandbox.spy()
      };
    });
    $provide.factory('enableCompanyProduct', function() {
      return sandbox.stub();
    });
    $provide.factory('processErrorCode', function() {
      return function(error) {
        return 'processed ' + error;
      };
    });
    $provide.factory('confirmModal', function() {
      return sandbox.stub().returns(Q.resolve());
    });
    $provide.service('messageBox', function() {
      return sandbox.stub();
    });
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId: function() {return "company1"},
        getCopyOfSelectedCompany: function() {return company;},
        _restoreState: function(){},
        updateCompanySettings: sandbox.stub(),
        hasRole: sandbox.stub().returns(true),
        getUsername: sandbox.stub().returns('username')
      };
    });

    $provide.value('PLAYER_PRO_PRODUCT_CODE','productCode');
    $provide.value('SHARED_SCHEDULE_URL','https://widgets.risevision.com/viewer/?type=sharedschedule&id=SCHEDULE_ID');
  }));
  
  var elm, $scope, $compile, $sce, playerProFactory, displayFactory, displayControlFactory, playerLicenseFactory,
    scheduleFactory, plansFactory, enableCompanyProduct,
    confirmModal, messageBox;
  var company;

  beforeEach(inject(function($rootScope, $injector, _$compile_, $templateCache) {
    company = {};

    $sce = $injector.get('$sce');
    playerProFactory = $injector.get('playerProFactory');
    displayFactory = $injector.get('displayFactory');
    displayControlFactory = $injector.get('displayControlFactory');
    playerLicenseFactory = $injector.get('playerLicenseFactory');
    scheduleFactory = $injector.get('scheduleFactory');
    plansFactory = $injector.get('plansFactory');
    enableCompanyProduct = $injector.get('enableCompanyProduct');

    confirmModal = $injector.get('confirmModal');
    messageBox = $injector.get('messageBox');

    $templateCache.put('partials/displays/display-fields.html', '<p>Fields</p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<display-fields></display-fields>';
    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });
    $scope.$digest();
  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p>Fields</p>');
    expect($scope.userState).to.be.ok;
    
    expect($scope.toggleProAuthorized).to.be.a('function');
    expect($scope.scheduleSelected).to.be.a('function');
    expect($scope.isChromeOs).to.be.a('function');
    expect($scope.getEmbedUrl).to.be.a('function');
    expect($scope.openTimePicker).to.be.a('function');
    expect($scope.configureDisplayControl).to.be.a('function');
    expect($scope.installationInstructionsModal).to.be.a('function');
  });

  
  describe('toggleProAuthorized', function () {
    it('should prompt to subscribe if no licenses are available', function () {
      displayFactory.display = {};
      playerLicenseFactory.isProAvailable.returns(false);

      $scope.toggleProAuthorized();
      expect(plansFactory.confirmAndPurchase).to.have.been.called;
      expect(enableCompanyProduct).to.not.have.been.called;
    });

    it('should toggle license locally', function () {
      playerLicenseFactory.isProAvailable.returns(true);

      displayFactory.display = {
        playerProAssigned: false,
        playerProAuthorized: true
      };
      company.playerProAvailableLicenseCount = 1;
      $scope.toggleProAuthorized();

      expect(enableCompanyProduct).to.have.not.been.called;

      expect(displayFactory.display.playerProAssigned).to.be.true;
      expect(displayFactory.display.playerProAuthorized).to.be.true;

      expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.not.have.been.called;
      expect(plansFactory.confirmAndPurchase).to.have.not.been.called;
    });

    it('should deactivate license locally', function () {
      playerLicenseFactory.isProAvailable.returns(true);

      displayFactory.display = {
        playerProAssigned: false,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 1;
      $scope.toggleProAuthorized();

      expect(enableCompanyProduct).to.have.not.been.called;

      expect(displayFactory.display.playerProAssigned).to.be.false;
      expect(displayFactory.display.playerProAuthorized).to.be.false;

      expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.not.have.been.called;
      expect(plansFactory.confirmAndPurchase).to.have.not.been.called;
    });

    it('should activate Pro status', function (done) {
      playerLicenseFactory.isProAvailable.returns(true);
      var enableResp = {item:{displays:{}}};
      enableResp.item.displays[displayId] = true;
      enableCompanyProduct.returns(Q.resolve(enableResp));

      // The mocked value of playerProAuthorized AFTER ng-change
      displayFactory.display = {
        id: displayId,
        playerProAssigned: false,
        playerProAuthorized: true
      };
      company.playerProAvailableLicenseCount = 1;
      $scope.toggleProAuthorized();

      setTimeout(function () {
        expect(enableCompanyProduct).to.have.been.called;

        expect(displayFactory.display.playerProAssigned).to.be.true;
        expect(displayFactory.display.playerProAuthorized).to.be.true;

        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(true);
        expect(plansFactory.confirmAndPurchase).to.have.not.been.called;
        done();        
      }, 0);
    });

    it('should deactivate Pro status', function (done) {
      playerLicenseFactory.isProAvailable.returns(true);
      var enableResp = {item:{displays:{}}};
      enableResp.item.displays[displayId] = false;
      enableCompanyProduct.returns(Q.resolve(enableResp));

      // The mocked value of playerProAuthorized AFTER ng-change
      displayFactory.display = {
        id: displayId,
        playerProAssigned: true,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 1;
      $scope.errorUpdatingRPP = 'Licensing error';

      $scope.toggleProAuthorized();

      setTimeout(function () {
        expect(enableCompanyProduct).to.have.been.called;

        expect($scope.errorUpdatingRPP).to.not.be.ok;

        expect(displayFactory.display.playerProAssigned).to.be.false;
        expect(displayFactory.display.playerProAuthorized).to.be.false;

        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(false);
        expect(plansFactory.confirmAndPurchase).to.have.not.been.called;
        done();
      }, 0);
    });

    it('should fail and not update count if display was assigned but not licensed', function (done) {
      playerLicenseFactory.isProAvailable.returns(true);
      var enableResp = {item:{displays:{}}};
      enableResp.item.displays[displayId] = false;
      enableCompanyProduct.returns(Q.resolve(enableResp));

      // The mocked value of playerProAuthorized AFTER ng-change
      displayFactory.display = {
        id: displayId,
        playerProAssigned: false,
        playerProAuthorized: true
      };
      company.playerProAvailableLicenseCount = 1;
      $scope.toggleProAuthorized();

      setTimeout(function () {
        expect(enableCompanyProduct).to.have.been.called;

        expect(displayFactory.display.playerProAssigned).to.be.false;
        expect(displayFactory.display.playerProAuthorized).to.be.false;

        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.not.have.been.called;
        expect(plansFactory.confirmAndPurchase).to.have.not.been.called;
        done();        
      }, 0);
    });

    it('should fail to activate Pro status on error', function (done) {
      playerLicenseFactory.isProAvailable.returns(true);
      enableCompanyProduct.returns(Q.reject('Licensing error'));

      // The mocked value of playerProAuthorized AFTER ng-change
      displayFactory.display = {
        id: displayId,
        playerProAssigned: true,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 1;
      $scope.toggleProAuthorized();

      setTimeout(function () {
        expect(enableCompanyProduct).to.have.been.called;

        expect($scope.errorUpdatingRPP).to.equal('processed Licensing error');
        expect(displayFactory.display.playerProAssigned).to.be.true;
        expect(displayFactory.display.playerProAuthorized).to.be.true;
        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.not.have.been.called;

        expect(plansFactory.confirmAndPurchase).to.have.not.been.called;
        done();
      }, 0);
    });
  });

  describe('risevision.company.updated: ', function() {
    it('should set Display as authorized if licenses become available', function() {
      displayFactory.display = {
        id: displayId,
        playerProAssigned: true,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 1;

      $scope.$emit('risevision.company.updated');
      
      $scope.$digest();

      expect(displayFactory.display.playerProAuthorized).to.be.true;
    });

    it('should not set an Unassigned Display as authorized', function() {
      displayFactory.display = {
        id: displayId,
        playerProAssigned: false,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 1;

      $scope.$emit('risevision.company.updated');
      
      $scope.$digest();

      expect(displayFactory.display.playerProAuthorized).to.be.false;
    });

    it('should not set a Display as authorized if no licenses are available', function() {
      displayFactory.display = {
        id: displayId,
        playerProAssigned: true,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 0;

      $scope.$emit('risevision.company.updated');
      
      $scope.$digest();

      expect(displayFactory.display.playerProAuthorized).to.be.false;
    });
  });

  describe('scheduleSelected:', function() {
    it('should prompt licensing if new schedule requires license and display is not licensed', function(done) {
      scheduleFactory.requiresLicense.returns(true);
      displayFactory.display = { playerProAuthorized: false};

      sandbox.stub($scope, 'toggleProAuthorized');

      $scope.scheduleSelected();

      confirmModal.should.have.been.calledWith(
        'Assign license?',
        'You\'ve selected a schedule that contains presentations. In order to show this schedule on this display, you need to license it. Assign license now?',
        'Yes', 'No', 'madero-style centered-modal',
        'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
      );

      setTimeout(function() {
        expect(displayFactory.display.playerProAuthorized).to.be.true;
        $scope.toggleProAuthorized.should.have.been.called;
        done();
      });
    });

    it('should not prompt if display is already licensed', function() {
      displayFactory.display = { playerProAuthorized: true};
      scheduleFactory.requiresLicense.returns(true);

      $scope.scheduleSelected();

      confirmModal.should.not.have.been.called;
    });

    it('should not prompt if schedule does not require a license', function() {
      displayFactory.display = { playerProAuthorized: false};

      $scope.scheduleSelected();

      confirmModal.should.not.have.been.called;
    });

  });

  describe('confirmLicensing:', function() {
    it('should prompt licensing current display and toggle license on confimation', function(done) {
      sandbox.stub($scope, 'toggleProAuthorized');

      $scope.confirmLicensing().then(function() {
        confirmModal.should.have.been.calledWith(
          'Assign license?',
          'Do you want to assign one of your licenses to this display?',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm');
        expect(displayFactory.display.playerProAuthorized).to.be.true;
        $scope.toggleProAuthorized.should.have.been.called;
        done();
      });
    });
  });

  it("isChromeOs: ", function() {
    expect($scope.isChromeOs({os: "cros/x86-64"})).to.be.true;
    expect($scope.isChromeOs({os: "64-bit Microsoft Windows Embedded Standard"})).to.be.false;
  });
  
  describe('getEmbedUrl:', function() {
    beforeEach(function() {
      sandbox.stub($sce, 'trustAsResourceUrl').returns('http://trustedUrl');
    });

    afterEach(function() {
      $sce.trustAsResourceUrl.restore();
    });

    it('should return a trusted embed URL', function() {     
      expect($scope.getEmbedUrl('ID')).to.equal('http://trustedUrl');
      $sce.trustAsResourceUrl.should.have.been.calledWith('https://widgets.risevision.com/viewer/?type=sharedschedule&id=ID&env=apps_display');
    });

    it('should return null, to not render iframe, when scheduleId is not provided', function() {
      expect($scope.getEmbedUrl(null)).to.equal(null);
      $sce.trustAsResourceUrl.should.not.have.been.called;
    });
  });

  it('openTimePicker:', function() {
    var e = {
      preventDefault: sandbox.stub(),
      stopPropagation: sandbox.stub()
    };

    $scope.openTimePicker(e, 'timePickerKey');

    e.preventDefault.should.have.been.called;
    e.stopPropagation.should.have.been.called;

    expect($scope.timePickerKey).to.be.true;

    $scope.openTimePicker(e, 'timePickerKey');

    expect($scope.timePickerKey).to.be.false;
  });

  describe('configureDisplayControl:', function() {
    it('should show error message if unsupported', function() {
      playerProFactory.isDisplayControlCompatiblePlayer.returns(false);

      $scope.configureDisplayControl();

      displayControlFactory.openDisplayControlModal.should.not.have.been.called;
      expect($scope.displayControlError).to.be.true;
    });

    it('should open configure modal', function() {
      $scope.configureDisplayControl();

      displayControlFactory.openDisplayControlModal.should.have.been.called;
      expect($scope.displayControlError).to.not.be.ok;
    });

  });

  it('installationInstructionsModal:', function() {
    $scope.installationInstructionsModal();

    messageBox.should.have.been.calledWith(null, null, null, 'madero-style centered-modal download-player-modal', 'partials/displays/download-player-modal.html', 'sm');
  });

});
