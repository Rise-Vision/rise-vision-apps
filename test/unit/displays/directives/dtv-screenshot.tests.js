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
        screenshotLoading: false,
        screenshot: {}
      };
    });
    
    $provide.service('playerProFactory', function() {
      return {
        isScreenshotCompatiblePlayer: sinon.stub().returns(true),
        isChromeOSPlayer: sinon.stub().returns(false)
      };
    });

    $provide.service('displayFactory', function() {
      return {
        showLicenseRequired: sinon.stub().returns(false)
      };
    });
  }));
  
  var elm, $scope, $compile, displayFactory, screenshotFactory, playerProFactory, display;

  beforeEach(inject(function($rootScope, $injector, _$compile_, $templateCache) {
    display = $injector.get('display');
    displayFactory = $injector.get('displayFactory');
    screenshotFactory = $injector.get('screenshotFactory');
    playerProFactory = $injector.get('playerProFactory')

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
    expect(elm.html()).to.equal('Screenshot');
    expect($scope.screenshotFactory).to.be.ok;
    expect($scope.screenshotState).to.be.a('function');
    expect($scope.reloadScreenshotEnabled).to.be.a('function');
  });

  describe('screenshotState: ', function() {
    it('no-license', function() {
      displayFactory.showLicenseRequired.returns(true);

      expect($scope.screenshotState({})).to.equal('no-license');
    });

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
        expect($scope.screenshotState({})).to.not.be.ok;
      });
    });

    it('screenshot-loaded', function() {
      screenshotFactory.screenshot = { status: 200, lastModified: new Date().toISOString() };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('screenshot-loaded');
    });

    it('screenshot-error', function() {
      screenshotFactory.screenshot = { error: 'error' };
      expect($scope.screenshotState({
        playerVersion: '2018',
        playerErrorCode: 0,
        scheduleId: 1,
        onlineStatus: 'online'
      })).to.equal('screenshot-error');
    });

  });

  describe('reloadScreenshotEnabled: ', function() {
    it('no-license', function() {
      displayFactory.showLicenseRequired.returns(true);

      expect($scope.reloadScreenshotEnabled({})).to.be.false;
    });

    describe('loading: ', function() {
      it('status loading', function() {
        display.statusLoading = true;

        expect($scope.reloadScreenshotEnabled({})).to.be.false;
      });

      it('screenshot loading', function() {
        screenshotFactory.screenshotLoading = true;

        expect($scope.reloadScreenshotEnabled({})).to.be.false;
      });

      it('screenshot loading', function() {
        screenshotFactory.screenshot = false;

        expect($scope.reloadScreenshotEnabled({})).to.be.false;
      });
    });

    it('chrome os', function() {
      expect($scope.reloadScreenshotEnabled({ os: 'cros-x64' })).to.be.false;
    });

    it('not compatible', function() {
      playerProFactory.isScreenshotCompatiblePlayer.returns(false);
      expect($scope.reloadScreenshotEnabled({ os: 'windows-x64' })).to.be.false;

      playerProFactory.isScreenshotCompatiblePlayer.should.have.been.called;
    });

    it('online', function() {
      expect($scope.reloadScreenshotEnabled({
        onlineStatus: 'online'
      })).to.be.true;

      playerProFactory.isScreenshotCompatiblePlayer.should.have.been.called;
    });

    it('offline', function() {
      expect($scope.reloadScreenshotEnabled({
        onlineStatus: 'offline'
      })).to.be.false;

      playerProFactory.isScreenshotCompatiblePlayer.should.have.been.called;
    });

  });

});
