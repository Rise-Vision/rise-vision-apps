/*jshint multistr: true */
'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('ShareUrlController', ['$scope', '$window',
    function ($scope, $window) {

      $scope.getUrl = function () {
        return $window.location.href;
      };

      $scope.copyToClipboard = function (text) {
        if ($window.navigator.clipboard) {
          $window.navigator.clipboard.writeText(text);
        }
      };

      $scope.onTextFocus = function (event) {
        event.target.select();
      };

    }
  ]);
