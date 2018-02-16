(function () {
  'use strict';

  angular.module('risevision.widgets.controllers')
    .controller('WidgetSettingsModalController', ['$scope', '$timeout',
      '$modalInstance', '$loading', 'settingsSaver', 'settingsGetter', 'widget',
      function ($scope, $timeout, $modalInstance, $loading,
        settingsSaver, settingsGetter, widget) {

        $scope.settings = {
          params: {},
          additionalParams: {}
        };
        $scope.alerts = [];

        var _stopLoader = function () {
          $loading.stop('widget-modal-loader');
        };

        var _init = function () {
          settingsGetter.setCurrentWidget(widget.type);

          $timeout(_stopLoader, 3000);
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

        $scope.loadAdditionalParams = function () {
          _stopLoader();

          var additionalParams = settingsGetter.getAdditionalParams(widget.additionalParams);

          $scope.settings.additionalParams = additionalParams;
          $scope.$broadcast('loadAdditionalParams', additionalParams);
        };

        $scope.setAdditionalParams = function (name, val) {
          $scope.settings.additionalParams[name] = val;
        };

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

        $scope.settings.params = settingsGetter.getParams(widget.params);
        $scope.loadAdditionalParams();
      }
    ])

    .directive('scrollOnAlerts', function () {
      return {
        restrict: 'A', //restricts to attributes
        scope: false,
        link: function ($scope, $elm) {
          $scope.$watchCollection('alerts', function (newAlerts, oldAlerts) {
            if (newAlerts.length > 0 && oldAlerts.length === 0) {
              $('body').animate({
                scrollTop: $elm.offset().top
              }, 'fast');
            }
          });
        }
      };
    });
}());
