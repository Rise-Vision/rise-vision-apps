'use strict';

describe('controller: display add', function() {
  var displayId = '1234';
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.displays.services'));
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory', function() {
      return {
        addDisplay: sinon.spy()
      };
    });
    $provide.service('plansFactory', function() {
      return {
      };
    });
    $provide.service('scheduleFactory', function() {
      return {
        getAllDisplaysSchedule: function() {
          this.deferred = Q.defer();

          return this.deferred.promise;
        }
      };
    });
    $provide.service('$loading',function(){
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.factory('playerLicenseFactory', function() {
      return {};
    });

  }));
  var $scope, $loading, displayFactory, scheduleFactory;
  beforeEach(function(){
    inject(function($injector, $controller){
      displayFactory = $injector.get('displayFactory');
      scheduleFactory = $injector.get('scheduleFactory');
      $loading = $injector.get('$loading');

      var $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller('displayAdd', {
        $scope : $scope,
        displayFactory: displayFactory
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
    expect($scope.playerLicenseFactory).to.be.ok;
    expect($scope.selectedSchedule).to.be.null;

    expect($scope.save).to.be.a('function');
  });

  describe('All Displays Schedule:', function() {
    it('should initialize the display with the all displays schedule', function(done) {
      scheduleFactory.deferred.resolve('schedule');

      setTimeout(function() {
        expect($scope.selectedSchedule).to.equal('schedule');

        done();
      }, 10);
    });

    it('should not assign schedule if not found', function(done) {
      scheduleFactory.deferred.resolve();

      setTimeout(function() {
        expect($scope.selectedSchedule).to.be.null;

        done();
      }, 10);
    });
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

  describe('save: ',function() {
    it('should return early if the form is invalid',function(){
      $scope.displayDetails = {
        $valid: false
      };
      $scope.save();

      displayFactory.addDisplay.should.not.have.been.called;
    });

    it('should save the display',function(){
      $scope.displayDetails = {
        $valid: true
      };
      $scope.selectedSchedule = {id:123};
      $scope.save();

      displayFactory.addDisplay.should.have.been.calledWith($scope.selectedSchedule);
    });

  });

});
