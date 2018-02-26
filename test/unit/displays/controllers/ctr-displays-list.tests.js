'use strict';
describe('controller: displays list', function() {
  beforeEach(module('risevision.displays.filters'));
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId : function(){
          return 'companyId';
        },
        _restoreState : function(){

        }
      }
    });
    $provide.service('ScrollingListService', function() {
      return function() {
        return {
          search: {},
          loadingItems: false,
          doSearch: function() {}
        };
      };
    });
    $provide.service('display', function() {
      return {};
    });

    $provide.service('$loading',function(){
      return {
        start : function(spinnerKeys){
          return;
        },
        stop : function(spinnerKeys){
          return;
        }
      }
    });
    
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
    
    $provide.service('displayFactory', function() {
      return {};
    });
    $provide.service('playerProFactory', function() {
      return {
        isOutdatedPlayer: function(display) {
          return display.outdated;
        },
        isUnsupportedPlayer: function(display) {
          return display.unsupported;
        },
        is3rdPartyPlayer: function(display) {
          return display.thirdParty;
        },
        isOfflinePlayCompatiblePayer: function(display) {
          return !display.notProCompatiblePlayer;
        },
        openPlayerProInfoModal: function(display) {
          expect(display).to.be.an('object');
          if(cancelProTrialModal) {
            return { result: Q.reject() };
          }
          else {
            return { result: Q.resolve() };
          }
        }
      };
    });
  }));
  var $scope, $loading, $filter, $loadingStartSpy, $loadingStopSpy, cancelProTrialModal;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $scope.listLimit = 5;
      $filter = $injector.get('$filter');
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $controller('displaysList', {
        $scope : $scope,
        $loading: $loading,
        $filter: $filter
      });
      $scope.$digest();  
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.displays).to.be.ok;
    expect($scope.displays.loadingItems).to.be.false;
    expect($scope.search).to.be.ok;
    expect($scope.filterConfig).to.be.ok;

    expect($scope.displayTracker).to.be.ok;
    expect($scope.displayFactory).to.be.ok;
  });

  it('should init the scope objects',function(){
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('count');
    expect($scope.search).to.have.property('reverse');
    expect($scope.search.count).to.equal(5);
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loadingStopSpy.should.have.been.calledWith('displays-list-loader');
    });
    
    it('should start spinner', function(done) {
      $scope.displays.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loadingStartSpy.should.have.been.calledWith('displays-list-loader');
        
        done();
      }, 10);
    });
  });
  
  it('should reload list when a Display is created', function() {
    var searchSpy = sinon.spy($scope.displays, 'doSearch');

    $scope.$broadcast('displayCreated');
    $scope.$apply();
    searchSpy.should.have.been.called;
  });

  describe('getDisplayType: ', function() {
    it('should return standard', function() {
      expect($scope.getDisplayType({})).to.equal('standard');
    });

    it('should return professional', function() {
      expect($scope.getDisplayType({ playerProAuthorized: true })).to.equal('professional');
    });

    it('should return not-pro-compatible', function() {
      expect($scope.getDisplayType({ onlineStatus: 'online', notProCompatiblePlayer: true })).to.equal('not-pro-compatible');
    });

    it('should return 3rd-party', function() {
      expect($scope.getDisplayType({ onlineStatus: 'online', thirdParty: true })).to.equal('3rd-party');
    });

    it('should return professional', function() {
      expect($scope.getDisplayType({ onlineStatus: 'online', playerProAuthorized: true })).to.equal('professional');
    });

    it('should return standard', function() {
      expect($scope.getDisplayType({ onlineStatus: 'online' })).to.equal('standard');
    });
  });
});
