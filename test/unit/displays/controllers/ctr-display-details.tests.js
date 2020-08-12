'use strict';

describe('controller: display details', function() {
  var displayId = '1234';
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.displays.services'));
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module(mockTranslate()));
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
    $provide.service('scheduleFactory', function() {
      return {
        addToDistribution: sandbox.stub()
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
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.service('userState',function(){
      return {
          getSelectedCompanyId: function() {return "company1"},
          getCopyOfSelectedCompany: function() {return company;},
          _restoreState: function(){},
          updateCompanySettings: sandbox.stub(),
          hasRole: sandbox.stub().returns(true)
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
    $provide.service('$state', function() {
      return {
        go: sandbox.stub()
      }
    });
    $provide.service('screenshotFactory', function() {
      return {
        loadScreenshot: sandbox.stub()
      }
    });
    $provide.factory('plansFactory', function() {
      return {
        showPlansModal: sinon.spy()
      };
    });
    $provide.factory('currentPlanFactory', function() {
      return {
        currentPlan: {
          isPurchasedByParent: false
        }
      };
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
    $provide.factory('processErrorCode', function() {
      return function(item, type, error) {
        return 'processed ' + error;
      };
    });
    $provide.value('displayId', displayId);
  }));
  var $scope, $state, updateCalled, deleteCalled, confirmDelete;
  var resolveLoadScreenshot, resolveRequestScreenshot, enableCompanyProduct, userState,
  $rootScope, $loading, displayFactory, playerLicenseFactory, playerProFactory, plansFactory, currentPlanFactory,
  scheduleFactory;
  var company;
  beforeEach(function(){
    company = {};
    updateCalled = false;
    deleteCalled = false;
    resolveRequestScreenshot = true;
    resolveLoadScreenshot = true;

    inject(function($injector, $controller){
      displayFactory = $injector.get('displayFactory');
      playerLicenseFactory = $injector.get('playerLicenseFactory');
      playerProFactory = $injector.get('playerProFactory');
      plansFactory = $injector.get('plansFactory');
      currentPlanFactory = $injector.get('currentPlanFactory');
      scheduleFactory = $injector.get('scheduleFactory');
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
    expect($scope.scheduleFactory).to.be.ok;

    expect($scope.save).to.be.a('function');
    expect($scope.confirmDelete).to.be.a('function');
  });

  it('should initialize', function(done) {

    setTimeout(function() {
      expect($scope.display).to.be.ok;
      expect($scope.display.id).to.equal('1234');
      expect($scope.selectedSchedule).to.be.null;

      done();
    }, 10);
  });

  it('should initialize a display with assigned schedule', function(done) {
    displayFactory.display.scheduleId = 'scheduleId';
    displayFactory.display.scheduleName = 'scheduleName';

    setTimeout(function() {
      expect($scope.display).to.be.ok;
      expect($scope.display.id).to.equal('1234');
      expect($scope.selectedSchedule).to.deep.equal({
        id: 'scheduleId',
        name: 'scheduleName',
        companyId: 'company'
      });

      done();
    }, 10);
  });

  describe('submit: ',function() {
    it('should return early if the form is invalid',function(){
      $scope.display = {};
      $scope.displayDetails = {
        useCompanyAddress: {}
      };
      $scope.displayDetails.$valid = false;
      $scope.save();

      expect(updateCalled).to.be.false;
    });

    it('should save the display',function(){
      $scope.displayDetails = {
        useCompanyAddress: {}
      };
      $scope.displayDetails.$valid = true;
      $scope.display = {id:123};
      $scope.save();

      expect(updateCalled).to.be.true;
    });

    it('should change/update schedule on save success',function(done){
      $scope.selectedSchedule = {id: 'selectedSchedule'};
      $scope.displayDetails = {
        useCompanyAddress: {}
      };
      $scope.displayDetails.$valid = true;
      $scope.display = {id:123};
      $scope.save()

      setTimeout(function() {
        expect(updateCalled).to.be.true;

        scheduleFactory.addToDistribution.should.have.been.calledWith($scope.display, $scope.selectedSchedule);

        done();
      },10);
    });

    it('should report schedule update errors',function(done){
      scheduleFactory.apiError = 'apiError';
      scheduleFactory.errorMessage = 'errorMessage';
      scheduleFactory.addToDistribution.returns(Q.reject());
      $scope.selectedSchedule = {id: 'selectedSchedule'};
      $scope.displayDetails = {
        useCompanyAddress: {}
      };
      $scope.displayDetails.$valid = true;
      $scope.display = {id:123};
      $scope.save()

      setTimeout(function() {
        expect(updateCalled).to.be.true;

        scheduleFactory.addToDistribution.should.have.been.calledWith($scope.display, $scope.selectedSchedule);

        expect(displayFactory.apiError).to.equal('apiError');
        expect(displayFactory.errorMessage).to.equal('errorMessage');

        done();
      },10);
    });

    it('should flag unchanged address to skip validation',function(){
      sandbox.spy(displayFactory, "updateDisplay");

      $scope.displayDetails = {
        useCompanyAddress: {}
      };
      $scope.displayDetails.$valid = true;
      $scope.display = {id:123};
      $scope.save();

      expect(updateCalled).to.be.true;

      displayFactory.updateDisplay.should.have.been.calledWith(true);
    })

    it('should flag changed address to run validation', function() {
      sandbox.spy(displayFactory, "updateDisplay");

      $scope.displayDetails = {
        useCompanyAddress: {},
        city: { $dirty: true }
      };
      $scope.displayDetails.$valid = true;
      $scope.display = {id:123};
      $scope.save();

      displayFactory.updateDisplay.should.have.been.calledWith(false);
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

  describe('toggleProAuthorized', function () {
    it('should show the plans modal', function () {
      $scope.display = {};
      sandbox.stub($scope, 'isProAvailable').returns(false);

      $scope.toggleProAuthorized();
      expect(plansFactory.showPlansModal).to.have.been.called;
      expect(enableCompanyProduct).to.not.have.been.called;
    });

    it('should forward to billing if has a plan but no available licenses', function () {
      $scope.display = {};
      sandbox.stub($scope, 'isProAvailable').returns(false);
      sandbox.stub($scope, 'getProLicenseCount').returns(1);
      sandbox.stub($scope, 'areAllProLicensesUsed').returns(true);

      $scope.toggleProAuthorized();      
      expect($state.go).to.have.been.calledWith('apps.billing.home');
      expect(plansFactory.showPlansModal).to.not.have.been.called;
      expect(enableCompanyProduct).to.not.have.been.called;
    });

    it('should activate Pro status', function (done) {
      sandbox.stub($scope, 'isProAvailable').returns(true);
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');
      enableCompanyProduct.returns(Q.resolve());

      // Needed because display object gets overwritten at controller initialization
      setTimeout(function () {
        // The mocked value of playerProAuthorized AFTER ng-change
        $scope.display = {
          id: displayId,
          playerProAssigned: false,
          playerProAuthorized: false
        };
        company.playerProAvailableLicenseCount = 1;
        $scope.toggleProAuthorized();

        setTimeout(function () {
          expect(enableCompanyProduct).to.have.been.called;

          expect($scope.display.playerProAssigned).to.be.true;
          expect($scope.display.playerProAuthorized).to.be.true;

          expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(true);
          expect(plansFactory.showPlansModal).to.have.not.been.called;
          done();        
        }, 0);
      }, 0);
    });

    it('should not activate Pro status if licenses are not available', function (done) {
      sandbox.stub($scope, 'isProAvailable').returns(true);
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');
      enableCompanyProduct.returns(Q.resolve());

      // Needed because display object gets overwritten at controller initialization
      setTimeout(function () {
        // The mocked value of playerProAuthorized AFTER ng-change
        $scope.display = {
          id: displayId,
          playerProAssigned: false,
          playerProAuthorized: false
        };
        company.playerProAvailableLicenseCount = 0;
        $scope.toggleProAuthorized();

        setTimeout(function () {
          expect(enableCompanyProduct).to.have.been.called;

          expect($scope.display.playerProAssigned).to.be.true;
          expect($scope.display.playerProAuthorized).to.be.false;

          expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(true);
          expect(plansFactory.showPlansModal).to.have.not.been.called;
          done();        
        }, 0);
      }, 0);
    });

    it('should deactivate Pro status', function (done) {
      sandbox.stub($scope, 'isProAvailable').returns(true);
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');
      enableCompanyProduct.returns(Q.resolve());

      setTimeout(function () {
        // The mocked value of playerProAuthorized AFTER ng-change
        $scope.display = {
          id: displayId,
          playerProAssigned: true,
          playerProAuthorized: true
        };
        company.playerProAvailableLicenseCount = 1;
        $scope.errorUpdatingRPP = 'Licensing error';

        $scope.toggleProAuthorized();

        setTimeout(function () {
          expect(enableCompanyProduct).to.have.been.called;

          expect($scope.errorUpdatingRPP).to.not.be.ok;

          expect($scope.display.playerProAssigned).to.be.false;
          expect($scope.display.playerProAuthorized).to.be.false;

          expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(false);
          expect(plansFactory.showPlansModal).to.have.not.been.called;
          done();
        }, 0);
      }, 0);
    });

    it('should fail to activate Pro status', function (done) {
      sandbox.stub($scope, 'isProAvailable').returns(true);
      enableCompanyProduct.returns(Q.reject('Licensing error'));

      setTimeout(function () {
        // The mocked value of playerProAuthorized AFTER ng-change
        $scope.display = {
          id: displayId,
          playerProAssigned: true,
          playerProAuthorized: true
        };
        company.playerProAvailableLicenseCount = 1;
        $scope.toggleProAuthorized();

        setTimeout(function () {
          expect(enableCompanyProduct).to.have.been.called;

          expect($scope.errorUpdatingRPP).to.equal('processed Licensing error');
          expect($scope.display.playerProAssigned).to.be.true;
          expect($scope.display.playerProAuthorized).to.be.true;

          expect(userState.updateCompanySettings).to.not.have.been.called;
          expect(plansFactory.showPlansModal).to.have.not.been.called;
          done();
        }, 0);
      });
    });
  });

  describe('areAllProLicensesUsed:', function() {

    it('should return false if no licenses are available', function () {
      $scope.display = {
        playerProAssigned: false
      };
      sandbox.stub(playerLicenseFactory, 'getProLicenseCount').returns(0);
      sandbox.stub(playerLicenseFactory, 'areAllProLicensesUsed').returns(true);

      expect($scope.areAllProLicensesUsed()).to.be.false;
    });

    it('should return false if not all licenses are used', function () {
      $scope.display = {
        playerProAssigned: false
      };
      sandbox.stub(playerLicenseFactory, 'getProLicenseCount').returns(1);
      sandbox.stub(playerLicenseFactory, 'areAllProLicensesUsed').returns(false);

      expect($scope.areAllProLicensesUsed()).to.be.false;
    });

    it('should handle null display', function () {
      $scope.display = null;
      sandbox.stub(playerLicenseFactory, 'getProLicenseCount').returns(1);
      sandbox.stub(playerLicenseFactory, 'areAllProLicensesUsed').returns(false);

      expect($scope.areAllProLicensesUsed()).to.be.false;
    });

    it('should return true if display is not playerProAssigned', function () {
      $scope.display = {
        playerProAssigned: false
      };
      sandbox.stub(playerLicenseFactory, 'getProLicenseCount').returns(1);
      sandbox.stub(playerLicenseFactory, 'areAllProLicensesUsed').returns(true);

      expect($scope.areAllProLicensesUsed()).to.be.true;
    });

    it('should return false if display is playerProAssigned', function () {
      $scope.display = {
        playerProAssigned: true
      };
      sandbox.stub(playerLicenseFactory, 'getProLicenseCount').returns(1);
      sandbox.stub(playerLicenseFactory, 'areAllProLicensesUsed').returns(true);

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

    it('should return true if it is an unsupported player (the restriction was removed)', function () {
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(true);

      expect($scope.isProToggleEnabled()).to.be.true;
    });

    it('should return true if playerProAuthorized = true', function () {
      $scope.display = { playerProAuthorized: true };
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(true);

      expect($scope.isProToggleEnabled()).to.be.true;
    });

    it('should return true if it is a supported player', function () {
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(false);

      expect($scope.isProToggleEnabled()).to.be.true;
    });

    it('should return true if not all licenses are used', function () {
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(false);
      sandbox.stub($scope, 'areAllProLicensesUsed').returns(false);

      expect($scope.isProToggleEnabled()).to.be.true;
    });

    it('should return true if not all licenses are used, even if plan is purchased by parent', function () {
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(false);
      sandbox.stub($scope, 'areAllProLicensesUsed').returns(false);

      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      expect($scope.isProToggleEnabled()).to.be.true;
    });

    it('should return true if all licenses are used but plan is not purchased by parent', function () {
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(false);
      sandbox.stub($scope, 'areAllProLicensesUsed').returns(true);

      expect($scope.isProToggleEnabled()).to.be.true;
    });

    it('should return false if all licenses are used but plan is purchased by parent', function () {
      sandbox.stub(playerProFactory, 'isUnsupportedPlayer').returns(false);
      sandbox.stub($scope, 'areAllProLicensesUsed').returns(true);

      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      expect($scope.isProToggleEnabled()).to.be.false;
    });

    it('should return false if user is not display administrator', function () {
      userState.hasRole.returns(false);

      expect($scope.isProToggleEnabled()).to.be.false;
    });

  });

  describe('risevision.company.updated: ', function() {
    it('should set Display as authorized if licenses become available', function() {
      $scope.display = {
        id: displayId,
        playerProAssigned: true,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 1;

      $rootScope.$emit('risevision.company.updated');
      
      $scope.$digest();

      expect($scope.display.playerProAuthorized).to.be.true;
    });

    it('should not set an Unassigned Display as authorized', function() {
      $scope.display = {
        id: displayId,
        playerProAssigned: false,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 1;

      $rootScope.$emit('risevision.company.updated');
      
      $scope.$digest();

      expect($scope.display.playerProAuthorized).to.be.false;
    });

    it('should not set a Display as authorized if no licenses are available', function() {
      $scope.display = {
        id: displayId,
        playerProAssigned: true,
        playerProAuthorized: false
      };
      company.playerProAvailableLicenseCount = 0;

      $rootScope.$emit('risevision.company.updated');
      
      $scope.$digest();

      expect($scope.display.playerProAuthorized).to.be.false;
    });
  });

  describe("scheduleFactory.savingSchedule:", function() {
    it('should show spinner when saving schedule', function() {
      $loading.start.should.have.not.been.called;
      scheduleFactory.savingSchedule = true;
      $scope.$digest();
      $loading.start.should.have.been.calledWith('display-loader');
    });

    it('should hide spinner when finished saving schedule', function() {
      $loading.stop.reset();
      scheduleFactory.savingSchedule = false;
      $scope.$digest();
      $loading.stop.should.have.been.calledWith('display-loader');
    });
  });

});
