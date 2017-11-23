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
    $provide.service('storeAuthorization',function(){
      return {
        startTrial: function(){}
      };
    });
    $provide.service('userState',function(){
      return {
          getSelectedCompanyId: function() {return "company1"},
          _restoreState: function(){}
      };
    });
    $provide.value('PLAYER_PRO_PRODUCT_CODE','PLAYER_PRO_PRODUCT_CODE');
    $provide.factory('getLatestPlayerVersion', function() {
      return function() {
        return Q.resolve(latestPlayerVersion);
      };
    });

  }));
  var playerProFactory, $rootScope, $modal, trackerCalled, storeAuthorization;
  beforeEach(function(){
    trackerCalled = undefined;
    latestPlayerVersion = new Date(2017, 6, 15, 0, 0);

    inject(function($injector){
      playerProFactory = $injector.get('playerProFactory');
      storeAuthorization = $injector.get('storeAuthorization');
      $modal = $injector.get('$modal');
      $rootScope = $injector.get('$rootScope');
    });
  });

  it('should exist',function(){
    expect(playerProFactory).to.be.ok;
    
    expect(playerProFactory.getProductLink).to.be.a('function');
    expect(playerProFactory.is3rdPartyPlayer).to.be.a('function');
    expect(playerProFactory.isOutdatedPlayer).to.be.a('function');
    expect(playerProFactory.isUnsupportedPlayer).to.be.a('function');
    expect(playerProFactory.isProCompatiblePlayer).to.be.a('function');
    expect(playerProFactory.openPlayerProInfoModal).to.be.a('function'); 
    expect(playerProFactory.startPlayerProTrial).to.be.a('function'); 
  });
  
  it('getProductLink: ', function() {
    expect(playerProFactory.getProductLink()).to.equal('https://store.risevision.com/product/2048/?cid=company1');
  })

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

  it('isOutdatedPlayer:',function(done){
    setTimeout(function() {
      expect(playerProFactory.isOutdatedPlayer({playerName:'Cenique', playerVersion: '2017.07.17.20.21'})).to.be.false;
      expect(playerProFactory.isOutdatedPlayer({playerName:'RisePlayerPackagedApp', playerVersion: '2017.07.17.20.21'})).to.be.false;

      expect(playerProFactory.isOutdatedPlayer({playerName:'RisePlayer', playerVersion: '2017.07.17.20.21'})).to.be.false;
      expect(playerProFactory.isOutdatedPlayer({playerName:'RisePlayer', playerVersion: '2017.01.04.14.40'})).to.be.false;

      expect(playerProFactory.isOutdatedPlayer({playerName:'RisePlayerElectron', playerVersion: '2017.07.17.20.21'})).to.be.false;
      expect(playerProFactory.isOutdatedPlayer({playerName:'RisePlayerElectron', playerVersion: '2017.08.04.14.40'})).to.be.false;
      expect(playerProFactory.isOutdatedPlayer({playerName:'RisePlayerElectron', playerVersion: '2017.01.04.14.40'})).to.be.true;

      done();
    }, 10);
  });

  it('isUnsupportedPlayer:',function(){
    expect(playerProFactory.isUnsupportedPlayer()).to.be.false;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'RisePlayerElectron', playerVersion:''})).to.be.false;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'Cenique', playerVersion:'2017.06.27.05.15'})).to.be.false;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'RisePlayerPackagedApp', playerVersion:'2017.07.31.15.31'})).to.be.false;
    expect(playerProFactory.isUnsupportedPlayer({playerName: 'RisePlayer', playerVersion:'2018.09.45.06.49'})).to.be.true;
  });

  it('isProCompatiblePlayer:',function(){
    expect(playerProFactory.isProCompatiblePlayer()).to.be.false;
    expect(playerProFactory.isProCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:''})).to.be.false;
    expect(playerProFactory.isProCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'2017.06.27.05.15'})).to.be.false;
    expect(playerProFactory.isProCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'2017.07.31.15.31'})).to.be.true;
    expect(playerProFactory.isProCompatiblePlayer({playerName: 'RisePlayerElectron', playerVersion:'2018.09.45.06.49'})).to.be.true;
  });

  describe('openPlayerProInfoModal: ', function() {
    it('should open modal', function() {
      var $modalSpy = sinon.spy($modal, 'open');
      
      playerProFactory.openPlayerProInfoModal(); 

      expect(trackerCalled).to.equal('Player Pro Info Modal');     
      
      $modalSpy.should.have.been.calledWithMatch({
        controller: "PlayerProInfoModalCtrl",
        size: "lg",
        templateUrl: "partials/displays/player-pro-info-modal.html"
      });
    });
  });

  describe('startPlayerProTrial: ', function() {
    it('should start trial', function(done) {
      var storeTrialSpy = sinon.stub(storeAuthorization, 'startTrial',function(){return Q.resolve()});
      var emitSpy = sinon.spy($rootScope,'$emit');
      
      playerProFactory.startPlayerProTrial(); 

      expect(trackerCalled).to.equal('Starting Player Pro Trial');  
      storeTrialSpy.should.have.been.calledWith('PLAYER_PRO_PRODUCT_CODE');
      setTimeout(function(){
        expect(trackerCalled).to.equal('Started Trial Player Pro'); 
        emitSpy.should.have.been.calledWith('refreshSubscriptionStatus', 'trial-available')
        done();
      },10);      
    });

    it('should handle start trial fail', function(done) {
      var storeTrialSpy = sinon.stub(storeAuthorization, 'startTrial',function(){return Q.reject()});
      var emitSpy = sinon.spy($rootScope,'$emit');
      
      playerProFactory.startPlayerProTrial(); 

      expect(trackerCalled).to.equal('Starting Player Pro Trial');  
      storeTrialSpy.should.have.been.calledWith('PLAYER_PRO_PRODUCT_CODE');
      setTimeout(function(){
        expect(trackerCalled).to.not.equal('Started Trial Player Pro'); 
        emitSpy.should.not.have.been.calledWith('refreshSubscriptionStatus', 'trial-available')
        done();
      },10);      
    });
  });
});
