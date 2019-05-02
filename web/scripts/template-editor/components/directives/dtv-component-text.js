'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentText', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/components/component-text.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          function _load() {
            $scope.value = $scope.getAttributeData($scope.componentId, 'value');
          }

          function _save() {
            $scope.setAttributeData($scope.componentId, 'value', $scope.value);
          }

          $scope.registerDirective({
            type: 'rise-text',
            icon: 'fa-image',
            element: element,
            show: function() {
              element.show();
              $scope.componentId = $scope.factory.selected.id;
              _load();
            },
            onBackHandler: function () {
              _save();
              return false;
            }
          });

        }
      };
    }
  ]);
