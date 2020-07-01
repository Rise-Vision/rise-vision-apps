'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentSchedules', ['$loading', 'schedulesComponentFactory',
    function ($loading, schedulesComponentFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-schedules/component-schedules.html',
        link: function ($scope, element) {
          $scope.factory = schedulesComponentFactory;

          function _load() {
            schedulesComponentFactory.loadNonSelectedSchedules();
          }

          $scope.$watch('factory.loadingSchedules', function() {
            if (schedulesComponentFactory.loadingSchedules) {
              $loading.start('selected-schedules-spinner');
            } else {
              $loading.stop('selected-schedules-spinner');
            }
          });

          $scope.save = function () {
            schedulesComponentFactory.save();
          };

          $scope.registerDirective({
            type: 'rise-schedules',
            element: element,
            show: function () {
              $scope.setPanelTitle('Schedule Settings');

              _load();
            }
          });

        }
      };
    }
  ]);
