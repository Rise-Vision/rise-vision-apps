'use strict';
angular.module('risevision.storage.controllers')
  .controller('StorageSelectorIFrameController', ['$scope', '$window',
    'storageUtils', 'gadgetsApi', 'selectorType', 'selectorFilter',
    function ($scope, $window, storageUtils, gadgetsApi,
      selectorType, selectorFilter) {
      $scope.selectorType = selectorType;
      $scope.selectorFilter = selectorFilter;

      var _select = function (files) {
        var fileUrls = storageUtils.getFileUrls(files);

        var data = {
          params: fileUrls[0]
        };

        console.log('Message posted to parent window', fileUrls);
        $window.parent.postMessage(fileUrls, '*');
        gadgetsApi.rpc.call('', 'rscmd_saveSettings', null, data);
      };

      $scope.$on('FileSelectAction', function (event, files) {
        if (files) {
          _select(files);
        }
      });

      $scope.dismiss = function () {
        gadgetsApi.rpc.call('', 'rscmd_closeSettings', null);
        $window.parent.postMessage('close', '*');
      };

    }
  ]);
