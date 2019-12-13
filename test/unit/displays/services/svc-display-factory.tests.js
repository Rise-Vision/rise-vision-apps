'use strict';
describe('service: displayFactory:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('display',function () {
      return {
        _display: {
          id: "displayId",
          name: "some display"
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
    $provide.factory('playerLicenseFactory', function() {
      return {
        toggleDisplayLicenseLocal: function () {},
        areAllProLicensesUsed: function () {}
      };
    });
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });
    $provide.service('storeService', function() {
      return {
        validateAddress: sandbox.spy(function(displayId) {
          var deferred = Q.defer();
          if(validateAddress){
            deferred.resolve();
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not validate address'}}});
          }
          return deferred.promise;
        })
      }
    });
  }));
  var displayFactory, $rootScope, $modal, trackerCalled, updateDisplay, currentState, returnList, 
  displayListSpy, displayAddSpy, playerLicenseFactory, display, processErrorCode, validateAddress, storeService;
  beforeEach(function(){
    trackerCalled = undefined;
    currentState = undefined;
    updateDisplay = true;
    validateAddress = true;
    returnList = null;

    inject(function($injector){
      displayFactory = $injector.get('displayFactory');
      playerLicenseFactory = $injector.get('playerLicenseFactory');
      storeService = $injector.get('storeService');
      display = $injector.get('display');
      $modal = $injector.get('$modal');
      $rootScope = $injector.get('$rootScope');
      displayListSpy = sinon.spy(display,'list');
      displayAddSpy = sinon.spy(display,'add');
    });
  });

  afterEach(function () {
    sandbox.restore();
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

    it('should set the display to parameter if it exists',function(){
      var testDisplay = { id: 'test', name: 'test' };
      
      displayFactory.addDisplayModal(testDisplay);
      
      expect(trackerCalled).to.equal('Add Display');
      
      expect(displayFactory.display).to.deep.equal(testDisplay);
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
        expect(displayFactory.errorMessage).to.equal("Failed to get Display.");
        processErrorCode.should.have.been.calledWith('Display', 'get', sinon.match.object);
        expect(displayFactory.apiError).to.be.ok;

        setTimeout(function() {
          expect(displayFactory.loadingDisplay).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });

  });
  
  describe('addDisplay:',function(){
    it('should add the display',function(done){
      updateDisplay = true;
      var broadcastSpy = sinon.spy($rootScope,'$broadcast');
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');
      sandbox.stub(playerLicenseFactory, 'areAllProLicensesUsed').returns(false);
      display._display.playerProAuthorized = true;

      displayFactory.addDisplay();

      expect(displayFactory.savingDisplay).to.be.true;
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Created');
        broadcastSpy.should.have.been.calledWith('displayCreated', sinon.match.object);

        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;
        expect(displayFactory.errorMessage).to.not.be.ok;
        expect(displayFactory.apiError).to.not.be.ok;
        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(true);
        
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

    beforeEach(function(){
      displayFactory.display.country = 'CA';
    });

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

        expect(displayFactory.errorMessage).to.equal("Failed to update Display.");
        expect(displayFactory.apiError).to.be.ok;
        done();
      },10);
    });

    it('should validate the address if not using company address',function(done){
      updateDisplay = true;
      displayFactory.display.useCompanyAddress = false;
      validateAddress = false;

      displayFactory.updateDisplay();
      storeService.validateAddress.should.have.been.called;
      
      expect(displayFactory.savingDisplay).to.be.true;
      expect(displayFactory.loadingDisplay).to.be.true;


      setTimeout(function(){
        expect(trackerCalled).to.not.be.ok;
        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;

        expect(displayFactory.errorMessage).to.equal("We couldn\'t update your address.");
        expect(displayFactory.apiError).to.be.ok;
        done();
      },10);
    });

    it('should follow validation result from storeService',function(done){
      updateDisplay = true;
      displayFactory.display.useCompanyAddress = false;
      validateAddress = true;

      displayFactory.updateDisplay();
      storeService.validateAddress.should.have.been.called;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Updated');
        done();
      },10);
    });

    it('should not validate the address if using company address',function(done){
      updateDisplay = true;
      displayFactory.display.useCompanyAddress = true;

      displayFactory.updateDisplay();

      storeService.validateAddress.should.not.have.been.called;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Updated');
        done();
      },10);
    });

    it('should flag empty address',function(done){
      updateDisplay = true;
      validateAddress = false;
      displayFactory.display.useCompanyAddress = false;
      displayFactory.display.country = '';

      displayFactory.updateDisplay();

      storeService.validateAddress.should.have.been.called;

      setTimeout(function(){
        expect(displayFactory.errorMessage).to.equal("We couldn\'t update your address.");
        done();
      },10);
    });

    it('should skip validation if country is not US or CA',function(done){
      updateDisplay = true;
      displayFactory.display.useCompanyAddress = false;
      displayFactory.display.country = 'AR';

      displayFactory.updateDisplay();

      storeService.validateAddress.should.not.have.been.called;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Updated');
        done();
      },10);
    });


  });
  
  describe('deleteDisplay: ',function(){
    it('should delete the display and unassign its license',function(done){
      displayFactory.display.playerProAssigned = true;
      updateDisplay = true;
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');

      displayFactory.deleteDisplay();
      
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(displayFactory.loadingDisplay).to.be.false;
        expect(displayFactory.errorMessage).to.not.be.ok;
        expect(displayFactory.apiError).to.not.be.ok;
        expect(trackerCalled).to.equal('Display Deleted');
        expect(currentState).to.equal('apps.displays.list');
        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(false);
        done();
      },10);
    });

    it('should not unassign its license if not licensed',function(done){
      displayFactory.display.playerProAssigned = false;
      updateDisplay = true;
      sandbox.stub(playerLicenseFactory, 'toggleDisplayLicenseLocal');

      displayFactory.deleteDisplay();
      

      setTimeout(function(){
        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.not.have.been.called;

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

});
