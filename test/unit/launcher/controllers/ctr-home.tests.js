'use strict';
describe('controller: Home', function() {
  beforeEach(module('risevision.apps.launcher.controllers'));
  var $scope, localStorageService, localStorageGetSpy, startGlobalSpy, stopGlobalSpy, lsGetReturn;
  beforeEach(function(){
    module(function ($provide) {
      $provide.service('$loading', function() {
        return {
          startGlobal: function() {},
          stopGlobal: function(){}
        };
      });    
      $provide.service('localStorageService', function() {
        return localStorageService = {
          get: function() { return lsGetReturn; },
          set: function(){}
        };
      }); 
      $provide.service('editorFactory', function() {
        return {
          presentations: { loadingItems: true , items: { list: [ ] } }
        };
      });      
      $provide.service('displayFactory', function() {
        return {};
      });
    })
    inject(function($injector,$rootScope, $controller, localStorageService, $loading) {
      lsGetReturn = false;
      localStorageGetSpy = sinon.spy(localStorageService,'get');
      startGlobalSpy = sinon.spy($loading,'startGlobal');
      stopGlobalSpy = sinon.spy($loading,'stopGlobal');
      $scope = $rootScope.$new();
      $controller('HomeCtrl', {
        $scope: $scope,
        launcherTracker: function(){}
      });
      $scope.$digest();
    });
  });
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.launcherTracker).to.be.ok;
    expect($scope.editorFactory).to.be.ok;
    expect($scope.displayFactory).to.be.ok;
    expect($scope.showHelp).to.be.false;

    expect($scope.toggleHelp).to.be.a('function');
  });

  it("should init showHelp from localstorage",function(){
    localStorageGetSpy.should.have.been.calledWith("launcher.showHelp");
  });

  describe("loading:",function(){
    it("should show spinner on init",function(){
      startGlobalSpy.should.have.been.calledWith("launcher.loading");
    });

    it("should watch loadingPresentations",function(){
      expect($scope.$$watchers[0].exp).to.equal('editorFactory.presentations.loadingItems');
    });

    it("should hide spinner after loading presentations",function(){
      $scope.editorFactory.presentations.loadingItems = false;
      $scope.$apply();
      stopGlobalSpy.should.have.been.calledWith("launcher.loading");
    });

    it("should not flag help if user has presentations",function(){
      var spy = sinon.spy(localStorageService,'set');

      $scope.editorFactory.presentations.loadingItems = false;
      $scope.editorFactory.presentations.items.list = [{id:'id'}];

      $scope.$apply();

      spy.should.not.have.been.called;
    });

    it("should flag help if user has 0 presentations and has not set visbility of Help",function(){
      var spy = sinon.spy(localStorageService,'set');

      $scope.editorFactory.presentations.loadingItems = false;
      $scope.editorFactory.presentations.items.list = [];
      lsGetReturn = null

      $scope.$apply();
      
      spy.should.have.been.calledWith("launcher.showHelp",true);
    });

    
  });

  describe("toggleHelp:",function(){
    it("should toggle showHelp",function(){
      $scope.toggleHelp();
      expect($scope.showHelp).to.be.true;
      $scope.toggleHelp();
      expect($scope.showHelp).to.be.false;
    });

    it("should persist showHelp value",function(){
      var spy = sinon.spy(localStorageService,'set');
      $scope.toggleHelp();
      spy.should.have.been.calledWith("launcher.showHelp",true);
      $scope.toggleHelp();
      spy.should.have.been.calledWith("launcher.showHelp",false);
    });
  });
});
