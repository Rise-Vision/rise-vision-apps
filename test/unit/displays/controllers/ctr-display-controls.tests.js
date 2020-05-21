'use strict';

describe('controller: display controls', function() {
  var displayId = 1234;
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranslate()));
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
    $provide.service('displayFactory', function() { 
      return {
        showUnlockDisplayFeatureModal: sinon.stub().returns(false)
      };
    });
    $provide.service('displayTracker', function() { 
      return function(name) {
        trackerCalled = name;
      };
    });
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });
    $provide.service('$modal',function(){
      return {
        open : sinon.spy(function(obj) {
          expect(obj).to.be.ok;
          var deferred = Q.defer();
          if(confirmResponse){
            deferred.resolve();
          }else{
            deferred.reject();
          }
          
          return {
            result: deferred.promise
          };
        })
      }
    });
  }));
  var $scope, $modal, userState, $location, updateDisplay, confirmResponse, functionCalled,
  trackerCalled, processErrorCode, displayFactory;
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
      displayFactory = $injector.get('displayFactory');
      $modal = $injector.get('$modal');

      $controller('displayControls', {
        $scope : $scope,
        userState : $injector.get('userState'),
        display:$injector.get('display'),
        $modal:$modal,
        $log : $injector.get('$log')});
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;

    expect($scope.confirm).to.be.a('function');
  });

  describe('restart: ',function(){
    it('should not proceed if Display is not licensed',function(){
      displayFactory.showUnlockDisplayFeatureModal.returns(true);

      $scope.confirm('1234', 'restart');

      $modal.open.should.not.have.been.called;
      expect(functionCalled).to.not.be.ok;
    });

    it('should return early the user does not confirm',function(){
      $scope.confirm('1234', 'restart');
      
      $modal.open.should.have.been.called;
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
        processErrorCode.should.have.been.calledWith('Display', 'restart', sinon.match.any);
        expect($scope.controlsError).to.be.ok;
        done();
      },10);
    });
  });
  
  describe('reboot: ',function() {
    it('should not proceed if Display is not licensed',function(){
      displayFactory.showUnlockDisplayFeatureModal.returns(true);

      $scope.confirm('1234', 'reboot');

      $modal.open.should.not.have.been.called;
      expect(functionCalled).to.not.be.ok;
    });

    it('should return early the user does not confirm', function () {
      $scope.confirm('1234', 'reboot');

      $modal.open.should.have.been.called;
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
        processErrorCode.should.have.been.calledWith('Display', 'reboot', sinon.match.any);
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
