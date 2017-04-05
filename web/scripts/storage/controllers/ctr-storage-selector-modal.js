'use strict';
angular.module('risevision.storage.controllers')
  .controller('StorageSelectorModalController', ['$scope', '$modalInstance', 
  'storageUtils', 'enableByURL', 'selectorType', 'selectorFilter',
    function ($scope, $modalInstance, storageUtils, enableByURL, selectorType, 
      selectorFilter) {
      $scope.enableByURL = enableByURL;
      $scope.selectorType = selectorType;
      $scope.selectorFilter = selectorFilter;
      
      $scope.selectByUrl = function () {
        // send blank response to indicate By Url selection
        $modalInstance.close();
      }

      var _select = function (files) {
        $modalInstance.close(files);
      };

      $scope.$on('FileSelectAction', function (event, files) {
        if (files) {
          _select(files);
        }
      });

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]);
