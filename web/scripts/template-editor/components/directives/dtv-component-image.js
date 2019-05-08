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

              $scope.showNextPanel('.image-component-container');
            },
            onBackHandler: function () {
              return $scope.showPreviousPanel();
            }
          });

          $scope.uploadImages = function () {
            $scope.showNextPanel('.upload-images-container');
          };

          $scope.selectFromStorage = function () {
            $scope.showNextPanel('.storage-selector-container');
          };

          $scope.getPartialPath = function (partial) {
            return 'partials/template-editor/components/component-image/' + partial;
          };
        }
      };
    }
  ]);
