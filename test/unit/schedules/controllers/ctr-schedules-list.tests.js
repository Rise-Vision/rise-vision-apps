'use strict';
describe('controller: schedules list', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module('risevision.schedules.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('schedule',function(){
      return {
        list: function() {}
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
  }));
  var $scope, $loading,$loadingStartSpy, $loadingStopSpy;
  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $scope.listLimit = 5;
      $loading = $injector.get('$loading');
      $controller('schedulesList', {
        $scope : $scope,
        schedule:$injector.get('schedule'),
        $loading: $loading
      });
      $scope.$digest();  
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;

  });

  it('should init the scope objects',function(){
    expect($scope.schedules).to.be.ok;
    
    expect($scope.search).to.be.ok;
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('count');
    expect($scope.search).to.have.property('reverse');
    expect($scope.search.count).to.equal(5);
  });
  
  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('schedules-list-loader');
    });
    
    it('should start spinner', function(done) {
      $scope.schedules.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('schedules-list-loader');
        
        done();
      }, 10);
    });
  });


});
