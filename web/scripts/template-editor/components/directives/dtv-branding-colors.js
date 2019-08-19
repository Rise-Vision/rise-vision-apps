'use strict';

angular.module('risevision.template-editor.directives')
  .directive('brandingColors', ['brandingFactory',
    function (brandingFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/components/component-branding/branding-colors.html',
        link: function ($scope) {
          $scope.brandingFactory = brandingFactory;

          $scope.saveBranding = function () {
            brandingFactory.updateDraftColors();
          };
        }
      };
    }
  ]);
