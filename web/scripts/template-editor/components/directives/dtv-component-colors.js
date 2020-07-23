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

          // TODO: refactor logic for Override Brand Settings epic

          $scope.saveOverride = function () {
            $scope.setAttributeData($scope.componentId, 'override', $scope.override);
          };

          $scope.registerDirective({
            type: 'rise-override-brand-colors',
            iconType: 'streamline',
            icon: 'palette',
            element: element,
            show: function () {
              $scope.setPanelTitle('Override Brand Colors');
              element.show();
              $scope.componentId = $scope.factory.selected.id;
              $scope.load();
            }
          });

          $scope.load = function () {
            $scope.baseColor = $scope.getAvailableAttributeData($scope.componentId, 'base');
            $scope.accentColor = $scope.getAvailableAttributeData($scope.componentId, 'accent');
            $scope.override = $scope.getAvailableAttributeData($scope.componentId, 'override');

            $scope.$watch('baseColor', function (newVal, oldVal) {
              if (newVal && newVal !== oldVal) {
                $scope.setAttributeData($scope.componentId, 'base', $scope.baseColor);
              }
            });

            $scope.$watch('accentColor', function (newVal, oldVal) {
              if (newVal && newVal !== oldVal) {
                $scope.setAttributeData($scope.componentId, 'accent', $scope.accentColor);
              }
            });
          };

        }
      };
    }
  ]);
