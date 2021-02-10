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
            iconType: 'streamline',
            icon: 'palette',
            element: element,
            panel: '.branding-colors-container',
            show: function () {
              $scope.setPanelTitle('Color Settings');
            },
            onBackHandler: function () {
              $scope.setPanelIcon('ratingStar', 'streamline');
              $scope.setPanelTitle('Brand Settings');

              return $scope.showPreviousPanel();
            }
          });
        }
      };
    }
  ]);
