'use strict';
angular.module('risevision.displays.controllers')
  .controller('DisplayControlModalCtrl', ['$scope', '$modalInstance',
    'displayControlFactory', '$loading',
    function ($scope, $modalInstance, displayControlFactory, $loading) {
      $scope.formData = {};

      var _loadConfiguration = function () {
        displayControlFactory.getConfiguration()
          .then(function (config) {
            $scope.formData.displayControlContents = config;
          })
          .catch(function (err) {
            console.log('Failed to load config; showing default', err);
            $scope.resetForm();
          });
      };

      _loadConfiguration();

      $scope.saveConfiguration = function () {
        $loading.start('saving-display-control');

        displayControlFactory.updateConfiguration($scope.formData.displayControlContents)
          .then(function () {
            $modalInstance.close();
          })
          .catch(function (err) {
            console.log('Failed to save configuration file', err);
          })
          .finally(function () {
            $loading.stop('saving-display-control');
          });
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      $scope.resetForm = function () {
        $scope.formData.displayControlContents = displayControlFactory.getDefaultConfiguration();
      };
    }
  ]);
