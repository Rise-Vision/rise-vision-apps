'use strict';
describe('controller: displays list', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.displays.filters'));
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranslate()));
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
          doSearch: function() {},
          getSelectedAction: sinon.stub().returns('action')
        };
      };
    });
    $provide.service('display', function() {
      return {};
    });

    $provide.service('$loading',function(){
      return {
        start : sinon.spy(),
        stop : sinon.spy()
      }
    });
    
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
    
    $provide.service('displayFactory', function() {
      return {
        deleteDisplayByObject: 'deleteDisplayByObject'
      };
    });
    $provide.service('playerLicenseFactory', function() {
      return {};
    });
  }));
  var $scope, $loading, $filter, $window;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $scope.listLimit = 5;
      $filter = $injector.get('$filter');
      $loading = $injector.get('$loading');
      $window = $injector.get('$window');
      $controller('displaysList', {
        $scope : $scope,
        $loading: $loading,
        $filter: $filter,
        $window: $window
      });
      $scope.$digest();  
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.displays).to.be.ok;
    expect($scope.displays.loadingItems).to.be.false;
    expect($scope.search).to.be.ok;
    expect($scope.filterConfig).to.be.ok;

    expect($scope.displayFactory).to.be.ok;
    expect($scope.playerLicenseFactory).to.be.ok;
  });

  it('deleteDisplays:', function() {
    expect($scope.deleteDisplays).to.be.ok;
    expect($scope.deleteDisplays).to.equal('action');

    $scope.displays.getSelectedAction.should.have.been.calledWith('deleteDisplayByObject', true)
  });

  it('should init the scope objects',function(){
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('count');
    expect($scope.search).to.have.property('reverse');
    expect($scope.search.count).to.equal(5);
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('displays-list-loader');
    });
    
    it('should start spinner', function(done) {
      $scope.displays.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('displays-list-loader');
        
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

  it('should return correct statuses', function () {
    expect($scope.playerNotInstalled()).to.be.true;
    expect($scope.playerOnline({ onlineStatus: 'online' })).to.be.true;
    expect($scope.playerOffline({ playerVersion: 'version' })).to.be.true;
  });

  describe('getDisplayType: ', function() {
    it('should return standard', function() {
      expect($scope.getDisplayType({})).to.equal('standard');
    });

    it('should return professional', function() {
      expect($scope.getDisplayType({ playerProAuthorized: true })).to.equal('professional');
    });

    it('should return standard (unsupported only shown in details)', function() {
      expect($scope.getDisplayType({ onlineStatus: 'online', unsupported: true })).to.equal('standard');
    });

    it('should return professional', function() {
      expect($scope.getDisplayType({ onlineStatus: 'online', playerProAuthorized: true })).to.equal('professional');
    });

    it('should return professional (unsupported only shown in details)', function() {
      expect($scope.getDisplayType({ onlineStatus: 'online', unsupported: true, playerProAuthorized: true })).to.equal('professional');
    });

    it('should return standard', function() {
      expect($scope.getDisplayType({ onlineStatus: 'online' })).to.equal('standard');
    });
  });
});
