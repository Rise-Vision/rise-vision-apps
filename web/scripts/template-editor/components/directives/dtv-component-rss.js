'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentRss', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-rss.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.registerDirective({
            type: 'rise-data-rss',
            iconType: 'streamline',
            icon: 'rss',
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
