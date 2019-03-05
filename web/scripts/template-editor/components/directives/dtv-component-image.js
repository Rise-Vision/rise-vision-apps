'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentImage', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/components/component-image.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.registerDirective({
            type: 'rise-data-image',
            icon: 'fa-image',
            element: element,
            show: function() {
              element.show();
            }
          });
        }
      };
    }
  ]);
