'use strict';

describe('controller: GetStartedCtrl', function() {
  var $scope, localStorageService, initializeController, completed;
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.apps.launcher.controllers'));

  beforeEach(function() {
    module(function($provide) {
      $provide.service('localStorageService', function() {
        return {
          get: sinon.spy(function() {
            return completed ? 'true': '';
          }),
          set: sinon.spy()
        };
      });
    });
  });

  beforeEach(function() {
    inject(function ($controller, $rootScope, $injector) {
      initializeController = function() {
        $scope = $rootScope.$new();
        localStorageService = $injector.get('localStorageService');

        var controller = $controller('GetStartedCtrl', {
          $scope: $scope,
          localStorageService: localStorageService,
        });

        $scope.$digest();

        return controller;
      }
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    initializeController();

    expect($scope).to.be.ok;
    expect($scope.nextStep).to.be.a('function');

    localStorageService.get.should.have.been.calledWith('getStartedCTA.completed');
  });

  describe('new user: ', function() {
    beforeEach(function() {
      initializeController();
    });

    it('should initialize', function() {
      expect($scope.currentStep).to.equal(1);
    })

    describe('nextStep: ', function() {
      it('should increment', function() {
        $scope.nextStep();

        expect($scope.currentStep).to.equal(2);

        localStorageService.set.should.not.have.been.called;
      });

      it('should update local storage value', function() {
        $scope.nextStep();
        $scope.nextStep();
        $scope.nextStep();

        expect($scope.currentStep).to.equal(4);

        localStorageService.set.should.have.been.calledWith('getStartedCTA.completed', 'true');
      });

    });
  });

  describe('returning user: ', function() {
    beforeEach(function() {
      completed = true;

      initializeController();
    });

    it('should initialize', function() {
      expect($scope.currentStep).to.equal(4);
    })

  });
});
