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
            $scope.setPanelIcon('circleStar', 'streamline');
            $scope.setPanelTitle('Logo Settings');
            $scope.editComponent({
              type: 'rise-image'
            });
          };

          $scope.editColors = function () {
            $scope.editComponent({
              type: 'rise-branding-colors'
            });
          };

          $scope.registerDirective({
            type: 'rise-branding',
            iconType: 'streamline',
            icon: 'ratingStar',
            title: 'Brand Settings',
            element: element,
            panel: '.branding-component-container',
            onBackHandler: function () {
              return $scope.showPreviousPanel();
            }
          });

        }
      };
    }
  ]);
