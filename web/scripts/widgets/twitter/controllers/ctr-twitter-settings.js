'use strict';
angular.module('risevision.widgets.twitter')
  .controller('TwitterSettingsController', ['$scope', '$rootScope', 'TwitterOAuthService',
    function ($scope, $rootScope, TwitterOAuthService) {
      $scope.twitterConnected = false;

      TwitterOAuthService.getConnectionStatus()
        .then(function () {
          $scope.twitterConnected = true;
        }, function () {
          $scope.twitterConnected = false;
        });

      $scope.connect = function () {
        TwitterOAuthService.authenticate()
          .then(function (key) {
            $scope.twitterConnected = true;
          }, function () {
            $scope.twitterConnected = false;
          });
      };

      $scope.revoke = function () {
        TwitterOAuthService.revoke()
          .then(function () {
            $scope.twitterConnected = false;
          }, function () {
            $scope.twitterConnected = true;
          });
      };
    }
  ]);
