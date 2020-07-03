'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentSchedules', ['$loading', 'scheduleSelectorFactory',
    function ($loading, scheduleSelectorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-schedules/component-schedules.html',
        link: function ($scope, element) {
          $scope.factory = scheduleSelectorFactory;

          function _load() {
            $scope.factory.loadNonSelectedSchedules();
          }

          $scope.$watch('factory.loadingSchedules', function() {
            if ($scope.factory.loadingSchedules) {
              $loading.start('selected-schedules-spinner');
            } else {
              $loading.stop('selected-schedules-spinner');
            }
          });

          $scope.save = function () {
            $scope.factory.save();
          };

          $scope.registerDirective({
            type: 'rise-schedules',
            element: element,
            show: function () {
              $scope.setPanelTitle('Schedule Settings');

              _load();
            },
            onBackHandler: function () {
              // TODO: close tooltip if open
            }
          });

        }
      };
    }
  ]);
