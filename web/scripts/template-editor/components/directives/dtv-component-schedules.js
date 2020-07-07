'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentSchedules', ['scheduleSelectorFactory',
    function (scheduleSelectorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-schedules/component-schedules.html',
        link: function ($scope, element) {
          $scope.factory = scheduleSelectorFactory;

          function _load() {
            $scope.factory.loadUnselectedSchedules();
          }

          $scope.save = function () {
            $scope.factory.save();
          };

          $scope.registerDirective({
            type: 'rise-schedules',
            element: element,
            show: function () {
              $scope.setPanelTitle('Schedules');

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
