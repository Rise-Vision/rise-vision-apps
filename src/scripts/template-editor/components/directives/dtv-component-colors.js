'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentColors', ['componentsFactory', 'attributeDataFactory',
    function (componentsFactory, attributeDataFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-colors.html',
        link: function ($scope, element) {
          // TODO: refactor logic for Override Brand Settings epic

          $scope.save = function () {
            var brandingOverride = null;

            if ($scope.override) {
              brandingOverride = {
                'baseColor': $scope.baseColor,
                'accentColor': $scope.accentColor
              };
            }

            attributeDataFactory.setAttributeDataGlobal('brandingOverride', brandingOverride);
          };

          $scope.registerDirective({
            type: 'rise-override-brand-colors',
            element: element,
            show: function () {
              $scope.componentId = componentsFactory.selected.id;
              $scope.load();
            }
          });

          $scope.load = function () {

            var brandingOverride = attributeDataFactory.getAttributeDataGlobal('brandingOverride');

            $scope.override = !!brandingOverride;
            $scope.baseColor = $scope.override ? brandingOverride.baseColor : null;
            $scope.accentColor = $scope.override ? brandingOverride.accentColor : null;

            $scope.$watch('baseColor', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                $scope.save();
              }
            });

            $scope.$watch('accentColor', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                $scope.save();
              }
            });
          };

        }
      };
    }
  ]);
