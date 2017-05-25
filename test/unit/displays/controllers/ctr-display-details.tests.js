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
        }
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
  var resolveLoadScreenshot, resolveRequestScreenshot;
  beforeEach(function(){
    updateCalled = false;
    deleteCalled = false;
    resolveRequestScreenshot = true;
    resolveLoadScreenshot = true;

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      $controller('displayDetails', {
        $scope : $scope,
        display:$injector.get('display'),
        displayFactory:$injector.get('displayFactory'),
        $modal:$injector.get('$modal'),
        $state : $state,
        $log : $injector.get('$log')});
      $scope.$digest();
    });
  });

  it('should exist',function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;

    expect($scope.save).to.be.a('function');
    expect($scope.confirmDelete).to.be.a('function');
  });

  it('should initialize', function(done) {
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
});
