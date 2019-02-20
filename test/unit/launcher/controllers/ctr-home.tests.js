'use strict';
describe('controller: Home', function() {
  beforeEach(module('risevision.apps.launcher.controllers'));
  var $scope, $loading, launcherFactory;
  beforeEach(function(){
    module(function ($provide) {
      $provide.service('$loading', function() {
        return $loading = {
          startGlobal: sinon.spy(),
          stopGlobal: sinon.spy(),
          stop: sinon.spy()
        };
      });
      $provide.service('launcherFactory', function() {
        return launcherFactory = {
          load: sinon.spy(),
          presentations: { loadingItems: true , items: { list: [ ] } },
          schedules: { loadingItems: true , items: { list: [ ] } },
          displays: { loadingItems: true , items: { list: [ ] } }
        };
      });
      $provide.service('editorFactory', function() {
        return {};
      });
      $provide.service('displayFactory', function() {
        return {};
      });
      $provide.service('presentationUtils', function() {
        return {
          openPresentation: sinon.stub()
        };
      });
    })
    inject(function($injector,$rootScope, $controller) {
      $scope = $rootScope.$new();
      $controller('HomeCtrl', {
        $scope: $scope
      });
      $scope.$digest();
    });
  });
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.launcherFactory).to.be.ok;
    expect($scope.editorFactory).to.be.ok;
    expect($scope.displayFactory).to.be.ok;
  });

  describe("loading:",function(){
    it("should load launcher lists",function(){
      launcherFactory.load.should.have.been.called;
    });

    it("should show spinner on init",function(){
      $loading.startGlobal.should.have.been.calledWith("launcher.loading");
    });

    it("should add watchers",function(){
      expect($scope.$$watchers[0].exp).to.equal('launcherFactory.displays.loadingItems');
      expect($scope.$$watchers[1].exp).to.equal('launcherFactory.schedules.loadingItems');
      expect($scope.$$watchers[2].exp).to.equal('launcherFactory.presentations.loadingItems');
    });

    it("should hide spinner and global spinner after loading presentations",function(){
      $scope.launcherFactory.presentations.loadingItems = false;
      $scope.$apply();
      $loading.stopGlobal.should.have.been.calledWith("launcher.loading");
      $loading.stop.should.have.been.calledWith("presentation-list-loader");
    });

    it("should hide spinner after loading schedules",function(){
      $scope.launcherFactory.schedules.loadingItems = false;
      $scope.$apply();
      $loading.stopGlobal.should.not.have.been.calledWith("launcher.loading");
      $loading.stop.should.have.been.calledWith("schedules-list-loader");
    });

    it("should hide spinner after loading displays",function(){
      $scope.launcherFactory.displays.loadingItems = false;
      $scope.$apply();
      $loading.stopGlobal.should.not.have.been.calledWith("launcher.loading");
      $loading.stop.should.have.been.calledWith("displays-list-loader");
    });

  });

});
