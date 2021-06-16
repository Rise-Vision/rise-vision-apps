'use strict';

describe('controller: display details', function() {
  var displayId = '1234';
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('displayFactory', function() {
      return {
        display: {
          id: 123
        },
        getDisplay: function(displayId) {
          this.display.id = displayId;
          this.display.companyId = 'company';

          return Q.resolve({});
        },
        updateDisplay : function(){
          updateCalled = true;

          return Q.resolve();
        },
        deleteDisplay: function() {
          deleteCalled = true;
        },
        hasSchedule: function(display) {
          return display.scheduleId;
        }
      };
    });
    $provide.factory('confirmModal', function() {
      return sandbox.stub().returns(Q.resolve());
    });
    $provide.service('$loading',function(){
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });

    $provide.service('$state', function() {
      return {
        go: sandbox.stub()
      }
    });
    $provide.service('screenshotFactory', function() {
      return {
        loadScreenshot: sandbox.stub()
      }
    });
    $provide.factory('playerLicenseFactory', function() {
      return {};
    });
    $provide.factory('processErrorCode', function() {
      return function(error) {
        return 'processed ' + error;
      };
    });
    $provide.value('displayId', displayId);
  }));
  var $scope, $state, updateCalled, deleteCalled, confirmDelete,
  $loading, displayFactory, playerLicenseFactory;
  beforeEach(function(){
    updateCalled = false;
    deleteCalled = false;

    inject(function($injector, $rootScope, $controller){
      displayFactory = $injector.get('displayFactory');
      playerLicenseFactory = $injector.get('playerLicenseFactory');
      $loading = $injector.get('$loading');
      $scope = $rootScope.$new();
      $controller('displayDetails', {
        $scope : $scope,
        displayFactory: displayFactory,
        $state : $state,
        $log : $injector.get('$log')
      });
      $scope.$digest();
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist',function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.selectedSchedule).to.be.null;

    expect($scope.save).to.be.a('function');
    expect($scope.confirmDelete).to.be.a('function');
  });

  it('should initialize', function(done) {
    setTimeout(function() {
      expect($scope.selectedSchedule).to.be.null;

      done();
    }, 10);
  });

  it('should initialize a display with assigned schedule', function(done) {
    displayFactory.display.scheduleId = 'scheduleId';
    displayFactory.display.scheduleName = 'scheduleName';

    setTimeout(function() {
      expect($scope.selectedSchedule).to.deep.equal({
        id: 'scheduleId',
        name: 'scheduleName',
        companyId: 'company'
      });

      done();
    }, 10);
  });

  describe('spinner:', function() {
    it('should show spinner when saving display', function() {
      $loading.start.should.have.not.been.called;
      displayFactory.loadingDisplay = true;
      $scope.$digest();
      $loading.start.should.have.been.calledWith('display-loader');
    });

    it('should hide spinner when finished saving display', function() {
      $loading.stop.reset();
      displayFactory.loadingDisplay = false;
      $scope.$digest();
      $loading.stop.should.have.been.calledWith('display-loader');
    });
  });

  describe('submit: ',function() {
    it('should return early if the form is invalid',function(){
      $scope.displayDetails = {
        useCompanyAddress: {}
      };
      $scope.displayDetails.$valid = false;
      $scope.save();

      expect(updateCalled).to.be.false;
    });

    it('should save the display',function(){
      $scope.displayDetails = {
        useCompanyAddress: {}
      };
      $scope.displayDetails.$valid = true;
      $scope.save();

      expect(updateCalled).to.be.true;
    });

    it('should change/update schedule on save success',function(done){
      $scope.selectedSchedule = {id: 'selectedSchedule'};
      $scope.displayDetails = {};
      $scope.displayDetails.$valid = true;
      $scope.save()

      setTimeout(function() {
        expect(updateCalled).to.be.true;

        done();
      },10);
    });

  });

  describe('delete: ',function() {
    beforeEach(function() {
      confirmDelete = false;
    });

    it('should return early the user does not confirm',function(){
      $scope.confirmDelete();

      expect(deleteCalled).to.be.false;
    });

    it('should delete the display',function(done){
      confirmDelete = true;

      $scope.confirmDelete();

      setTimeout(function() {
        expect(deleteCalled).to.be.true;

        done();
      }, 10);
    });
  });

});
