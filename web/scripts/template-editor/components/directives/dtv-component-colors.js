'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentColors', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-colors.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'override', $scope.override);
          };

          $scope.registerDirective({
            type: 'rise-data-colors',
            iconType: 'streamline',
            icon: 'palette',
            element: element,
            show: function () {
              element.show();
              $scope.componentId = $scope.factory.selected.id;
              $scope.load();
            }
          });

          $scope.load = function () {
            $scope.override = $scope.getAvailableAttributeData($scope.componentId, 'override');
          };

        }
      };
    }
  ]);
