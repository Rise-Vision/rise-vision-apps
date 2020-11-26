'use strict';
describe('controller: app', function() {
  beforeEach(module('risevision.apps.controllers'));
  beforeEach(module(function ($provide) {
    $provide.factory('$state',function(){
      return {
        current: {
          name: 'apps.display.alerts'
        },
        href: function() {}
      };
    });
  }));

  var $scope,$state,rootScope;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $state = $injector.get('$state');
      rootScope = $rootScope;
      $scope = $rootScope.$new();
      $controller('AppCtrl', {
        $scope: $scope,
        $rootScope : $rootScope,
        $state: $injector.get('$state')
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.hideCommonHeader).to.be.true;
    expect($scope.navOptions).to.be.ok;
    expect($scope.navSelected).to.be.ok;
  });

  it('should update $scope.navSelected based on state',function(){
    expect($scope.navSelected).to.equal('apps.editor.home');
    rootScope.$broadcast('$stateChangeSuccess');
    expect($scope.navSelected).to.equal('apps.display.alerts');
  });

  describe('hideCommonHeader', function() {
    it('should hide CH on login page',function(){
      $state.current.name = 'common.auth.unauthorized';
      rootScope.$broadcast('$stateChangeSuccess');
      expect($scope.hideCommonHeader).to.be.true;
    });

    it('should hide CH on invoice page',function(){
      $state.current.name = 'apps.billing.invoice';
      rootScope.$broadcast('$stateChangeSuccess');
      expect($scope.hideCommonHeader).to.be.true;
    });

    it('should hide CH on unpaid invoices page',function(){
      $state.current.name = 'apps.billing.unpaid';
      rootScope.$broadcast('$stateChangeSuccess');
      expect($scope.hideCommonHeader).to.be.true;
    });

    it('should show CH otherwise',function(){
      $state.current.name = 'apps.home';
      rootScope.$broadcast('$stateChangeSuccess');
      expect($scope.hideCommonHeader).to.be.false;
    });
  });

});
