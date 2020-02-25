'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentTwitter', ['templateEditorFactory', 'TwitterOAuthService', '$loading',
    'twitterCredentialsValidation',
    function (templateEditorFactory, TwitterOAuthService, $loading, twitterCredentialsValidation) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-twitter.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.$watch('spinner', function (loading) {
            if (loading) {
              $loading.start('twitter-editor-loader');
            } else {
              $loading.stop('twitter-editor-loader');
            }
          });

          $scope.spinner = false;

          $scope.connectionFailure = false;
          $scope.connected = false;

          $scope.connectToTwitter = function () {
            $scope.spinner = true;

            return TwitterOAuthService.authenticate()
              .then(function (key) {
                $scope.connected = true;
                $scope.connectionFailure = false;
              }, function () {
                handleConnectionFailure();
              })
              .finally(function () {
                $scope.spinner = false;
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
              _validateCredentials();
            }
          });

          function handleConnectionFailure() {
            $scope.connected = false;
            $scope.connectionFailure = true;
          }

          function _validateCredentials() {
            $scope.spinner = true;

            twitterCredentialsValidation.verifyCredentials($scope.factory.presentation.companyId)
              .then(function (hasCredentials) {
                $scope.connected = hasCredentials;
                $scope.connectionFailure = false;
              })
              .catch(function (err) {
                handleConnectionFailure();
              })
              .finally(function () {
                $scope.spinner = false;
              });
          }

        }
      };
    }
  ]);
