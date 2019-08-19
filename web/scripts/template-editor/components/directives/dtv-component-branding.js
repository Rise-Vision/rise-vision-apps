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
            $scope.showNextPanel('.branding-logo-container');
          };

          $scope.editColors = function () {
            $scope.setPanelIcon('palette', 'streamline');
            $scope.setPanelTitle('Color Settings');
            $scope.showNextPanel('.branding-colors-container');
          };

          $scope.registerDirective({
            type: 'rise-branding',
            iconType: 'streamline',
            icon: 'ratingStar',
            element: element,
            show: function () {
              $scope.setPanelTitle('Branding Settings');

              element.show();

              $scope.showNextPanel('.branding-component-container');
            },
            onBackHandler: function () {
              $scope.setPanelIcon();
              $scope.setPanelTitle('Branding Settings');
              return $scope.showPreviousPanel();
            }
          });

        }
      };
    }
  ]);
