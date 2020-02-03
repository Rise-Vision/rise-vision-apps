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
            $scope.setAttributeData($scope.componentId, 'base', $scope.baseColor);
            $scope.setAttributeData($scope.componentId, 'accent', $scope.accentColor);
            $scope.setAttributeData($scope.componentId, 'override', $scope.override);
          };

          $scope.$on('colorpicker-selected', $scope.save);

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
            $scope.baseColor = $scope.getAvailableAttributeData($scope.componentId, 'base');
            $scope.accentColor = $scope.getAvailableAttributeData($scope.componentId, 'accent');
            $scope.override = $scope.getAvailableAttributeData($scope.componentId, 'override');
          };

        }
      };
    }
  ]);
