'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentTwitter', ['templateEditorFactory', 'TwitterOAuthService',
    function (templateEditorFactory, TwitterOAuthService) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-twitter.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.connectionFailure = false;
          $scope.connected = false;

          $scope.connectToTwitter = function() {
            TwitterOAuthService.authenticate()
              .then(function (key) {
                $scope.connected = true;
                $scope.connectionFailure = false;
              }, function () {
                $scope.connected = false;
                $scope.connectionFailure = true;
              });
          };

          $scope.registerDirective({
            type: 'rise-data-twitter',
            iconType: 'streamline',
            icon: 'twitter',
            element: element,
            show: function () {
              element.show();
              $scope.componentId = $scope.factory.selected.id;
            }
          });

        }
      };
    }
  ]);
