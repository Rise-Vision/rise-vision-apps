'use strict';
describe('controller: display details', function() {
  var displayId = 1234;

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
    $provide.service('playerProFactory', function() {
      return {        
        is3rdPartyPlayer: function(){ return false;},
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
          _restoreState: function(){}
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
        loadScreenshot: sinon.stub()
      }
    });
    $provide.value('displayId', '1234');
  }));
  var $scope, $state, updateCalled, deleteCalled, confirmDelete;
  var resolveLoadScreenshot, resolveRequestScreenshot, 
  $rootScope, $loading, displayFactory, playerProFactory;
  beforeEach(function(){
    updateCalled = false;
    deleteCalled = false;
    resolveRequestScreenshot = true;
    resolveLoadScreenshot = true;

    inject(function($injector, $controller){
      displayFactory = $injector.get('displayFactory');
      playerProFactory = $injector.get('playerProFactory');
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

  it('should exist',function() {
    expect($scope).to.be.ok;
    expect($scope.displayId).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.companyId).to.be.ok;
    expect($scope.productCode).to.be.ok;
    expect($scope.productId).to.be.ok;

    expect($scope.save).to.be.a('function');
    expect($scope.confirmDelete).to.be.a('function');
  });

  it('should initialize', function(done) {

    expect($scope.companyId).to.equal("company1");
    expect($scope.productCode).to.equal("c4b368be86245bf9501baaa6e0b00df9719869fd");
    expect($scope.productId).to.equal("2048");

    setTimeout(function() {
      expect($scope.display).to.be.ok;
      expect($scope.display.id).to.equal('1234');

      expect($scope.display.subscriptionStatus).to.not.be.ok;
      expect($scope.display.showTrialButton).to.not.be.ok;
      expect($scope.display.showTrialStatus).to.not.be.ok;
      expect($scope.display.showSubscribeButton).to.not.be.ok;

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

  it('should show spinner on refreshSubscriptionStatus',function(){
    var spy = sinon.spy($loading,'start')
    $rootScope.$emit('refreshSubscriptionStatus');
    spy.should.have.been.calledWith('loading-trial');
  });

  describe('subscription-status:changed:',function(){
    it('should hide spinner and set false to flags when on default state ',function(done){
      var spy = sinon.spy($loading,'stop')
      
      $rootScope.$emit('subscription-status:changed', {});
      
      spy.should.have.been.calledWith('loading-trial');
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.false;
        expect($scope.display.showTrialStatus).to.be.false;
        expect($scope.display.showSubscribeButton).to.be.false;
        done();
      },10);
    });

    it('should hide flags for 3rd part players',function(done){
      $scope.deferredDisplay.resolve({playerName:'Cenique', playerVersion: '2017.07.17.20.21'});
      var spy = sinon.stub(playerProFactory,'is3rdPartyPlayer',function() {return true});
      
      $rootScope.$emit('subscription-status:changed',{});
      
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.false;
        expect($scope.display.showTrialStatus).to.be.false;
        expect($scope.display.showSubscribeButton).to.be.false;
        done();
      },10);
    });

    it('should hide flags for outdated players',function(done){
      $scope.deferredDisplay.resolve({playerName:'RiseVisionElectron', playerVersion: '2017.01.04.14.40'})
      var spy = sinon.stub(playerProFactory,'isOutdatedPlayer',function() {return true});
      
      $rootScope.$emit('subscription-status:changed',{});
      
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.false;
        expect($scope.display.showTrialStatus).to.be.false;
        expect($scope.display.showSubscribeButton).to.be.false;
        done();
      },10);
    });

    it('should set correct flags when trial-available',function(done){
      sinon.stub($scope.displayService, 'getCompanyProStatus')
        .returns(Q.resolve({status: 'Trial Available', statusCode: 'trial-available'}));

      $scope.deferredDisplay.resolve({playerName:'RiseVisionElectron', playerVersion: '2017.07.17.20.21'});
      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'trial-available'});
      
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.true;
        expect($scope.display.showTrialStatus).to.be.false;
        expect($scope.display.showSubscribeButton).to.be.false;
        done();
      },10)     
    });

    it('should set correct flags when on-trial',function(done){
      $scope.deferredDisplay.resolve({playerName:'RiseVisionElectron', playerVersion: '2017.07.17.20.21'});      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'on-trial'});
      
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.false;
        expect($scope.display.showTrialStatus).to.be.true;
        expect($scope.display.showSubscribeButton).to.be.true;
        done();
      },10);
    });

    it('should set correct flags when suspended',function(done){
      $scope.deferredDisplay.resolve({playerName:'RiseVisionElectron', playerVersion: '2017.07.17.20.21'});      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'suspended'});
      
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.false;
        expect($scope.display.showTrialStatus).to.be.true;
        expect($scope.display.showSubscribeButton).to.be.true;
        done();
      },10);
    });

    it('should set correct flags when trial-expired',function(done){
      $scope.deferredDisplay.resolve({playerName:'RiseVisionElectron', playerVersion: '2017.07.17.20.21'});      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'trial-expired'});
      
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.false;
        expect($scope.display.showTrialStatus).to.be.false;
        expect($scope.display.showSubscribeButton).to.be.true;
        done();
      },10);
    });

    it('should set correct flags when cancelled',function(done){
      $scope.deferredDisplay.resolve({playerName:'RiseVisionElectron', playerVersion: '2017.07.17.20.21'});      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'cancelled'});
      
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.false;
        expect($scope.display.showTrialStatus).to.be.false;
        expect($scope.display.showSubscribeButton).to.be.true;
        done();
      },10);
    });

    it('should set correct flags when not-subscribed',function(done){
      $scope.deferredDisplay.resolve({playerName:'RiseVisionElectron', playerVersion: '2017.07.17.20.21'});      
      $rootScope.$emit('subscription-status:changed',{statusCode: 'not-subscribed'});
      
      setTimeout(function(){
        expect($scope.display.showTrialButton).to.be.false;
        expect($scope.display.showTrialStatus).to.be.false;
        expect($scope.display.showSubscribeButton).to.be.true;
        done();
      },10);
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
