'use strict';
describe('controller: schedule details', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('scheduleFactory',function(){
      return {
        schedule: {},
        loadingSchedule: true,
        updateSchedule : function(){
          updateCalled = true;
          
          return Q.resolve();
        },
        deleteSchedule: function() {
          deleteCalled = true;
        },
        logTransitionUsage: function() {}
      }
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
      }
    });
    $provide.service('display',function(){
      return {
        hasFreeDisplays: function() {}
      }
    });
    $provide.service('$modal',function(){
      return {
        open : function(obj){
          expect(obj).to.be.ok;
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
      }
    });
    $provide.service('$loading',function(){
      return {
        start : sinon.spy(),
        stop : sinon.spy()
      }
    });

  }));
  var $scope, $state, $loading, scheduleFactory, updateCalled, deleteCalled, confirmDelete;
  beforeEach(function(){
    updateCalled = false;
    deleteCalled = false;
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      $loading = $injector.get('$loading');
      scheduleFactory = $injector.get('scheduleFactory');
      $controller('scheduleDetails', {
        $scope : $scope,
        $modal:$injector.get('$modal'),
        $state : $state,
        $log : $injector.get('$log')});
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;

    expect($scope.save).to.be.a('function');
    expect($scope.confirmDelete).to.be.a('function');
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

  describe('submit: ',function(){
    it('should return early if the form is invalid',function(){
      $scope.scheduleDetails = {};
      $scope.scheduleDetails.$valid = false;
      $scope.save();
      
      expect(updateCalled).to.be.false;
    });

    it('should save the schedule',function(){
      $scope.scheduleDetails = {};
      $scope.scheduleDetails.$valid = true;
      $scope.save();

      expect(updateCalled).to.be.true;
    });
  });
  
  describe('delete: ',function(){
    beforeEach(function() {
      confirmDelete = false;
    });
    
    it('should return early the user does not confirm',function(){
      $scope.confirmDelete();
      
      expect(deleteCalled).to.be.false;
    });
    
    it('should delete the schedule',function(done){
      confirmDelete = true;
      
      $scope.confirmDelete();

      setTimeout(function() {
        expect(deleteCalled).to.be.true;
        
        done();
      }, 10);
    });
    
  });

});
