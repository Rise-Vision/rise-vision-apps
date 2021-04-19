'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentBranding', [
    function () {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-branding/component-branding.html',
        link: function ($scope, element) {
          $scope.editLogo = function () {
            $scope.editComponent({
              type: 'rise-image-logo'
            });
          };

          $scope.editColors = function () {
            $scope.editComponent({
              type: 'rise-branding-colors'
            });
          };

          $scope.registerDirective({
            type: 'rise-branding',
            element: element
          });

        }
      };
    }
  ]);
