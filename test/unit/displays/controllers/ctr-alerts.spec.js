'use strict';
describe('controller: AlertsCrtl', function() {
  beforeEach(module('risevision.displays.controllers'));

  beforeEach(module(function ($provide) {
    $provide.value('environment', {
      ALERTS_WS_URL: 'http://www.example.com/'
    });
    $provide.factory('alertsFactory',function(){
      return {
        loadSettings: function(){},
        alertSettings: alertSettings
      };
    });    
  }));

  var $scope, alertSettings, alertsFactory, $loadSettingsSpy, $controller;
  beforeEach(function(){    
    inject(function($injector,$rootScope){
      alertSettings = {
        distribution: ['display1']
      };
      $controller = $injector.get('$controller')
      alertsFactory = $injector.get('alertsFactory');
      $loadSettingsSpy = sinon.spy(alertsFactory, 'loadSettings');
      $scope = $rootScope.$new();
      $controller('AlertsCtrl', {
        $scope: $scope
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.factory).to.be.truely;
  });

  it('should call loadSettings on init',function(){
    $loadSettingsSpy.should.have.been.called;
  });

  describe('termsAccepted and alertsOn:',function(){
   it('should set alertsOn and termsAccepted if alerts are enabled', function(){
      alertSettings.enabled = true;
      $controller('AlertsCtrl', {
        $scope: $scope
      });
      $scope.$digest();
      expect($scope.alertsOn).to.be.true;
      expect($scope.termsAccepted).to.be.true;
    });

    it('should not set alertsOn and termsAccepted if alerts are disabled', function(){
      alertSettings.enabled = false;
      $controller('AlertsCtrl', {
        $scope: $scope
      });
      $scope.$digest();
      expect($scope.alertsOn).to.be.false;
      expect($scope.termsAccepted).to.be.false;
    });

    it('should enable alerts when alertsOn and termsAccepted',function(){
      $scope.alertsOn = true;
      $scope.termsAccepted = true;
      $scope.$digest();
      expect($scope.factory.alertSettings.enabled).to.be.true;
    });

    it('should not enable alerts when alertsOn is false',function(){
      $scope.alertsOn = false;
      $scope.$digest();
      expect($scope.factory.alertSettings.enabled).to.be.false;
    });

    it('should not enable alerts when termsAccepted is false',function(){
      $scope.termsAccepted = false;
      $scope.$digest();
      expect($scope.factory.alertSettings.enabled).to.be.false;
    });
  });

  describe('distributeToAll',function(){
    it('should set distributeToAll if no distribution', function(){
      delete alertSettings.distribution;
      $controller('AlertsCtrl', {
        $scope: $scope
      });
      $scope.$digest();
      expect($scope.distributeToAll).to.be.true;
    });

    it('should not set distributeToAll if distribution is a list', function(){
      alertSettings.distribution = [];
      $controller('AlertsCtrl', {
        $scope: $scope
      });
      $scope.$digest();
      expect($scope.distributeToAll).to.be.false;
    });

    it('should set distribution to empty if distributeToAll is set',function(){
      $scope.distributeToAll = true;
      $scope.$digest();
      expect(alertSettings.distribution).to.deep.equal([]);
    });

  });

});
