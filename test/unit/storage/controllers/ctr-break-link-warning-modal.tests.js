'use strict';

describe('controller: BreakLinkWarningModalCtrl', function() {
  var $scope, $modalInstance, localStorageService, controller;
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.storage.controllers'));

  beforeEach(function() {
    module(function($provide) {
      $provide.service('$modalInstance',function(){
        return {
          close : function(action){},
          dismiss : function(action){}
        };
      });

      $provide.service('localStorageService', function() {
        return {
          get: function() {},
          set: function() {}
        };
      });
    });
  });

  beforeEach(function() {
    inject(function ($controller, $rootScope, $injector) {
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      localStorageService = $injector.get('localStorageService');

      controller = $controller('BreakLinkWarningModalCtrl', {
        $scope: $scope,
        $modalInstance: $modalInstance,
        localStorageService: localStorageService,
        infoLine1Key: '',
        infoLine2Key: '',
        localStorageKey: 'breakingLinkWarning.hideWarning'
      });

      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.ok).to.be.a('function');
    expect($scope.cancel).to.be.a('function');
  });

  describe('proceed: ', function() {
    it('should save the chosen option', function() {
      sandbox.spy($modalInstance, 'close');
      sandbox.spy(localStorageService, 'get');
      sandbox.spy(localStorageService, 'set');

      $scope.hideWarning = true;
      $scope.ok();

      $modalInstance.close.should.have.been.called;
      localStorageService.get.should.not.have.been.called;
      localStorageService.set.should.have.been.called;
      expect(localStorageService.set.getCall(0).args[0]).to.equal('breakingLinkWarning.hideWarning');
      expect(localStorageService.set.getCall(0).args[1]).to.equal(true);
    });
  });

  describe('cancel:',function(){
    it('should close modal',function(){
      sandbox.spy($modalInstance, 'dismiss');
      $scope.cancel();

      $modalInstance.dismiss.should.have.been.called;
    });
  });
});
