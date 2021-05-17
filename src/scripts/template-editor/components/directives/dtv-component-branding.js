'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentBranding', ['componentsFactory',
    function (componentsFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-branding/component-branding.html',
        link: function ($scope, element) {
          $scope.editLogo = function () {
            componentsFactory.editComponent({
              type: 'rise-image-logo'
            });
          };

          $scope.editColors = function () {
            componentsFactory.editComponent({
              type: 'rise-branding-colors'
            });
          };

          componentsFactory.registerDirective({
            type: 'rise-branding',
            element: element
          });

        }
      };
    }
  ]);
