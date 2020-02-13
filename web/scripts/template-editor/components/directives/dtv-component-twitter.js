'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentTwitter', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-twitter.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.initiateConnection = function() {
            // TODO: coming soon
          };

          $scope.registerDirective({
            type: 'rise-data-twitter',
            iconType: 'streamline',
            icon: 'twitter',
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
