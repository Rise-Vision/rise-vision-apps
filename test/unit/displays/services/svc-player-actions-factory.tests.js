'use strict';
describe('service: playerActionsFactory:', function() {

  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
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
        showLicenseRequired: sinon.stub().returns(false)
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
    $provide.service('confirmModal',function(){
      return sinon.stub().returns(Q.reject());
    });

  }));
  var playerActionsFactory, confirmModal, updateDisplay, functionCalled,
  trackerCalled, processErrorCode, displayFactory, display;
  beforeEach(function(){
    display = {id: '1234', name: 'Display 1'};
    updateDisplay = true;
    functionCalled = undefined;
    trackerCalled = undefined;

    inject(function($injector){
      playerActionsFactory = $injector.get('playerActionsFactory');
      displayFactory = $injector.get('displayFactory');
      confirmModal = $injector.get('confirmModal');
    });
  });

  it('should exist',function(){
    expect(playerActionsFactory).to.be.ok;
    
    expect(playerActionsFactory.confirm).to.be.a('function');
  });

  describe('restart: ',function(){
    it('should not proceed if Display is not licensed',function(){
      displayFactory.showLicenseRequired.returns(true);

      playerActionsFactory.confirm('1234', 'restart');

      confirmModal.should.not.have.been.called;
      expect(functionCalled).to.not.be.ok;
    });

    it('should return early the user does not confirm',function(){
      playerActionsFactory.confirm('1234', 'restart');
      
      confirmModal.should.have.been.called;
      expect(functionCalled).to.not.be.ok;
    });
    
    it('should restart the display',function(done){
      confirmModal.returns(Q.resolve());
      updateDisplay = true;
      
      playerActionsFactory.confirm('1234', 'Display 1', 'restart');
      setTimeout(function(){
        expect(functionCalled).to.equal('restart');
        expect(trackerCalled).to.equal('Display Restarted');
        expect(playerActionsFactory.controlsError).to.not.be.ok;
        done();
      },10);
    });
    
    it('should show an error if fails to restart the display',function(done){
      confirmModal.returns(Q.resolve());
      updateDisplay = false;
      
      playerActionsFactory.confirm('1234', 'Display 1', 'restart');
      setTimeout(function(){
        expect(functionCalled).to.equal('restart');
        expect(trackerCalled).to.not.be.ok;
        processErrorCode.should.have.been.calledWith(sinon.match.any);
        expect(playerActionsFactory.controlsError).to.be.ok;
        done();
      },10);
    });
  });
  
  describe('reboot: ',function() {
    it('should not proceed if Display is not licensed',function(){
      displayFactory.showLicenseRequired.returns(true);

      playerActionsFactory.confirm('1234', 'reboot');

      confirmModal.should.not.have.been.called;
      expect(functionCalled).to.not.be.ok;
    });

    it('should return early the user does not confirm', function () {
      playerActionsFactory.confirm('1234', 'reboot');

      confirmModal.should.have.been.called;
      expect(functionCalled).to.not.be.ok;
    });

    it('should reboot the display', function (done) {
      confirmModal.returns(Q.resolve());
      updateDisplay = true;
      
      playerActionsFactory.confirm('1234', 'Display 1', 'reboot');
      setTimeout(function(){
        expect(functionCalled).to.equal('reboot');
        expect(trackerCalled).to.equal('Display Rebooted');
        expect(playerActionsFactory.controlsError).to.not.be.ok;
        done();
      }, 10);
    });

    it('should show an error if fails to reboot the display', function (done) {
      confirmModal.returns(Q.resolve());
      updateDisplay = false;
      
      playerActionsFactory.confirm('1234', 'Display 1', 'reboot');
      setTimeout(function(){
        expect(functionCalled).to.equal('reboot');
        expect(trackerCalled).to.not.be.ok;
        processErrorCode.should.have.been.calledWith(sinon.match.any);
        expect(playerActionsFactory.controlsError).to.be.ok;
        done();
      }, 10);
    });

    it('should do nothing when calling restart with undefined display id', function (done) {
      confirmModal.returns(Q.resolve());
      updateDisplay = false;

      playerActionsFactory.confirm(undefined, 'restart');
      setTimeout(function () {
        expect(functionCalled).to.not.be.ok;
        expect(playerActionsFactory.controlsError).to.not.be.ok;
        done();
      }, 10);
    });

    it('should do nothing when calling reboot with undefined display id', function (done) {
      confirmModal.returns(Q.resolve());
      updateDisplay = false;

      playerActionsFactory.confirm(undefined, 'reboot');
      setTimeout(function () {
        expect(functionCalled).to.not.be.ok;
        expect(playerActionsFactory.controlsError).to.not.be.ok;
        done();
      }, 10);
    });
  });

  describe('restartByObject:',function(){
    it('should restart the display',function(done){
      updateDisplay = true;
      
      playerActionsFactory.restartByObject(display).then(function(){
        expect(functionCalled).to.equal('restart');
        expect(trackerCalled).to.equal('Display Restarted');

        done();
      });
    });
    
    it('should reject on failure',function(done){
      updateDisplay = false;
      
      playerActionsFactory.restartByObject(display).catch(function(){
        expect(functionCalled).to.equal('restart');
        expect(trackerCalled).to.not.be.ok;

        done();
      });
    });
  });

  describe('rebootByObject:',function(){
    it('should reboot the display',function(done){
      updateDisplay = true;
      
      playerActionsFactory.rebootByObject(display).then(function(){
        expect(functionCalled).to.equal('reboot');
        expect(trackerCalled).to.equal('Display Rebooted');

        done();
      });
    });
    
    it('should reject on failure',function(done){
      updateDisplay = false;
      
      playerActionsFactory.rebootByObject(display).catch(function(){
        expect(functionCalled).to.equal('reboot');
        expect(trackerCalled).to.not.be.ok;

        done();
      });
    });
  });

});
