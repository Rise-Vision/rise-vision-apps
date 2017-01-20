'use strict';
describe('controller: display controls', function() {
  var displayId = 1234;
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('userState',userState);
    $provide.service('display',function(){
      return {
        restart: function(displayId) {
          functionCalled = 'restart';
          var deferred = Q.defer();
          if(updateDisplay){
            deferred.resolve(displayId);
          }else{
            deferred.reject('ERROR; could not restart display');
          }
          return deferred.promise;
        },
        reboot: function(displayId) {
          functionCalled = 'reboot';
          var deferred = Q.defer();
          if(updateDisplay){
            deferred.resolve(displayId);
          }else{
            deferred.reject('ERROR; could not reboot display');
          }
          return deferred.promise;
        }
      }
    });
    $provide.service('displayTracker', function() { 
      return function(name) {
        trackerCalled = name;
      };
    });
    $provide.service('$modal',function(){
      return {
        open : function(obj){
          expect(obj).to.be.truely;
          var deferred = Q.defer();
          if(confirmResponse){
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
  }));
  var $scope, userState, $location, updateDisplay, confirmResponse, functionCalled,
  trackerCalled;
  beforeEach(function(){
    updateDisplay = true;
    confirmResponse = false;
    functionCalled = undefined;
    trackerCalled = undefined;
    
    userState = function(){
      return {
        getSelectedCompanyId : function(){
          return 'some_company_id';
        },
        _restoreState : function(){

        },
        isSubcompanySelected : function(){
          return true;
        }
      }
    };
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $location = $injector.get('$location');
      $controller('displayControls', {
        $scope : $scope,
        userState : $injector.get('userState'),
        display:$injector.get('display'),
        $modal:$injector.get('$modal'),
        $log : $injector.get('$log')});
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.confirm).to.be.a('function');
  });

  describe('restart: ',function(){
    it('should return early the user does not confirm',function(){
      $scope.confirm('1234', 'restart');
      
      expect(functionCalled).to.not.be.ok;
    });
    
    it('should restart the display',function(done){
      confirmResponse = true;
      updateDisplay = true;
      
      $scope.confirm('1234', 'Display 1', 'restart');
      setTimeout(function(){
        expect(functionCalled).to.equal('restart');
        expect(trackerCalled).to.equal('Display Restarted');
        expect($scope.controlsInfo).to.be.ok;
        expect($scope.controlsError).to.not.be.ok;
        done();
      },10);
    });
    
    it('should show an error if fails to restart the display',function(done){
      confirmResponse = true;
      updateDisplay = false;
      
      $scope.confirm('1234', 'Display 1', 'restart');
      setTimeout(function(){
        expect(functionCalled).to.equal('restart');
        expect(trackerCalled).to.not.be.ok;
        expect($scope.controlsInfo).to.not.be.ok;
        expect($scope.controlsError).to.be.ok;
        done();
      },10);
    });
  });
  
  describe('reboot: ',function() {
    it('should return early the user does not confirm', function () {
      $scope.confirm('1234', 'reboot');

      expect(functionCalled).to.not.be.ok;
    });

    it('should reboot the display', function (done) {
      confirmResponse = true;
      updateDisplay = true;
      
      $scope.confirm('1234', 'Display 1', 'reboot');
      setTimeout(function(){
        expect(functionCalled).to.equal('reboot');
        expect(trackerCalled).to.equal('Display Rebooted');
        expect($scope.controlsInfo).to.be.ok;
        expect($scope.controlsError).to.not.be.ok;
        done();
      }, 10);
    });

    it('should show an error if fails to reboot the display', function (done) {
      confirmResponse = true;
      updateDisplay = false;
      
      $scope.confirm('1234', 'Display 1', 'reboot');
      setTimeout(function(){
        expect(functionCalled).to.equal('reboot');
        expect(trackerCalled).to.not.be.ok;
        expect($scope.controlsInfo).to.not.be.ok;
        expect($scope.controlsError).to.be.ok;
        done();
      }, 10);
    });

    it('should do nothing when calling restart with undefined display id', function (done) {
      confirmResponse = true;
      updateDisplay = false;

      $scope.confirm(undefined, 'restart');
      setTimeout(function () {
        expect(functionCalled).to.not.be.ok;
        expect($scope.controlsInfo).to.not.be.ok;
        expect($scope.controlsError).to.not.be.ok;
        done();
      }, 10);
    });

    it('should do nothing when calling reboot with undefined display id', function (done) {
      confirmResponse = true;
      updateDisplay = false;

      $scope.confirm(undefined, 'reboot');
      setTimeout(function () {
        expect(functionCalled).to.not.be.ok;
        expect($scope.controlsInfo).to.not.be.ok;
        expect($scope.controlsError).to.not.be.ok;
        done();
      }, 10);
    });
  });
});
