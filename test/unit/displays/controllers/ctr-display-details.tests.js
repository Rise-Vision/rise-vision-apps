'use strict';
describe('controller: display details', function() {
  var displayId = 1234;

  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module('risevision.displays.filters'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory', function() {
      return {
        display: {},
        getDisplay: function(displayId) {
          this.display.id = displayId;

          return Q.resolve();
        },
        updateDisplay : function(){
          updateCalled = true;

          return Q.resolve();
        },
        deleteDisplay: function() {
          deleteCalled = true;
        },
        is3rdPartyPlayer: function(){ return false;},
        isOutdatedPlayer: function(){ return false;}
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
          _restoreState: function(){}
      };
    });
    
    $provide.service('display', function() {
      return {
        loadScreenshot: sinon.spy(function() {
          if (resolveLoadScreenshot) {
            return Q.resolve({});    
          } else {
            return Q.reject({});
          }
        }),
        requestScreenshot: sinon.spy(function() {
          if (resolveRequestScreenshot) {
            return Q.resolve({});    
          } else {
            return Q.reject({});
          }
        }),
        hasSchedule: function(display) {
          return display.scheduleId;
        }
      }
    });
    $provide.value('displayId', '1234');
  }));
  var $scope, $state, updateCalled, deleteCalled, confirmDelete;
  var resolveLoadScreenshot, resolveRequestScreenshot, $rootScope, $loading, displayFactory;
  beforeEach(function(){
    updateCalled = false;
    deleteCalled = false;
    resolveRequestScreenshot = true;
    resolveLoadScreenshot = true;

    inject(function($injector, $controller){
      displayFactory = $injector.get('displayFactory');
      $loading = $injector.get('$loading');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      $controller('displayDetails', {
        $scope : $scope,
        display:$injector.get('display'),
        displayFactory: displayFactory,
        $modal:$injector.get('$modal'),
        $state : $state,
        $log : $injector.get('$log')});
      $scope.$digest();
    });
  });

  it('should exist',function() {
    expect($scope).to.be.ok;
    expect($scope.displayId).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.companyId).to.be.ok;
    expect($scope.productCode).to.be.ok;
    expect($scope.productId).to.be.ok;
    expect($scope.productLink).to.be.ok;
    expect($scope.subscriptionStatus).to.be.ok;
    expect($scope.showTrialButton).to.be.false;
    expect($scope.showTrialStatus).to.be.false;
    expect($scope.showSubscribeButton).to.be.false;

    expect($scope.save).to.be.a('function');
    expect($scope.confirmDelete).to.be.a('function');
  });

  it('should initialize', function(done) {

    expect($scope.companyId).to.equal("company1");
    expect($scope.productCode).to.equal("c4b368be86245bf9501baaa6e0b00df9719869fd");
    expect($scope.productId).to.equal("2048");
    expect($scope.productLink).to.equal("https://store.risevision.com/product/2048/?cid=company1");

    expect($scope.showTrialButton).to.be.false;
    expect($scope.showTrialStatus).to.be.false;
    expect($scope.showSubscribeButton).to.be.false;

    setTimeout(function() {
      expect($scope.display).to.be.ok;
      expect($scope.display.id).to.equal('1234');

      done();
    }, 10);
  });

  describe('submit: ',function() {
    it('should return early if the form is invalid',function(){
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

  describe('requestScreenshot', function() {
    it('should request a screenshot successfully', function(done) {
      $scope.requestScreenshot().then(function() {
        expect($scope.displayService.requestScreenshot).to.be.called;
        expect($scope.displayService.loadScreenshot).to.be.calledTwice;
        expect($scope.screenshot.error).to.be.undefined;
        done();
      });
    });

    it('should fail to request a screenshot', function(done) {
      resolveRequestScreenshot = false;

      $scope.requestScreenshot().then(function() {
        expect($scope.displayService.requestScreenshot).to.be.calledOnce;
        expect($scope.displayService.loadScreenshot).to.be.calledOnce;
        expect($scope.screenshot.error).to.equal('requesting');
        done();
      });
    });
  });

  describe('loadScreenshot', function() {
    it('should load a screenshot successfully', function(done) {
      $scope.loadScreenshot().then(function() {
        expect($scope.displayService.loadScreenshot).to.be.calledTwice;
        expect($scope.screenshot.error).to.be.undefined;
        done();
      });
    });

    it('should fail to request a screenshot', function(done) {
      resolveLoadScreenshot = false;

      $scope.loadScreenshot().then(function() {
        expect($scope.displayService.loadScreenshot).to.be.calledTwice;
        expect($scope.screenshot.error).to.equal('loading');
        done();
      });
    });
  });

  describe('screenshotState', function() {
    it('should return the correct state', function() {
      expect($scope.screenshotState()).to.equal('loading');
      $scope.displayService.statusLoading = true;
      expect($scope.screenshotState({ onlineStatus: 'online', scheduleId: 1 })).to.equal('loading');
      $scope.displayService.statusLoading = false;

      expect($scope.screenshotState({})).to.equal('not-installed');
      expect($scope.screenshotState({ playerVersion: 1, os: 'cros-x64' })).to.equal('os-not-supported');
      expect($scope.screenshotState({ playerVersion: 1, os: 'Microsoft' })).to.equal('upgrade-player');
      expect($scope.screenshotState({ playerVersion: 1, playerName: 'test' })).to.equal('upgrade-player');
      expect($scope.screenshotState({ playerVersion: '2016', playerName: 'RisePlayerElectron' })).to.equal('upgrade-player');
      expect($scope.screenshotState({ playerVersion: '2018', playerErrorCode: 0, playerName: 'RisePlayerElectron' })).to.equal('no-schedule');
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1
      })).to.equal('offline');

      $scope.screenshot = { status: 200, lastModified: new Date().toISOString() };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('screenshot-loaded');

      $scope.screenshot = { status: 404 };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('no-screenshot-available');
      
      $scope.screenshot = { status: 403 };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('no-screenshot-available');

      $scope.screenshot = { error: 'error' };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('screenshot-error');

      $scope.screenshot = null;
    });
  });

  describe('reloadScreenshotDisabled', function() {
    it('should return the correct state', function() {
      expect($scope.reloadScreenshotDisabled()).to.be.true;
      expect($scope.reloadScreenshotDisabled({})).to.be.true;
      expect($scope.reloadScreenshotDisabled({ os: 'cros-x64' })).to.be.true;

      $scope.screenshot = { status: 404 };
      expect($scope.reloadScreenshotDisabled({ onlineStatus: 'online', scheduleId: 1 })).to.be.falsey;

      $scope.screenshot = { status: 200, lastModified: '' };
      expect($scope.reloadScreenshotDisabled({ onlineStatus: 'online', scheduleId: 1 })).to.be.truely;
    });
  });

  it('should show spinner on refreshSubscriptionStatus',function(){
    var spy = sinon.spy($loading,'start')
    $rootScope.$emit('refreshSubscriptionStatus');
    spy.should.have.been.calledWith('loading-trial');
  });

  describe('subscription-status:changed:',function(){
    it('should hide spinner and set false to flags when on default state ',function(){
      var spy = sinon.spy($loading,'stop')
      
      $rootScope.$emit('subscription-status:changed');
      
      spy.should.have.been.calledWith('loading-trial');
      expect($scope.showTrialButton).to.be.false;
      expect($scope.showTrialStatus).to.be.false;
      expect($scope.showSubscribeButton).to.be.false;
    });

    it('should hide flags for 3rd part players',function(){
      $scope.display = {playerName:'Cenique', playerVersion: '2017.07.04.14.40'}
      var spy = sinon.stub(displayFactory,'is3rdPartyPlayer',function() {return true});
      
      $rootScope.$emit('subscription-status:changed',{});
      
      expect($scope.showTrialButton).to.be.false;
      expect($scope.showTrialStatus).to.be.false;
      expect($scope.showSubscribeButton).to.be.false;
    });

    it('should hide flags for outdated players',function(){
      $scope.display = {playerName:'RiseVisionElectron', playerVersion: '2017.01.04.14.40'}
      var spy = sinon.stub(displayFactory,'isOutdatedPlayer',function() {return true});
      
      $rootScope.$emit('subscription-status:changed',{});
      
      expect($scope.showTrialButton).to.be.false;
      expect($scope.showTrialStatus).to.be.false;
      expect($scope.showSubscribeButton).to.be.false;
    });

    it('should set correct flags when trial-available',function(){
      $scope.display = {playerName:'RiseVisionElectron', playerVersion: '2017.07.04.14.40'}      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'trial-available'});
      
      expect($scope.showTrialButton).to.be.true;
      expect($scope.showTrialStatus).to.be.false;
      expect($scope.showSubscribeButton).to.be.false;
    });

    it('should set correct flags when on-trial or suspended',function(){
      $scope.display = {playerName:'RiseVisionElectron', playerVersion: '2017.07.04.14.40'}      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'on-trial'});
      
      expect($scope.showTrialButton).to.be.false;
      expect($scope.showTrialStatus).to.be.true;
      expect($scope.showSubscribeButton).to.be.true;

      $rootScope.$emit('subscription-status:changed',{statusCode: 'suspended'});
      
      expect($scope.showTrialButton).to.be.false;
      expect($scope.showTrialStatus).to.be.true;
      expect($scope.showSubscribeButton).to.be.true;
    });

    it('should set correct flags when trial-expired, cancelled or not-subscribed',function(){
      $scope.display = {playerName:'RiseVisionElectron', playerVersion: '2017.07.04.14.40'}      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'trial-expired'});
      
      expect($scope.showTrialButton).to.be.false;
      expect($scope.showTrialStatus).to.be.false;
      expect($scope.showSubscribeButton).to.be.true;

      $rootScope.$emit('subscription-status:changed',{statusCode: 'cancelled'});
      
      expect($scope.showTrialButton).to.be.false;
      expect($scope.showTrialStatus).to.be.false;
      expect($scope.showSubscribeButton).to.be.true;

      $rootScope.$emit('subscription-status:changed',{statusCode: 'not-subscribed'});
      
      expect($scope.showTrialButton).to.be.false;
      expect($scope.showTrialStatus).to.be.false;
      expect($scope.showSubscribeButton).to.be.true;
    });
  });

  it('should remove listeners on $destroy',function(){
    expect($rootScope.$$listeners['refreshSubscriptionStatus']).to.be.ok;
    expect($rootScope.$$listeners['subscription-status:changed']).to.be.ok;

    $rootScope.$destroy();

    expect($rootScope.$$listeners['refreshSubscriptionStatus']).to.not.be.ok;
    expect($rootScope.$$listeners['subscription-status:changed']).to.not.be.ok;
  })
});
