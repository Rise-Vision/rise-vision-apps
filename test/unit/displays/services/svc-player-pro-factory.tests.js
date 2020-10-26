'use strict';
describe('service: playerProFactory:', function() {
  var latestPlayerVersion = null;

  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('displayTracker', function() { 
      return function(name) {
        trackerCalled = name;
      };
    });
    $provide.service('userState',function(){
      return {
          getSelectedCompanyId: function() {return "company1"},
          _restoreState: function(){}
      };
    });
  }));
  var playerProFactory, $rootScope, $modal, trackerCalled;
  beforeEach(function(){
    trackerCalled = undefined;
    latestPlayerVersion = new Date(2017, 6, 15, 0, 0);

    inject(function($injector){
      playerProFactory = $injector.get('playerProFactory');
      $modal = $injector.get('$modal');
      $rootScope = $injector.get('$rootScope');
    });
  });

  it('should exist',function(){
    expect(playerProFactory).to.be.ok;
    
    expect(playerProFactory.is3rdPartyPlayer).to.be.a('function');
    expect(playerProFactory.isElectronPlayer).to.be.a('function');
    expect(playerProFactory.isUnsupportedPlayer).to.be.a('function');
    expect(playerProFactory.isScreenshotCompatiblePlayer).to.be.a('function');
    expect(playerProFactory.isOfflinePlayCompatiblePayer).to.be.a('function');
    expect(playerProFactory.isDisplayControlCompatiblePlayer).to.be.a('function');
  });

  it('is3rdPartyPlayer:',function(){
    expect(playerProFactory.is3rdPartyPlayer()).to.be.false;
    expect(playerProFactory.is3rdPartyPlayer({playerName:''})).to.be.false;
    expect(playerProFactory.is3rdPartyPlayer({playerName:'RisePlayer'})).to.be.false;
    expect(playerProFactory.is3rdPartyPlayer({playerName:'RisePlayerElectron', playerVersion: '2017.07.17.20.21'})).to.be.false;
    expect(playerProFactory.is3rdPartyPlayer({playerName:'RisePlayerElectron', os: 'Microsoft', playerVersion: '2017.07.17.20.21'})).to.be.false;
    expect(playerProFactory.is3rdPartyPlayer({playerName:'RisePlayerPackagedApp'})).to.be.true;
    expect(playerProFactory.is3rdPartyPlayer({playerName:'Cenique'})).to.be.true;
    expect(playerProFactory.is3rdPartyPlayer({playerName:'Other', playerVersion: 'Cenique 2.0'})).to.be.true;
    expect(playerProFactory.is3rdPartyPlayer({playerName:'Other', os: 'Android', playerVersion: '1.0'})).to.be.true;
    expect(playerProFactory.is3rdPartyPlayer({playerName:'Other', os: 'cros', playerVersion: '1.0'})).to.be.true;
  });

  it('isCROSLegacy:',function(){
    expect(playerProFactory.isCROSLegacy()).to.be.false;
    expect(playerProFactory.isCROSLegacy({os:''})).to.be.false;
    expect(playerProFactory.isCROSLegacy({os: 'Microsoft'})).to.be.false;
    expect(playerProFactory.isCROSLegacy({os:'cros'})).to.be.true;
  });

  it('isElectronPlayer:', function() {
    expect(playerProFactory.isElectronPlayer()).to.be.false;
    expect(playerProFactory.isElectronPlayer({playerName: null})).to.be.false;
    expect(playerProFactory.isElectronPlayer({playerName:'RisePlayer'})).to.be.false;
    expect(playerProFactory.isElectronPlayer({playerName:'RisePlayerElectron'})).to.be.true;
    expect(playerProFactory.isElectronPlayer({playerName:'RisePlayerElectron (Beta)'})).to.be.true;
  });

  it('isChromeOSPlayer:', function() {
    expect(playerProFactory.isChromeOSPlayer()).to.be.false;
    expect(playerProFactory.isChromeOSPlayer({playerName: null})).to.be.false;
    expect(playerProFactory.isChromeOSPlayer({playerName:'RisePlayer'})).to.be.false;
    expect(playerProFactory.isChromeOSPlayer({playerName:'RisePlayer', playerVersion: '2017.07.17.20.21'})).to.be.false;
    expect(playerProFactory.isChromeOSPlayer({playerName:'RisePlayerElectron'})).to.be.false;
    expect(playerProFactory.isChromeOSPlayer({playerName:'RisePlayerElectron', playerVersion: '2018.08.17.20.21'})).to.be.false;
    expect(playerProFactory.isChromeOSPlayer({playerName:'RisePlayer', playerVersion: '3.6'})).to.be.false;
    expect(playerProFactory.isChromeOSPlayer({playerName:'RisePlayer', playerVersion: '2018.08.17.20.21'})).to.be.true;
    expect(playerProFactory.isChromeOSPlayer({playerName:'(Beta) RisePlayer', playerVersion: '2018.08.17.20.21'})).to.be.true;
  });

  it('isUnsupportedPlayer:',function(){
    expect(playerProFactory.isUnsupportedPlayer()).to.be.false;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'RisePlayerElectron', playerVersion:''})).to.be.false;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'Cenique', playerVersion:'2017.06.27.05.15'})).to.be.true;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'RisePlayerPackagedApp', playerVersion:'2017.07.31.15.31'})).to.be.true;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'RisePlayer', playerVersion:'2018.09.45.0649'})).to.be.false;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'RisePlayer', playerVersion:'2017.09.45.0649'})).to.be.true;
  });

  it('isScreenshotCompatiblePlayer:',function(){
    expect(playerProFactory.isScreenshotCompatiblePlayer()).to.be.false;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:''})).to.be.false;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'1.0'})).to.be.false;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'2016.06.27.05.15'})).to.be.false;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'2017.07.31.15.31'})).to.be.true;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: '(Beta) RisePlayer', os: 'Chrome OS 10575.58.0', playerVersion: '2.2'})).to.be.false;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: '(Beta) RisePlayer', os: 'Chrome OS 10575.58.0', playerVersion: '2018.08.15.1111'})).to.be.false;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: '(Beta) RisePlayer', os: 'Chrome OS 10575.58.0', playerVersion: '2018.08.17.8388'})).to.be.true;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: 'RisePlayer', os: 'Chrome OS 10575.58.0', playerVersion: '2.3'})).to.be.false;
    expect(playerProFactory.isScreenshotCompatiblePlayer({playerName: 'RisePlayer', os: 'Chrome OS 10575.58.0', playerVersion: '2018.08.18.9092'})).to.be.true;
  });

  it('isOfflinePlayCompatiblePayer:',function(){
    expect(playerProFactory.isOfflinePlayCompatiblePayer()).to.be.false;
    expect(playerProFactory.isOfflinePlayCompatiblePayer({playerName: 'RisePlayerElectron', playerVersion:''})).to.be.false;
    expect(playerProFactory.isOfflinePlayCompatiblePayer({playerName: 'RisePlayerElectron', playerVersion:'3.11'})).to.be.false;
    expect(playerProFactory.isOfflinePlayCompatiblePayer({playerName: 'RisePlayerElectron', playerVersion:'2017.06.27.05.15'})).to.be.false;
    expect(playerProFactory.isOfflinePlayCompatiblePayer({playerName: 'RisePlayerElectron', playerVersion:'2017.07.31.15.31'})).to.be.true;
    expect(playerProFactory.isOfflinePlayCompatiblePayer({playerName: 'RisePlayerElectron', playerVersion:'2018.09.45.06.49'})).to.be.true;
  });

  it('isDisplayControlCompatiblePlayer:',function(){
    expect(playerProFactory.isDisplayControlCompatiblePlayer()).to.be.false;
    expect(playerProFactory.isDisplayControlCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:''})).to.be.false;
    expect(playerProFactory.isDisplayControlCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'95'})).to.be.false;
    expect(playerProFactory.isDisplayControlCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'2017.07.31.15.31', playerProAuthorized: true})).to.be.false;
    expect(playerProFactory.isDisplayControlCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'2018.09.45.06.49', playerProAuthorized: false})).to.be.false;
    expect(playerProFactory.isDisplayControlCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'2018.09.45.06.49', playerProAuthorized: true})).to.be.true;
  });
});
