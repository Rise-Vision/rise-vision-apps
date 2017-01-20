(function () {
  'use strict';

  angular.module('risevision.editor.controllers')
    .controller('widgetModal', ['$scope', '$timeout', '$modalInstance',
      'gadgetsApi', 'widget',
      function ($scope, $timeout, $modalInstance, gadgetsApi, widget) {
        $scope.widgetUrl = widget.url;

        var _registerRpc = function () {
          if (gadgetsApi) {
            $timeout(function () {
              gadgetsApi.rpc.register('rscmd_saveSettings',
                saveSettings);
              gadgetsApi.rpc.register('rscmd_closeSettings',
                closeSettings);
              gadgetsApi.rpc.register('rscmd_getAdditionalParams',
                getAdditionalParams);

              gadgetsApi.rpc.setupReceiver('widget-modal-frame');
            });
          }
        };

        var getAdditionalParams = function () {
          return widget.additionalParams;
        };

        var saveSettings = function (data) {
          $modalInstance.close(data);
        };

        var closeSettings = function () {
          $modalInstance.dismiss('cancel');
        };

        _registerRpc();
      }
    ]);
}());
