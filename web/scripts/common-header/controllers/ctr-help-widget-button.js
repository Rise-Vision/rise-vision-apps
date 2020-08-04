'use strict';

angular.module('risevision.common.header')
  .controller('HelpWidgetButtonCtrl', ['$scope', 'helpWidget',
    function ($scope, helpWidget) {
      $scope.showHelpWidget = function () {
        helpWidget.activateWidget();
      };
    }
  ]);
