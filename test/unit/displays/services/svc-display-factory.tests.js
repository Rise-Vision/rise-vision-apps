'use strict';
describe('service: displayFactory:', function() {
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('display',function () {
      return {
        _display: {
          id: "displayId",
          name: "some display",
          browserUpgradeMode: 1
        },
        list: function() {
          var deferred = Q.defer();
          if(returnList){
            deferred.resolve(returnList);
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not load list'}}});
          }
          return deferred.promise;
        },
        add : function(){
          var deferred = Q.defer();
          if(updateDisplay){
            deferred.resolve({item: this._display});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not create display'}}});
          }
          return deferred.promise;
        },
        update : function(display){
          var deferred = Q.defer();
          if(updateDisplay){
            deferred.resolve({item: this._display});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not update display'}}});
          }
          return deferred.promise;
        },
        get: function(displayId) {
          var deferred = Q.defer();
          if(updateDisplay){
            deferred.resolve({item: this._display});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not get display'}}});
          }
          return deferred.promise;
        },
        delete: function(displayId) {
          var deferred = Q.defer();
          if(updateDisplay){
            deferred.resolve(displayId);
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not delete display'}}});
          }
          return deferred.promise;
        }
      };
    });
    $provide.service('displayTracker', function() { 
      return function(name) {
        trackerCalled = name;
      };
    });
    $provide.service('displayEmail', function() {
      return {
        send: function() {
          emailSent = true;
        }
      }
    });
    $provide.service('storeAuthorization',function(){
      return {
        startTrial: function(){}
      };
    });
    $provide.value('PLAYER_PRO_PRODUCT_CODE','PLAYER_PRO_PRODUCT_CODE');
    $provide.service('$state',function(){
      return {
        go : function(state, params){
          if (state){
            currentState = state;
          }
          return currentState;
        }
      }
    });

  }));
  var displayFactory, $rootScope, $modal, trackerCalled, emailSent, updateDisplay, currentState, returnList, displayListSpy, displayAddSpy,
    storeAuthorization;
  beforeEach(function(){
    trackerCalled = undefined;
    emailSent = undefined;
    currentState = undefined;
    updateDisplay = true;
    returnList = null;

    inject(function($injector){
      displayFactory = $injector.get('displayFactory');
      storeAuthorization = $injector.get('storeAuthorization');
      var display = $injector.get('display');
      $modal = $injector.get('$modal');
      $rootScope = $injector.get('$rootScope');
      displayListSpy = sinon.spy(display,'list');
      displayAddSpy = sinon.spy(display,'add');
    });
  });

  it('should exist',function(){
    expect(displayFactory).to.be.truely;
    
    expect(displayFactory.display).to.be.truely;
    expect(displayFactory.loadingDisplay).to.be.false;
    expect(displayFactory.savingDisplay).to.be.false;
    expect(displayFactory.apiError).to.not.be.truely;
    
    expect(displayFactory.addDisplayModal).to.be.a('function');
    expect(displayFactory.getDisplay).to.be.a('function');
    expect(displayFactory.addDisplay).to.be.a('function');
    expect(displayFactory.updateDisplay).to.be.a('function');
    expect(displayFactory.deleteDisplay).to.be.a('function'); 
  });
  
  it('should initialize',function(){
    expect(displayFactory.display).to.deep.equal({
      'width': 1920,
      'height': 1080,
      'status': 1,
      'restartEnabled': true,
      'restartTime': '02:00',
      'monitoringEnabled': true,
      'useCompanyAddress': true
    });
    expect(displayFactory.displayId).to.not.be.truely;
  });
  
  describe('addDisplayModal: ', function() {
    it('should open modal', function() {
      var $modalSpy = sinon.spy($modal, 'open');
      
      displayFactory.addDisplayModal();      
      
      $modalSpy.should.have.been.calledWithMatch({
    	  controller: "displayAddModal",
    	  size: "md",
    	  templateUrl: "partials/displays/display-add-modal.html"
    	});

      expect($modalSpy.lastCall.args[0].resolve.downloadOnly()).to.be.falsey;
    });

    it('should open modal on download only mode', function() {
      var $modalSpy = sinon.spy($modal, 'open');
      var testDisplay = { id: 'test', name: 'test' };

      displayFactory.addDisplayModal(testDisplay);

      $modalSpy.should.have.been.calledWithMatch({
    	  controller: "displayAddModal",
    	  size: "md",
    	  templateUrl: "partials/displays/display-add-modal.html"
    	});

      expect($modalSpy.lastCall.args[0].resolve.downloadOnly()).to.be.truely;
      expect(displayFactory.display).to.deep.equal(testDisplay);
    });

    it('should reset the display',function(){
      displayFactory.display.id = 'displayId';
      displayFactory.displayId = 'displayId';
      
      displayFactory.addDisplayModal();
      
      expect(trackerCalled).to.equal('Add Display');
      
      expect(displayFactory.display).to.deep.equal({      
        'width': 1920,
        'height': 1080,
        'status': 1,
        'restartEnabled': true,
        'restartTime': '02:00',
        'monitoringEnabled': true,
        'useCompanyAddress': true
      });
      expect(displayFactory.displayId).to.not.be.truely;
    });
  });
    
  describe('getDisplay:',function(){
    it("should get the display",function(done){
      displayFactory.getDisplay("displayId")
      .then(function() {
        expect(displayFactory.display).to.be.truely;
        expect(displayFactory.display.name).to.equal("some display");

        setTimeout(function() {
          expect(displayFactory.loadingDisplay).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done("error");
      })
      .then(null,done);
    });
    
    it("should handle failure to get display correctly",function(done){
      updateDisplay = false;
      
      displayFactory.getDisplay()
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        expect(displayFactory.errorMessage).to.be.ok;
        expect(displayFactory.errorMessage).to.equal("Failed to Get Display.");
        expect(displayFactory.apiError).to.be.ok;
        expect(displayFactory.apiError).to.equal("ERROR; could not get display");

        setTimeout(function() {
          expect(displayFactory.loadingDisplay).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });
    
    it("showBrowserUpgradeMode: ",function(done){
      displayFactory.getDisplay("displayId")
      .then(function() {
        expect(displayFactory.showBrowserUpgradeMode).to.be.true;

        done();
      })
      .then(null, function() {
        done("error");
      })
      .then(null,done);
    });
  });
  
  describe('addDisplay:',function(){
    it('should add the display',function(done){
      updateDisplay = true;
      var broadcastSpy = sinon.spy($rootScope,'$broadcast');

      displayFactory.addDisplay();
      
      expect(displayFactory.savingDisplay).to.be.true;
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Created');
        expect(emailSent).to.be.true;
        broadcastSpy.should.have.been.calledWith('displayCreated', sinon.match.object);

        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;
        expect(displayFactory.errorMessage).to.not.be.ok;
        expect(displayFactory.apiError).to.not.be.ok;
        
        done();
      },10);
    });
    
    it('should return a promise', function(done) {
      updateDisplay = true;

      displayFactory.addDisplay().then(function() {
        setTimeout(function() {
          expect(displayFactory.loadingDisplay).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done("error");
      })
      .then(null,done);
    });

    it('should show an error if fails to create display',function(done){
      updateDisplay = false;

      displayFactory.addDisplay()
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        setTimeout(function(){
          expect(currentState).to.be.empty;
          expect(trackerCalled).to.not.be.ok;
          expect(emailSent).to.not.be.ok;
          expect(displayFactory.savingDisplay).to.be.false;
          expect(displayFactory.loadingDisplay).to.be.false;

          expect(displayFactory.errorMessage).to.be.ok;
          expect(displayFactory.apiError).to.be.ok;
          done();
        },10);
      })
      .then(null,done);
    });
  });
  
  describe('updateDisplay: ',function(){
    it('should update the display',function(done){
      updateDisplay = true;

      displayFactory.updateDisplay();
      
      expect(displayFactory.savingDisplay).to.be.true;
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Updated');
        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;
        expect(displayFactory.errorMessage).to.not.be.ok;
        expect(displayFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should show an error if fails to update the display',function(done){
      updateDisplay = false;

      displayFactory.updateDisplay();

      expect(displayFactory.savingDisplay).to.be.true;
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.not.be.ok;
        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;

        expect(displayFactory.errorMessage).to.be.ok;
        expect(displayFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });
  
  describe('deleteDisplay: ',function(){
    it('should delete the display',function(done){
      updateDisplay = true;
      
      displayFactory.deleteDisplay();
      
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(displayFactory.loadingDisplay).to.be.false;
        expect(displayFactory.errorMessage).to.not.be.ok;
        expect(displayFactory.apiError).to.not.be.ok;
        expect(trackerCalled).to.equal('Display Deleted');
        expect(currentState).to.equal('apps.displays.list');
        done();
      },10);
    });
    
    it('should show an error if fails to delete the display',function(done){
      updateDisplay = false;
      
      displayFactory.deleteDisplay();
      
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(currentState).to.be.empty;
        expect(trackerCalled).to.not.be.ok;
        expect(displayFactory.loadingDisplay).to.be.false;
        
        expect(displayFactory.errorMessage).to.be.ok;
        expect(displayFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });

  it('is3rdPartyPlayer:',function(){
    expect(displayFactory.is3rdPartyPlayer()).to.be.false;
    expect(displayFactory.is3rdPartyPlayer({playerName:''})).to.be.false;
    expect(displayFactory.is3rdPartyPlayer({playerName:'RisePlayer'})).to.be.false;
    expect(displayFactory.is3rdPartyPlayer({playerName:'RisePlayerElectron', playerVersion: '2017.07.17.20.21'})).to.be.false;
    expect(displayFactory.is3rdPartyPlayer({playerName:'RisePlayerElectron', os: 'Microsoft', playerVersion: '2017.07.17.20.21'})).to.be.false;
    expect(displayFactory.is3rdPartyPlayer({playerName:'RisePlayerPackagedApp'})).to.be.true;
    expect(displayFactory.is3rdPartyPlayer({playerName:'Cenique'})).to.be.true;
    expect(displayFactory.is3rdPartyPlayer({playerName:'Other', playerVersion: 'Cenique 2.0'})).to.be.true;
    expect(displayFactory.is3rdPartyPlayer({playerName:'Other', os: 'Android', playerVersion: '1.0'})).to.be.true;
    expect(displayFactory.is3rdPartyPlayer({playerName:'Other', os: 'cros', playerVersion: '1.0'})).to.be.true;
  });

  it('isOutdatedPlayer:',function(){
    expect(displayFactory.isOutdatedPlayer({playerName:'Cenique', playerVersion: '2017.07.17.20.21'})).to.be.false;
    expect(displayFactory.isOutdatedPlayer({playerName:'RisePlayerPackagedApp', playerVersion: '2017.07.17.20.21'})).to.be.false;

    expect(displayFactory.isOutdatedPlayer({playerName:'RisePlayer', playerVersion: '2017.07.17.20.21'})).to.be.true;
    expect(displayFactory.isOutdatedPlayer({playerName:'RisePlayer', playerVersion: '2017.01.04.14.40'})).to.be.true;

    expect(displayFactory.isOutdatedPlayer({playerName:'RisePlayerElectron', playerVersion: '2017.07.17.20.21'})).to.be.false;
    expect(displayFactory.isOutdatedPlayer({playerName:'RisePlayerElectron', playerVersion: '2017.08.04.14.40'})).to.be.false;
    expect(displayFactory.isOutdatedPlayer({playerName:'RisePlayerElectron', playerVersion: '2017.01.04.14.40'})).to.be.true;   
  });

  describe('startPlayerProTrialModal: ', function() {
    it('should open modal', function() {
      var $modalSpy = sinon.spy($modal, 'open');
      
      displayFactory.startPlayerProTrialModal(); 

      expect(trackerCalled).to.equal('Start Player Pro Trial Modal');     
      
      $modalSpy.should.have.been.calledWithMatch({
        controller: "PlayerProTrialModalCtrl",
        size: "lg",
        templateUrl: "partials/displays/player-pro-trial-modal.html"
      });
    });
  });

  describe('startPlayerProTrial: ', function() {
    it('should start trial', function(done) {
      var storeTrialSpy = sinon.stub(storeAuthorization, 'startTrial',function(){return Q.resolve()});
      var emitSpy = sinon.spy($rootScope,'$emit');
      
      displayFactory.startPlayerProTrial(); 

      expect(trackerCalled).to.equal('Starting Player Pro Trial');  
      storeTrialSpy.should.have.been.calledWith('PLAYER_PRO_PRODUCT_CODE');
      setTimeout(function(){
        expect(trackerCalled).to.equal('Started Trial Player Pro'); 
        emitSpy.should.have.been.calledWith('refreshSubscriptionStatus', 'trial-available')
        done();
      },10);      
    });

    it('should handle start trial fail', function(done) {
      var storeTrialSpy = sinon.stub(storeAuthorization, 'startTrial',function(){return Q.reject()});
      var emitSpy = sinon.spy($rootScope,'$emit');
      
      displayFactory.startPlayerProTrial(); 

      expect(trackerCalled).to.equal('Starting Player Pro Trial');  
      storeTrialSpy.should.have.been.calledWith('PLAYER_PRO_PRODUCT_CODE');
      setTimeout(function(){
        expect(trackerCalled).to.not.equal('Started Trial Player Pro'); 
        emitSpy.should.not.have.been.calledWith('refreshSubscriptionStatus', 'trial-available')
        done();
      },10);      
    });
  });
});
