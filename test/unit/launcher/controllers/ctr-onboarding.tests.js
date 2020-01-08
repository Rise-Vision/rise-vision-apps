'use strict';
describe('controller: Onboarding', function() {
  beforeEach(module('risevision.apps.launcher.controllers'));
  var $scope, $loading, onboardingFactory, editorFactory;
  beforeEach(function(){
    module(function ($provide) {
      $provide.service('$loading', function() {
        return {
          start: sinon.spy(),
          stop: sinon.spy()
        };
      });
      $provide.service('onboardingFactory', function() {
        return {
          refresh: sinon.spy()
        };
      });
      $provide.service('editorFactory', function() {
        return {
          addFromProduct: sinon.spy()
        };
      });
    })
    inject(function($injector,$rootScope, $controller) {
      onboardingFactory = $injector.get('onboardingFactory');
      editorFactory = $injector.get('editorFactory');
      $loading = $injector.get('$loading');

      $scope = $rootScope.$new();
      $controller('OnboardingCtrl', {
        $scope: $scope
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.editorFactory).to.be.ok;
    expect($scope.featuredTemplates).to.be.an('array');
    expect($scope.featuredTemplates).to.have.length(3);

    expect($scope.select).to.be.a('function');
  });

  it('select:', function() {
    $scope.select('product');

    editorFactory.addFromProduct.should.have.been.calledWith('product');
  });

  describe('spinner:', function() {
    it("should hide spinner",function(){
      $loading.stop.should.have.been.calledWith('onboarding-loader');
    });

    it("should show spinner when loading",function(){
      onboardingFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith('onboarding-loader');
    });

    it("should hide spinner when load is complete",function(){
      onboardingFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
      $loading.stop.should.have.been.calledWith('onboarding-loader');
    });    
  });

});
