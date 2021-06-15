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
        current: {},
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
        toggleDisplayLicenseLocal: sinon.stub(),
        getProLicenseCount: sinon.stub(),
        areAllProLicensesUsed: sinon.stub().returns(true),
        isProAvailable: sinon.stub().returns(false),
        updateDisplayLicense: sinon.stub().returns(Q.resolve())
      };
    });
    $provide.factory('scheduleFactory', function() {
      return {
        addToDistribution: sinon.stub().returns(Q.resolve())
      };
    });
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });

  }));
  var displayFactory, $rootScope, $state, userState, trackerCalled, updateDisplay, returnList, 
  displayListSpy, displayAddSpy, playerLicenseFactory, display, scheduleFactory, processErrorCode;
  beforeEach(function(){
    trackerCalled = undefined;
    updateDisplay = true;
    returnList = null;

    inject(function($injector){
      displayFactory = $injector.get('displayFactory');
      playerLicenseFactory = $injector.get('playerLicenseFactory');
      display = $injector.get('display');
      scheduleFactory = $injector.get('scheduleFactory');
      $rootScope = $injector.get('$rootScope');
      $state = $injector.get('$state');
      userState = $injector.get('userState');
      displayListSpy = sinon.spy(display,'list');
      displayAddSpy = sinon.spy(display,'add');

      sinon.spy($rootScope, '$broadcast');
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
    expect(displayFactory.newDisplay).to.be.a('function');
    expect(displayFactory.getDisplay).to.be.a('function');
    expect(displayFactory.addDisplay).to.be.a('function');
    expect(displayFactory.updateDisplay).to.be.a('function');
    expect(displayFactory.deleteDisplayByObject).to.be.a('function'); 
    expect(displayFactory.deleteDisplay).to.be.a('function'); 

    expect(displayFactory.showLicenseRequired).to.be.a('function');
  });
  
  it('should initialize',function(){
    expect(displayFactory.display).to.deep.equal({
      'name': 'New Display',
      'width': 1920,
      'height': 1080,
      'status': 1,
      'restartEnabled': true,
      'restartTime': '02:00',
      'monitoringEnabled': true,
      'useCompanyAddress': true,
      'playerProAssigned': false,
      'playerProAuthorized': false
    });
  });
  
  describe('newDisplay: ', function() {
    it('should reset the display',function(){
      displayFactory.display.id = 'displayId';
      
      displayFactory.newDisplay();
      
      expect(trackerCalled).to.equal('Add Display');
      
      expect(displayFactory.display).to.deep.equal({      
        'name': 'New Display',
        'width': 1920,
        'height': 1080,
        'status': 1,
        'restartEnabled': true,
        'restartTime': '02:00',
        'monitoringEnabled': true,
        'useCompanyAddress': true,
        'playerProAssigned': false,
        'playerProAuthorized': false
      });
    });

    it('should update license if available',function(){
      playerLicenseFactory.isProAvailable.returns(true);
      
      displayFactory.newDisplay();
      
      expect(displayFactory.display).to.deep.equal({      
        'name': 'New Display',
        'width': 1920,
        'height': 1080,
        'status': 1,
        'restartEnabled': true,
        'restartTime': '02:00',
        'monitoringEnabled': true,
        'useCompanyAddress': true,
        'playerProAssigned': true,
        'playerProAuthorized': true
      });
    });

  });
    
  describe('getDisplay:',function(){
    it("should get the display",function(done){
      displayFactory.getDisplay("displayId")
      .then(function() {
        expect(displayFactory.display).to.be.ok;
        expect(displayFactory.display.name).to.equal("some display");
        expect(displayFactory.display.originalPlayerProAuthorized).to.equal(displayFactory.display.playerProAuthorized);

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
      playerLicenseFactory.areAllProLicensesUsed.returns(false);
      display._display.playerProAuthorized = true;

      displayFactory.addDisplay();

      expect(displayFactory.savingDisplay).to.be.true;
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        $state.go.should.not.have.been.called;

        expect(trackerCalled).to.equal('Display Created');
        $rootScope.$broadcast.should.have.been.calledWith('displayCreated', sinon.match.object);

        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;
        expect(displayFactory.apiError).to.not.be.ok;
        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.not.have.been.called;
        
        done();
      },10);
    });

    it('should only redirect from apps.displays.add',function(done){
      $state.current.name = 'apps.displays.add';
      updateDisplay = true;

      displayFactory.addDisplay();

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.displays.details');

        done();
      },10);
    });

    it('should toggle license locally if display License was enabled',function(done){
      updateDisplay = true;
      playerLicenseFactory.areAllProLicensesUsed.returns(false);
      display._display.playerProAuthorized = true;

      displayFactory.display.playerProAuthorized = true;

      displayFactory.addDisplay();

      setTimeout(function(){
        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.called;
        
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

    it('should add display to distribution',function(done){
      updateDisplay = true;

      displayFactory.addDisplay('selectedSchedule');

      setTimeout(function(){
        expect(scheduleFactory.addToDistribution).to.have.been.calledWith(display._display, 'selectedSchedule');
        
        done();
      },10);
    });

    it('should handle failure to add display to distribution',function(done){
      $state.current.name = 'apps.displays.add';
      updateDisplay = true;

      scheduleFactory.addToDistribution.returns(Q.reject());
      scheduleFactory.apiError = 'scheduleApiError';

      displayFactory.addDisplay();

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Created');
        $rootScope.$broadcast.should.have.been.calledWith('displayCreated', sinon.match.object);

        $state.go.should.not.have.been.called;

        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;

        expect(displayFactory.apiError).to.equal('scheduleApiError');        

        done();
      },10);
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

    it('should update license if changed', function(done) {
      updateDisplay = true;
      displayFactory.display.originalPlayerProAuthorized = false;
      displayFactory.display.playerProAuthorized = true;

      displayFactory.updateDisplay();
      
      setTimeout(function(){
        expect(playerLicenseFactory.updateDisplayLicense).to.have.been.called;
        expect(displayFactory.display.originalPlayerProAuthorized).to.be.true;

        expect(displayFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should not update license if not changed', function(done) {
      updateDisplay = true;
      displayFactory.display.originalPlayerProAuthorized = true;
      displayFactory.display.playerProAuthorized = true;

      displayFactory.updateDisplay();
      
      setTimeout(function(){
        expect(playerLicenseFactory.updateDisplayLicense).to.not.have.been.called;
        expect(displayFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should handle error on updating license', function(done) {
      updateDisplay = true;
      displayFactory.display.originalPlayerProAuthorized = false;
      displayFactory.display.playerProAuthorized = true;

      playerLicenseFactory.updateDisplayLicense.returns(Q.reject());

      displayFactory.updateDisplay();
      
      setTimeout(function(){        
        expect(displayFactory.apiError).to.equal('error');  
        done();
      },10);
    });

    it('should add display to distribution',function(done){
      updateDisplay = true;

      displayFactory.updateDisplay('selectedSchedule');

      setTimeout(function(){
        expect(scheduleFactory.addToDistribution).to.have.been.calledWith(displayFactory.display, 'selectedSchedule');
        
        done();
      },10);
    });

    it('should handle failure to add display to distribution',function(done){
      updateDisplay = true;

      scheduleFactory.addToDistribution.returns(Q.reject());
      scheduleFactory.apiError = 'scheduleApiError';

      displayFactory.updateDisplay();

      setTimeout(function(){
        expect(trackerCalled).to.equal('Display Updated');

        expect(displayFactory.savingDisplay).to.be.false;
        expect(displayFactory.loadingDisplay).to.be.false;

        expect(displayFactory.apiError).to.equal('scheduleApiError');        

        done();
      },10);
    });

  });

  describe('applyFields:',function(){
    var display, updatedFields;

    beforeEach(function(){
      display = {id: '123'};
      updatedFields = {name: 'New Name'};
    });

    it('should update the display and populate new fields',function(done){
      updateDisplay = true;

      displayFactory.applyFields(display, updatedFields).then(function() {
        expect(trackerCalled).to.equal('Display Updated');
        expect(display.name).to.equal('New Name');
        done();
      });
    });

    it('should reject and not populate new fields on failure',function(done){
      updateDisplay = false;

      displayFactory.applyFields(display, updatedFields).catch(function() {
        expect(display.name).not.be.ok;
        expect(trackerCalled).to.not.equal('Display Updated');
        done();
      });
    });
  });
  
  describe('deleteDisplayByObject: ',function(){
    it('should delete the display and unassign its license',function(done){
      updateDisplay = true;

      displayFactory.deleteDisplayByObject({
        id: 'displayId',
        playerProAssigned: true
      }).then(function(){
        expect(trackerCalled).to.equal('Display Deleted');

        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.have.been.calledWith(false);
        done();
      }, function() {
        done('error');
      });
    });

    it('should not unassign its license if not licensed',function(done){
      updateDisplay = true;

      displayFactory.deleteDisplayByObject({
        id: 'displayId',
        playerProAssigned: false
      }).then(function(){
        expect(playerLicenseFactory.toggleDisplayLicenseLocal).to.not.have.been.called;

        done();
      }, function() {
        done('error');
      });
    });
    
    it('should show an error if fails to delete the display',function(done){
      updateDisplay = false;
      
      displayFactory.deleteDisplayByObject({
        id: 'displayId'
      }).then(function(){
        done('error');
      }, function() {
        done();
      });
    });
  });

  describe('deleteDisplay: ',function(){
    beforeEach(function() {
      sandbox.stub(displayFactory, 'deleteDisplayByObject').returns(Q.resolve());
    });

    it('should show spinner and redirect',function(done){
      displayFactory.deleteDisplay();
      
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        expect(displayFactory.loadingDisplay).to.be.false;
        expect(displayFactory.apiError).to.not.be.ok;

        $state.go.should.have.been.calledWith('apps.displays.list');

        done();
      },10);
    });
    
    it('should show an error if fails to delete the display',function(done){
      displayFactory.deleteDisplayByObject.returns(Q.reject());
      
      displayFactory.deleteDisplay();
      
      expect(displayFactory.loadingDisplay).to.be.true;

      setTimeout(function(){
        $state.go.should.not.have.been.called;

        expect(displayFactory.loadingDisplay).to.be.false;
        
        expect(displayFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });
  
  describe('showLicenseRequired:', function() {
    it('should use factory display if parameter is null', function() {
      displayFactory.display = {
        playerProAuthorized: true
      };

      expect(displayFactory.showLicenseRequired()).to.be.false;
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


});
