'use strict';

angular.module('risevision.common.components.message-box', [
    'risevision.common.components.message-box.services'
  ])
  .controller('messageBoxController', ['$scope', '$modalInstance',
    'title', 'message', 'button',
    function ($scope, $modalInstance, title, message, button) {
      $scope.title = title;
      $scope.message = message;
      $scope.button = button ? button : 'common.close';

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
