'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentSchedules', ['scheduleSelectorFactory', '$loading',
    function (scheduleSelectorFactory, $loading) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-schedules.html',
        link: function ($scope, element) {
          $scope.factory = scheduleSelectorFactory;

          $scope.$watch('factory.loadingSchedules', function(isLoading) {
            if (isLoading) {
              $loading.start('schedules-component-spinner');
            } else {
              $loading.stop('schedules-component-spinner');
            }
          });

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
