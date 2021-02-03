(function () {
  'use strict';

  angular.module('risevision.editor.controllers')
    .controller('widgetModal', ['$scope', '$timeout', '$modalInstance',
      '$loading', 'gadgetsApi', 'widget',
      function ($scope, $timeout, $modalInstance, $loading, gadgetsApi,
        widget) {
        $scope.widgetUrl = widget.url;

        var _registerRpc = function () {
          if (gadgetsApi) {
            $timeout(function () {
              gadgetsApi.rpc.register('rscmd_saveSettings',
                _saveSettings);
              gadgetsApi.rpc.register('rscmd_closeSettings',
                _closeSettings);
              gadgetsApi.rpc.register('rscmd_getAdditionalParams',
                _getAdditionalParams);

              gadgetsApi.rpc.setupReceiver('widget-modal-frame');
            });
          }
        };

        var _stopLoader = function () {
          $loading.stop('widget-modal-loader');

          $scope.$digest();
        };

        var _init = function () {
          $timeout(_stopLoader, 3000);

          _registerRpc();
        };

        var _getAdditionalParams = function () {
          _stopLoader();

          return widget.additionalParams;
        };

        var _saveSettings = function (data) {
          $modalInstance.close(data);
        };

        var _closeSettings = function () {
          $modalInstance.dismiss('cancel');
        };

        _init();
      }
    ]);
}());
