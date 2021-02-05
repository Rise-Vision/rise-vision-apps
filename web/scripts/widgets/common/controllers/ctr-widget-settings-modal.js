(function () {
  'use strict';

  angular.module('risevision.widgets.controllers')
    .controller('WidgetSettingsModalController', ['$scope', '$modalInstance',
      'settingsSaver', 'settingsGetter', 'widget',
      function ($scope, $modalInstance, settingsSaver, settingsGetter, widget) {

        $scope.settings = {
          params: {},
          additionalParams: {}
        };
        $scope.alerts = [];

        var _loadAdditionalParams = function () {
          var additionalParams = settingsGetter.getAdditionalParams(widget.additionalParams);

          $scope.settings.additionalParams = additionalParams;
          $scope.$broadcast('loadAdditionalParams', additionalParams);
        };

        var _init = function () {
          settingsGetter.setCurrentWidget(widget.type);

          $scope.settings.params = settingsGetter.getParams(widget.params);
          _loadAdditionalParams();
        };

        _init();

        $scope.getAdditionalParam = function (name, defaultVal) {
          var val = $scope.settings.additionalParams[name];
          if (angular.isUndefined(val)) {
            return defaultVal;
          } else {
            return val;
          }
        };

        $scope.setAdditionalParam = function (name, val) {
          $scope.settings.additionalParams[name] = val;
        };
        $scope.setAdditionalParams = $scope.setAdditionalParam;

        $scope.saveSettings = function () {
          //clear out previous alerts, if any
          $scope.alerts = [];

          $scope.$broadcast('collectAdditionalParams');

          settingsSaver.saveSettings($scope.settings).then(function (settings) {
            $modalInstance.close(settings);
          }, function (err) {
            $scope.alerts = err.alerts;
          });

        };

        $scope.closeSettings = function () {
          $modalInstance.dismiss('cancel');
        };
      }
    ]);
}());
