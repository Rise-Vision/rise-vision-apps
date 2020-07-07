'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentSchedules', ['scheduleSelectorFactory',
    function (scheduleSelectorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-schedules.html',
        link: function ($scope, element) {
          $scope.factory = scheduleSelectorFactory;

          $scope.registerDirective({
            type: 'rise-schedules',
            element: element,
            show: function () {
              $scope.setPanelTitle('Schedules');
            },
            onBackHandler: function () {
              $scope.showTooltip = false;
            }
          });

        }
      };
    }
  ]);
