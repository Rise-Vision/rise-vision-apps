'use strict';
describe('controller: schedule add', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('scheduleFactory',function(){
      return {
        schedule: {},
        loadingSchedule: true,
        addSchedule : function(){
          scheduleAdded = true;
        }
      };
    });
    $provide.service('$loading',function(){
      return {
        start : sinon.spy(),
        stop : sinon.spy()
      }
    });

  }));
  var $scope, scheduleFactory, $loading, scheduleAdded;
  beforeEach(function(){
    scheduleAdded = false;
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      scheduleFactory = $injector.get('scheduleFactory');
      $loading = $injector.get('$loading');
      $controller('scheduleAdd', {
        $scope : $scope,
        scheduleFactory: scheduleFactory,
        $loading: $loading,
        $log: $injector.get('$log')
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;

    expect($scope.save).to.be.a('function');
    expect($scope.factory).to.equal(scheduleFactory);
  });

  it('should return early if the form is invalid',function(){
    $scope.scheduleDetails = {};
    $scope.scheduleDetails.$valid = false;
    $scope.save();
  });

  it('should save the schedule',function(){
    $scope.scheduleDetails = {};
    $scope.scheduleDetails.$valid = true;
    $scope.save();

    expect(scheduleAdded).to.be.true;

  });

  it('should show/hide loading spinner if loading', function(done) {
    $scope.$digest();
    $loading.start.should.have.been.calledWith('schedule-loader');

    scheduleFactory.loadingSchedule = false;
    $scope.$digest();
    setTimeout(function(){
      $loading.stop.should.have.been.calledWith('schedule-loader');
      done();
    },10);
  });

});
