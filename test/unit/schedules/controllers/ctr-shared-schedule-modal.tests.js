'use strict';
describe('controller: SharedScheduleModalController', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    schedule = {id: 'scheduleId'};

    $provide.service('$modalInstance',function(){
      return {
        dismiss : function(){}
      }
    });  
    $provide.service('scheduleFactory',function(){
      return scheduleFactory = {
        schedule: schedule
      }
    });    
  }));
  var $scope, $modalInstance, scheduleFactory, schedule;

  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      
      sinon.spy($modalInstance, 'dismiss');

      $controller('SharedScheduleModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.dismiss).to.be.a('function');
    expect($scope.schedule).to.equal(schedule);
    expect($scope.currentTab).to.equal('link');
  });

  it('should dismiss modal',function(){
      $scope.dismiss();
      $modalInstance.dismiss.should.have.been.called;
  });

});
