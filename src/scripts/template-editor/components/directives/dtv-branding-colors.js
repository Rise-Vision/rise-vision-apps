'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateBrandingColors', ['brandingFactory',
    function (brandingFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-branding/branding-colors.html',
        link: function ($scope, element) {
          $scope.brandingFactory = brandingFactory;

          $scope.saveBranding = function () {
            brandingFactory.setUnsavedChanges();
          };

          $scope.$on('colorpicker-selected', $scope.saveBranding);

          $scope.registerDirective({
            type: 'rise-branding-colors',
            element: element,
          });
        }
      };
    }
  ]);
