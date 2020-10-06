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

    $provide.service('scheduleFactory', function() {
      return {
        deleteScheduleByObject: 'deleteScheduleByObject'
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
  
  it('listOperations:', function() {
    expect($scope.listOperations).to.be.ok;
    expect($scope.listOperations.name).to.equal('Schedule');
    expect($scope.listOperations.operations).to.have.length(1);
    expect($scope.listOperations.operations[0].name).to.equal('Delete');
    expect($scope.listOperations.operations[0].actionCall).to.equal('deleteScheduleByObject');
    expect($scope.listOperations.operations[0].requireRole).to.equal('cp');
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
