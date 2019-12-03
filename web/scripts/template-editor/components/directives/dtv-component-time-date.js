'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentTimeDate', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-time-date.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.registerDirective({
            type: 'rise-time-date',
            iconType: 'streamline',
            icon: 'time',
            element: element,
            show: function () {
              element.show();
              $scope.componentId = $scope.factory.selected.id;
            }
          });

        }
      };
    }
  ]);
