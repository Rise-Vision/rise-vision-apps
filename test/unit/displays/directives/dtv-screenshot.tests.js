'use strict';
describe('directive: screenshot', function() {
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module('risevision.displays.filters'));

  beforeEach(module(function ($provide) {
    $provide.service('display', function() {
      return {
        hasSchedule: function(display) {
          return display.scheduleId;
        },
        statusLoading: false
      };
    });
    $provide.service('screenshotFactory', function() {
      return {
        screenshotLoading: false
      };
    });
  }));
  
  var elm, $scope, $compile, screenshotFactory, display;

  beforeEach(inject(function($rootScope, $injector, _$compile_, $templateCache) {
    display = $injector.get('display');
    screenshotFactory = $injector.get('screenshotFactory');

    $templateCache.put('partials/displays/screenshot.html', '<p>Screenshot</p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<screenshot></screenshot>';
    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });
    $scope.$digest();
  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p>Screenshot</p>');
    expect($scope.screenshotFactory).to.be.ok;
    expect($scope.screenshotState).to.be.a('function');
    expect($scope.reloadScreenshotDisabled).to.be.a('function');
  });

  describe('screenshotState: ', function() {
    describe('loading: ', function() {
      it('no display', function() {
        expect($scope.screenshotState()).to.equal('loading');        
      });

      it('status loading', function() {
        display.statusLoading = true;

        expect($scope.screenshotState({})).to.equal('loading');        
      });

      it('screenshot loading', function() {
        screenshotFactory.screenshotLoading = true;

        expect($scope.screenshotState({})).to.equal('loading');        
      });
      
      it('should show next status', function() {
        expect($scope.screenshotState({})).to.equal('not-installed');        
      });
    });
    
    it('misc', function() {
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

      screenshotFactory.screenshot = { status: 200, lastModified: new Date().toISOString() };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('screenshot-loaded');

      screenshotFactory.screenshot = { status: 404 };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('no-screenshot-available');
      
      screenshotFactory.screenshot = { status: 403 };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('no-screenshot-available');

      screenshotFactory.screenshot = { error: 'error' };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        playerName: 'RisePlayerElectron',
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('screenshot-error');

      screenshotFactory.screenshot = null;
    });
  });

  describe('reloadScreenshotDisabled: ', function() {
    it('should return the correct state', function() {
      expect($scope.reloadScreenshotDisabled()).to.be.true;
      expect($scope.reloadScreenshotDisabled({})).to.be.true;
      expect($scope.reloadScreenshotDisabled({ os: 'cros-x64' })).to.be.true;

      screenshotFactory.screenshot = { status: 404 };
      expect($scope.reloadScreenshotDisabled({ onlineStatus: 'online', scheduleId: 1 })).to.be.true;

      screenshotFactory.screenshot = { status: 200, lastModified: '' };
      expect($scope.reloadScreenshotDisabled({ onlineStatus: 'online', scheduleId: 1 })).to.be.true;
    });
  });

});
