'use strict';
describe('controller: display details', function() {
  var displayId = '1234';
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.displays.services'));
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('displayFactory', function() {
      return {
        display: {},
        getDisplay: function(displayId) {
          this.display.id = displayId;
          this.display.companyId = 'company';

          return Q.resolve({});
        },
        updateDisplay : function(){
          updateCalled = true;

          return Q.resolve();
        },
        deleteDisplay: function() {
          deleteCalled = true;
        }
      };
    });
    $provide.service('playerProFactory', function() {
      return {        
        is3rdPartyPlayer: function(){ return false;},
        isUnsupportedPlayer: function(){ return false;},
        isOfflinePlayCompatiblePayer: function(){ return true;},
        isOutdatedPlayer: function(){ return false;},
        isElectronPlayer: function(){ return true;}
      };
    });
    $provide.service('$state',function(){
      return {
        _state : '',
        go : function(state, params){
          if (state){
            this._state = state;
          }
          return this._state;
        }
      };
    });
    $provide.service('$modal',function(){
      return {
        open : function(obj){
          expect(obj).to.be.truely;
          var deferred = Q.defer();
          if(confirmDelete){
            deferred.resolve();
          }else{
            deferred.reject();
          }

          return {
            result: deferred.promise
          };
        }
      };
    });
    $provide.service('$loading',function(){
      return {
        start: function(){},
        stop: function(){}
      };
    });
    $provide.service('storeAuthorization',function(){
      return {
      };
    });
    $provide.service('userState',function(){
      return {
          getSelectedCompanyId: function() {return "company1"},
          getCopyOfSelectedCompany: function() {return {};},
          _restoreState: function(){},
          updateCompanySettings: sandbox.stub()
      };
    });
    
    $provide.service('display', function() {
      return {
        hasSchedule: function(display) {
          return display.scheduleId;
        },
        getCompanyProStatus: function() {
          return Q.resolve({status: 'Subscribed', statusCode: 'subscribed'});
        }
      }
    });
    $provide.service('screenshotFactory', function() {
      return {
        loadScreenshot: sandbox.stub()
      }
    });
    $provide.factory('plansFactory', function() {
      return {
        showPlansModal: function () {}
      };
    });
    $provide.factory('currentPlanFactory', function() {
      return {};
    });
    $provide.factory('playerLicenseFactory', function() {
      return {
        toggleDisplayLicenseLocal: function () {},
        getProLicenseCount: function () {},
        areAllProLicensesUsed: function () {},
        hasProfessionalLicenses: function () {}
      };
    });
    $provide.factory('enableCompanyProduct', function() {
      return sandbox.stub();
    });
    $provide.value('displayId', displayId);
  }));
  var $scope, $state, updateCalled, deleteCalled, confirmDelete;
  var resolveLoadScreenshot, resolveRequestScreenshot, enableCompanyProduct, userState,
  $rootScope, $loading, displayFactory, playerLicenseFactory, playerProFactory;
  beforeEach(function(){
    updateCalled = false;
    deleteCalled = false;
    resolveRequestScreenshot = true;
    resolveLoadScreenshot = true;

    inject(function($injector, $controller){
      displayFactory = $injector.get('displayFactory');
      playerLicenseFactory = $injector.get('playerLicenseFactory');
      playerProFactory = $injector.get('playerProFactory');
      enableCompanyProduct = $injector.get('enableCompanyProduct');
      userState = $injector.get('userState');
      $loading = $injector.get('$loading');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      $controller('displayDetails', {
        $scope : $scope,
        display:$injector.get('display'),
        displayFactory: displayFactory,
        playerProFactory: playerProFactory,
        $modal:$injector.get('$modal'),
        $state : $state,
        $log : $injector.get('$log')});
      $scope.$digest();
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist',function() {
    expect($scope).to.be.ok;
    expect($scope.displayId).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.companyId).to.be.ok;

    expect($scope.save).to.be.a('function');
    expect($scope.confirmDelete).to.be.a('function');
  });

  it('should initialize', function(done) {

    expect($scope.companyId).to.equal("company1");

    setTimeout(function() {
      expect($scope.display).to.be.ok;
      expect($scope.display.id).to.equal('1234');

      done();
    }, 10);
  });

  describe('submit: ',function() {
    it('should return early if the form is invalid',function(){
      $scope.display = {};
      $scope.displayDetails = {};
      $scope.displayDetails.$valid = false;
      $scope.save();

      expect(updateCalled).to.be.false;
    });

    it('should save the display',function(){
      $scope.displayDetails = {};
      $scope.displayDetails.$valid = true;
      $scope.display = {id:123};
      $scope.save();

      expect(updateCalled).to.be.true;
    });
  });

  describe('delete: ',function() {
    beforeEach(function() {
      confirmDelete = false;
    });

    it('should return early the user does not confirm',function(){
      $scope.confirmDelete();

      expect(deleteCalled).to.be.false;
    });

    it('should delete the display',function(done){
      confirmDelete = true;
      $scope.display = {id:123};

      $scope.confirmDelete();

      setTimeout(function() {
        expect(deleteCalled).to.be.true;

        done();
      }, 10);
    });

  });

  describe('browserUpgradeMode:',function(){
    it('should watch display.browserUpgradeMode',function(){
      expect($scope.$$watchers[0].exp).to.equal('display.browserUpgradeMode');
    });

    it('should change to User Managed (1) any value different than Auto Upgrade (0)',function(){
      $scope.display = {id:123, browserUpgradeMode: 2};
      $scope.$digest();
      expect($scope.display.browserUpgradeMode).to.equal(1);
      $scope.display = {id:123, browserUpgradeMode: 1};
      $scope.$digest();
      expect($scope.display.browserUpgradeMode).to.equal(1);
    });

    it('should not change Auto Upgrade (0)',function(){
      $scope.display = {id:123, browserUpgradeMode: 0};
      $scope.$digest();
      expect($scope.display.browserUpgradeMode).to.equal(0);
    });
  });

  describe('toggleProAuthorized', function () {
    it('should show the plans modal', function () {
      $scope.display = {};
      sandbox.stub($scope, 'isProAvailable').returns(false);
      sandbox.stub($scope, 'showPlansModal');

      $scope.toggleProAuthorized();
      expect($scope.showPlansModal).to.have.been.called;
      expect(enableCompanyProduct).to.not.have.been.called;
    });

    it('should activate Pro status', function (done) {
      sandbox.stub($scope, 'isProAvailable').returns(true);
      sandbox.stub($scope, 'showPlansModal');
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');
      enableCompanyProduct.returns(Q.resolve());

      // Needed because display object gets overwritten at controller initialization
      setTimeout(function () {
        // The mocked value of playerProAuthorized AFTER ng-change
        $scope.display = { id: displayId, playerProAuthorized: true };
        $scope.company = { playerProAssignedDisplays: [] };
        $scope.toggleProAuthorized();

        setTimeout(function () {
          expect(enableCompanyProduct).to.have.been.called;
          expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.called;
          expect($scope.showPlansModal).to.have.not.been.called;
          done();        
        }, 0);
      }, 0);
    });

    it('should deactivate Pro status', function (done) {
      sandbox.stub($scope, 'isProAvailable').returns(true);
      sandbox.stub($scope, 'showPlansModal');
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');
      enableCompanyProduct.returns(Q.resolve());

      setTimeout(function () {
        $scope.company = { playerProAssignedDisplays: [displayId] };
        // The mocked value of playerProAuthorized AFTER ng-change
        $scope.display = { id: displayId, playerProAuthorized: false };
        $scope.toggleProAuthorized();

        setTimeout(function () {
          expect(enableCompanyProduct).to.have.been.called;
          expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.called;
          expect($scope.showPlansModal).to.have.not.been.called;
          done();
        }, 0);
      }, 0);
    });

    it('should fail to activate Pro status', function (done) {
      sandbox.stub($scope, 'isProAvailable').returns(true);
      sandbox.stub($scope, 'showPlansModal');
      enableCompanyProduct.returns(Q.reject());

      setTimeout(function () {
        $scope.company = { playerProAssignedDisplays: [] };
        // The mocked value of playerProAuthorized AFTER ng-change
        $scope.display = { id: displayId, playerProAuthorized: false };
        $scope.toggleProAuthorized();

        setTimeout(function () {
          expect(enableCompanyProduct).to.have.been.called;
          expect(userState.updateCompanySettings).to.not.have.been.called;
          expect($scope.showPlansModal).to.have.not.been.called;
          expect($scope.company.playerProAssignedDisplays).to.be.empty;
          done();
        }, 0);
      });
    });
  });

  describe('areAllProLicensesUsed:', function() {
    it('should return all licenses are used if display is not on the list', function () {
      $scope.company.playerProAssignedDisplays = ['badDisplay'];
      sandbox.stub(playerLicenseFactory, 'getProLicenseCount').returns(1);
      sandbox.stub(playerLicenseFactory, 'areAllProLicensesUsed').returns(true);

      expect($scope.areAllProLicensesUsed()).to.be.true;
    });

    it('should return all licenses are used if display is on the list', function () {
      $scope.company.playerProAssignedDisplays = ['display1'];
      $scope.displayId = 'display1';
      sandbox.stub(playerLicenseFactory, 'getProLicenseCount').returns(1);
      sandbox.stub(playerLicenseFactory, 'areAllProLicensesUsed').returns(false);

      expect($scope.areAllProLicensesUsed()).to.be.false;
    });
  });

  describe('isProAvailable:', function() {
    it('should return false if available licenses are zero (Free Plan)', function () {
      sandbox.stub(playerLicenseFactory, 'hasProfessionalLicenses').returns(false);
      sandbox.stub($scope, 'getProLicenseCount').returns(0);

      expect($scope.isProAvailable()).to.be.false;
    });

    it('should return false if all available licenses are used', function () {
      sandbox.stub(playerLicenseFactory, 'hasProfessionalLicenses').returns(true);
      sandbox.stub($scope, 'getProLicenseCount').returns(1);
      sandbox.stub($scope, 'areAllProLicensesUsed').returns(true);

      expect($scope.isProAvailable()).to.be.false;
    });

    it('should return true if there are available licenses', function () {
      sandbox.stub(playerLicenseFactory, 'hasProfessionalLicenses').returns(true);
      sandbox.stub($scope, 'getProLicenseCount').returns(1);
      sandbox.stub($scope, 'areAllProLicensesUsed').returns(false);

      expect($scope.isProAvailable()).to.be.true;
    });
  });

  describe('isProToggleEnabled:', function() {
    beforeEach(function() {
      $scope.display = { playerProAuthorized: false };
    });

    it('should return false if it is a third party player', function () {
      sandbox.stub(playerProFactory, 'is3rdPartyPlayer').returns(true);

      expect($scope.isProToggleEnabled()).to.be.false;
    });

    it('should return false if it is an unsupported player', function () {
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(true);

      expect($scope.isProToggleEnabled()).to.be.false;
    });

    it('should return true if it is a supported player', function () {
      sandbox.stub(playerProFactory, 'is3rdPartyPlayer').returns(false);
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(false);

      expect($scope.isProToggleEnabled()).to.be.true;
    });

    it('should return true if playerProAuthorized = true', function () {
      $scope.display = { playerProAuthorized: true };
      sandbox.stub(playerProFactory, 'is3rdPartyPlayer').returns(true);
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(true);

      expect($scope.isProToggleEnabled()).to.be.true;
    });
  });

  describe('isValidEmail:', function() {
    it('should return true if it is a valid email', function () {
      expect($scope.isValidEmail()).to.be.false;
      expect($scope.isValidEmail({})).to.be.false;
      expect($scope.isValidEmail({ text: '' })).to.be.false;
      expect($scope.isValidEmail({ text: 'aaaa' })).to.be.false;
      expect($scope.isValidEmail({ text: 'aaaa@' })).to.be.false;
      expect($scope.isValidEmail({ text: 'aaaa@a' })).to.be.true;
      expect($scope.isValidEmail({ text: 'aaaa@a.com' })).to.be.true;
    });
  });
});
