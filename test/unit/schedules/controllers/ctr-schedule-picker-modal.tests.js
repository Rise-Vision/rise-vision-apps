'use strict';
describe('controller: SchedulePickerModalController', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        dismiss : sinon.stub(),
        close : sinon.stub()
      }
    });  
    $provide.service('scheduleSelectorFactory',function(){
      return scheduleSelectorFactory = {}
    });  
  }));
  var $scope, $modalInstance, scheduleSelectorFactory, $loading;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');

      $controller('SchedulePickerModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.assign).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.factory).to.equal(scheduleSelectorFactory);
    expect($scope.selectedSchedule).to.be.null;
  });

  describe('assign:', function() {
    it('should close modal and return selected schedule',function(){
        $scope.selectedSchedule = { id: 'scheduleId' };
        $scope.$digest();
        $scope.assign();
        $modalInstance.close.should.have.been.calledWith($scope.selectedSchedule);
    });
  });

  describe('dismiss:', function() {
    it('should dismiss modal',function(){
        $scope.dismiss();
        $modalInstance.dismiss.should.have.been.called;
    });
  });

});
