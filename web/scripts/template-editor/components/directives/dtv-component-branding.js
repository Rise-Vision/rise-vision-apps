'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentBranding', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-branding/component-branding.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          function _load() {

          }

          $scope.save = function () {

          };

          $scope.registerDirective({
            type: 'rise-branding',
            iconType: 'streamline',
            icon: 'ratingStar',
            element: element,
            show: function () {
              $scope.setPanelTitle('Branding Settings');

              element.show();
              _load();
            },
            onBackHandler: function () {
              $scope.setPanelTitle();

              return false;
            }
          });

        }
      };
    }
  ]);
