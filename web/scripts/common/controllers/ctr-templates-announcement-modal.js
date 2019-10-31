'use strict';

angular.module('risevision.apps.controllers')
  .controller('TemplatesAnnouncementModalCtrl', ['$scope', '$modalInstance', 'userState',
    function ($scope, $modalInstance, userState) {

      $scope.name = userState.getCopyOfProfile().firstName;

      $scope.thumbsUp = function () {
        $modalInstance.close(true);
      };

      $scope.thumbsDown = function () {
        $modalInstance.close(false);
      };
    }
  ]);
