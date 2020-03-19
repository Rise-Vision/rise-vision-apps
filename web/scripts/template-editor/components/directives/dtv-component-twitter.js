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
          $scope.MAX_ITEMS = 100;

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
          $scope.username = null;
          $scope.usernameStatus = null;

          $scope.connectToTwitter = function () {
            $scope.spinner = true;

            return TwitterOAuthService.authenticate()
              .then(function (key) {
                $scope.connected = true;
                $scope.connectionFailure = false;
              }, function () {
                _handleConnectionFailure();
              })
              .finally(function () {
                $scope.spinner = false;
                $scope.setAttributeData($scope.componentId, 'credentialsUpdated', Date.now());
              });
          };

          $scope.save = function () {
            if (_validateUsername($scope.username)) {
              $scope.setAttributeData($scope.componentId, 'username', $scope.username.replace('@', ''));
            }

            if (_validateMaxitems($scope.maxitems)) {
              $scope.setAttributeData($scope.componentId, 'maxitems', Number($scope.maxitems));
            }
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
              _load();
            }
          });

          function _load() {
            var username = $scope.getAvailableAttributeData($scope.componentId, 'username');
            var maxitems = $scope.getAvailableAttributeData($scope.componentId, 'maxitems');

            $scope.username = username && username.indexOf('@') === -1 ? '@' + username : username;
            $scope.maxitems = maxitems;
            _validateUsername($scope.username);
            _validateMaxitems($scope.maxitems);
          }

          function _handleConnectionFailure() {
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
                _handleConnectionFailure();
              })
              .finally(function () {
                $scope.spinner = false;
              });
          }

          function _validateUsername(username) {
            var usernameRegex = /^@?(\w){1,15}$/;

            if (username && usernameRegex.test(username)) {
              $scope.usernameStatus = 'VALID';
              return true;
            } else {
              $scope.usernameStatus = 'INVALID_USERNAME';
              return false;
            }
          }

          function _validateMaxitems(maxitems) {
            if (maxitems && maxitems >= 1 && maxitems <= $scope.MAX_ITEMS) {
              $scope.maxitemsStatus = 'VALID';
              return true;
            } else if (maxitems) {
              $scope.maxitemsStatus = 'INVALID_RANGE';
              return false;
            } else {
              $scope.maxitemsStatus = null;
              return false;
            }
          }
        }
      };
    }
  ]);
