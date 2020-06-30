'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentSchedules', ['schedulesComponentFactory',
    function (schedulesComponentFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-schedules.html',
        link: function ($scope, element) {
          $scope.factory = schedulesComponentFactory;

          function _load() {

          }

          $scope.save = function () {

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
