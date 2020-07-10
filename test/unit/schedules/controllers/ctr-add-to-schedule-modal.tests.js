'use strict';
describe('controller: AddToScheduleModalController', function() {
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
    $provide.service('$loading',function(){
      return $loading = {
        start: sinon.stub(),
        stop: sinon.stub()
      }
    });    
  }));
  var $scope, $modalInstance, scheduleSelectorFactory, $loading;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');

      $controller('AddToScheduleModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.ok).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.factory).to.equal(scheduleSelectorFactory);
  });

  describe('ok:', function() {
    it('should close modal',function(){
        $scope.ok();
        $modalInstance.close.should.have.been.called;
    });
  });

  describe('dismiss:', function() {
    it('should dismiss modal',function(){
        $scope.dismiss();
        $modalInstance.dismiss.should.have.been.called;
    });
  });

  describe('watch loadingSchedules:', function() {
    it('should show spinner when loading Schedules', function() {
      scheduleSelectorFactory.loadingSchedules = true;
      $scope.$digest();
      $loading.start.should.have.been.calledWith('add-to-schedule-spinner');
    });

    it('should hide spinner when finished loading Schedules', function() {
      $loading.stop.resetHistory();

      scheduleSelectorFactory.loadingSchedules = true;
      $scope.$digest();
      scheduleSelectorFactory.loadingSchedules = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledWith('add-to-schedule-spinner');
    });
  });

});
