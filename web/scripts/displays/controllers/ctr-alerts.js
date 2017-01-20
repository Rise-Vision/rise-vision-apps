'use strict';

angular.module('risevision.displays.controllers')
  .controller('AlertsCtrl', ['$scope', 'alertsFactory', 'ALERTS_WS_URL',
    function ($scope, alertsFactory, ALERTS_WS_URL) {
      $scope.ALERTS_WS_URL = ALERTS_WS_URL;
      alertsFactory.loadSettings();

      $scope.factory = alertsFactory;

      $scope.termsAccepted = false;
      $scope.alertsOn = false;
      if (alertsFactory.alertSettings.enabled) {
        $scope.termsAccepted = true;
        $scope.alertsOn = true;
      }

      $scope.distributeToAll = true;
      if (alertsFactory.alertSettings.distribution) {
        $scope.distributeToAll = false;
      }

      var _updateEnabled = function () {
        if ($scope.termsAccepted && $scope.alertsOn) {
          alertsFactory.alertSettings.enabled = true;
        } else {
          alertsFactory.alertSettings.enabled = false;
        }
      };

      $scope.$watch('alertsOn', function () {
        _updateEnabled();
      });

      $scope.$watch('distributeToAll', function () {
        if ($scope.distributeToAll) {
          alertsFactory.alertSettings.distribution = [];
        } else {
          alertsFactory.alertSettings.distribution = alertsFactory.alertSettings
            .distribution || [];
        }
      });

      $scope.$watch('termsAccepted', function () {
        _updateEnabled();
      });
    }
  ]); //ctr
