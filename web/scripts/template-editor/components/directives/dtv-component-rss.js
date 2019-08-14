'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentRss', ['templateEditorFactory', '$loading',
    function (templateEditorFactory, $loading) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-rss.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.$watch('spinner', function (loading) {
            if (loading) {
              $loading.start('rss-editor-loader');
            } else {
              $loading.stop('rss-editor-loader');
            }
          });

          $scope.spinner = false;

          $scope.maxItems = '1';

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
