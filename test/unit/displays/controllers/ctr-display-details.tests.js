'use strict';
describe('controller: display details', function() {
  var displayId = 1234;
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory',function(){
      return {
        display: {},
        getDisplay: function(displayId) {
          this.display.id = displayId;

          return Q.resolve();
        },
        updateDisplay : function(){
          updateCalled = true;
          
          return Q.resolve();
        },
        deleteDisplay: function() {
          deleteCalled = true;
        }
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
      }
    });
    $provide.value('displayId', '1234');
  }));
  var $scope, $state, updateCalled, deleteCalled, confirmDelete;
  beforeEach(function(){
    updateCalled = false;
    deleteCalled = false;
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      $controller('displayDetails', {
        $scope : $scope,
        displayFactory:$injector.get('displayFactory'),
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
  
  it('should initialize', function(done) {
    setTimeout(function() {
      expect($scope.display).to.be.ok;      
      expect($scope.display.id).to.equal('1234');
      
      done();
    }, 10);
  });

  describe('submit: ',function(){
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
  
  describe('delete: ',function(){
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
  })

});
