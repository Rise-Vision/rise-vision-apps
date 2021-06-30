'use strict';
angular.module('risevision.displays.controllers')
  .controller('DisplayControlModalCtrl', ['$scope', '$modalInstance',
    'displayControlFactory',
    function ($scope, $modalInstance, displayControlFactory) {
      $scope.formData = {};

      var _loadConfiguration = function () {
        $scope.loading = true;

        displayControlFactory.getConfiguration()
          .then(function (config) {
            $scope.formData.displayControlContents = config;
          })
          .catch(function (err) {
            console.log('Failed to load config; showing default', err);
            $scope.resetForm();
          })
          .finally(function () {
            $scope.loading = false;
          });
      };

      _loadConfiguration();

      $scope.saveConfiguration = function () {
        $scope.loading = true;

        displayControlFactory.updateConfiguration($scope.formData.displayControlContents)
          .then(function () {
            $modalInstance.close();
          })
          .catch(function (err) {
            console.log('Failed to save configuration file', err);
          })
          .finally(function () {
            $scope.loading = false;
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
