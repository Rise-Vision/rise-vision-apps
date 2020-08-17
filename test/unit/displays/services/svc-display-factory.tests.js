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
    $provide.service('$modal', function() {
      return {
        open: sinon.stub().returns({result: Q.resolve()})
      }
    });
    $provide.service('$state',function(){
      return {
        go : sinon.spy()
      }
    });
    $provide.factory('userState', function() {
      return {
        isRiseAdmin: sandbox.stub().returns(false),
        _restoreState: function(){}
      }
    });
    $provide.factory('playerLicenseFactory', function() {
      return {
        toggleDisplayLicenseLocal: function () {},
        getProLicenseCount: sinon.stub(),
        areAllProLicensesUsed: sinon.stub().returns(true)
      };
    });
    $provide.factory('plansFactory', function() {
      return {
        showPlansModal: sinon.spy()
      };
    })
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });

  }));
  var displayFactory, $rootScope, $modal, $state, userState, trackerCalled, updateDisplay, returnList, 
  displayListSpy, displayAddSpy, playerLicenseFactory, plansFactory, display, processErrorCode;
  beforeEach(function(){
    trackerCalled = undefined;
    updateDisplay = true;
    returnList = null;

    inject(function($injector){
      displayFactory = $injector.get('displayFactory');
      playerLicenseFactory = $injector.get('playerLicenseFactory');
      plansFactory = $injector.get('plansFactory');
      display = $injector.get('display');
      $modal = $injector.get('$modal');
      $rootScope = $injector.get('$rootScope');
      $state = $injector.get('$state');
      userState = $injector.get('userState');
      displayListSpy = sinon.spy(display,'list');
      displayAddSpy = sinon.spy(display,'add');
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist',function(){
    expect(displayFactory).to.be.ok;
    
    expect(displayFactory.display).to.be.ok;
    expect(displayFactory.loadingDisplay).to.be.false;
    expect(displayFactory.savingDisplay).to.be.false;
    expect(displayFactory.apiError).to.not.be.ok;
    
    expect(displayFactory.init).to.be.a('function');
    expect(displayFactory.addDisplayModal).to.be.a('function');
    expect(displayFactory.getDisplay).to.be.a('function');
    expect(displayFactory.addDisplay).to.be.a('function');
    expect(displayFactory.updateDisplay).to.be.a('function');
    expect(displayFactory.deleteDisplay).to.be.a('function'); 

    expect(displayFactory.showLicenseRequired).to.be.a('function');
    expect(displayFactory.showLicenseUpdate).to.be.a('function');
    expect(displayFactory.showUnlockDisplayFeatureModal).to.be.a('function'); 
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
  });
  
  describe('addDisplayModal: ', function() {
    it('should open modal', function() {
      displayFactory.addDisplayModal();      
      
      $modal.open.should.have.been.calledWithMatch({
    	  controller: "displayAddModal",
    	  size: "lg",
    	  templateUrl: "partials/displays/display-add-modal.html"
    	});

      expect($modal.open.lastCall.args[0].resolve.downloadOnly()).to.be.falsey;
    });

    it('should open modal on download only mode', function() {
      var testDisplay = { id: 'test', name: 'test' };

      displayFactory.addDisplayModal(testDisplay);

      $modal.open.should.have.been.calledWithMatch({
    	  controller: "displayAddModal",
    	  size: "lg",
    	  templateUrl: "partials/displays/display-add-modal.html"
    	});

      expect($modal.open.lastCall.args[0].resolve.downloadOnly()).to.be.ok;
      expect(displayFactory.display).to.deep.equal(testDisplay);
    });

    it('should reset the display',function(){
      displayFactory.display.id = 'displayId';
      
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
        expect(displayFactory.display).to.be.ok;
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
        processErrorCode.should.have.been.calledWith(sinon.match.object);
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
      playerLicenseFactory.areAllProLicensesUsed.returns(false);
      display._display.playerProAuthorized = true;

      displayFactory.addDisplay();

      expect(displayFactory.savingDisplay).to.be.true;
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Created');
        broadcastSpy.should.have.been.calledWith('displayCreated', sinon.match.object);

        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;
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
          $state.go.should.not.have.been.called;

          expect(trackerCalled).to.not.be.ok;
          expect(displayFactory.savingDisplay).to.be.false;
          expect(displayFactory.loadingDisplay).to.be.false;

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

        expect(displayFactory.apiError).to.be.ok;
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
        expect(displayFactory.apiError).to.not.be.ok;
        expect(trackerCalled).to.equal('Display Deleted');

        $state.go.should.have.been.calledWith('apps.displays.list');

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
        $state.go.should.not.have.been.called;

        expect(trackerCalled).to.not.be.ok;
        expect(displayFactory.loadingDisplay).to.be.false;
        
        expect(displayFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });
  
  describe('showLicenseRequired:', function() {
    it('should not show for null display', function() {
      expect(displayFactory.showLicenseRequired(null)).to.not.be.true;
    });

    it('should show for unlicensed display', function() {
      var display = {
        playerProAuthorized: false
      };

      expect(displayFactory.showLicenseRequired(display)).to.be.true;
    });

    it('should not show for licensed display', function() {
      var display = {
        playerProAuthorized: true
      };

      expect(displayFactory.showLicenseRequired(display)).to.be.false;
    });

    it('should not show for Rise Users', function() {
      userState.isRiseAdmin.returns(true);
      var display = {
        playerProAuthorized: false
      };

      expect(displayFactory.showLicenseRequired(display)).to.be.false;
    });

  });

  describe('showLicenseUpdate:', function() {
    it('should open plans modal if user confirms and they do not have licenses', function() {
      playerLicenseFactory.getProLicenseCount.returns(0);
      displayFactory.showLicenseUpdate();

      plansFactory.showPlansModal.should.have.been.called;

      $state.go.should.not.have.been.called;
    });

    it('should show the billing page if user confirms and they have licenses', function() {
      playerLicenseFactory.getProLicenseCount.returns(1);
      displayFactory.showLicenseUpdate();

      plansFactory.showPlansModal.should.not.have.been.called;

      $state.go.should.have.been.calledWith('apps.billing.home');
    });
  });

  describe('showUnlockDisplayFeatureModal: ', function() {
    beforeEach(function() {
      sinon.stub(displayFactory, 'showLicenseRequired').returns(true);
      sinon.stub(displayFactory, 'showLicenseUpdate');
    });

    it('should not open modal and return false if a license is not required', function() {
      displayFactory.showLicenseRequired.returns(false);

      expect(displayFactory.showUnlockDisplayFeatureModal()).to.be.false;
      
      $modal.open.should.not.have.been.called;
    });

    it('should open modal if a license is required', function() {
      expect(displayFactory.showUnlockDisplayFeatureModal()).to.be.true;

      $modal.open.should.have.been.calledWithMatch({
    	  controller: "confirmModalController",
    	  size: "sm",
    	  templateUrl: "partials/displays/unlock-display-feature-modal.html"
    	});
    });

    it('should show license update if user confirms', function(done) {
      playerLicenseFactory.getProLicenseCount.returns(0);
      displayFactory.showUnlockDisplayFeatureModal();

      setTimeout(function() {
        displayFactory.showLicenseUpdate.should.have.been.called;

        done();
      }, 10);
    });

  });

});
