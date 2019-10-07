'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentCounter', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-counter.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.registerDirective({
            type: 'rise-data-counter',
            iconType: 'streamline',
            icon: 'hourglass',
            element: element,
            show: function () {
              element.show();
              $scope.componentId = $scope.factory.selected.id;
            },
            getTitle: function (component) {
              return 'template.rise-data-counter' + '-' + component.attributes.type.value;
            }
          });

        }
      };
    }
  ]);
