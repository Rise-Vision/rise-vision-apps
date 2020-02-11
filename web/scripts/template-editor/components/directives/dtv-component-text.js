'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentText', ['templateEditorFactory', 'templateEditorUtils',
    function (templateEditorFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-text.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          function _load() {
            var fontsize = $scope.getAvailableAttributeData($scope.componentId, 'fontsize');
            var fontsizeInt = templateEditorUtils.intValueFor(fontsize, null);

            $scope.value = $scope.getAvailableAttributeData($scope.componentId, 'value');
            $scope.fontsize = fontsizeInt;
            $scope.showFontSize = !!fontsizeInt;
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'value', $scope.value);

            if ($scope.showFontSize) {
              $scope.setAttributeData($scope.componentId, 'fontsize', $scope.fontsize);
            }
          };

          $scope.registerDirective({
            type: 'rise-text',
            iconType: 'streamline',
            icon: 'text',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
            }
          });

        }
      };
    }
  ]);
