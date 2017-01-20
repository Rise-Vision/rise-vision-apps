'use strict';

angular.module('risevision.editor.controllers')
  .controller('AutoScheduleModalController', ['$scope', 'presentationName',
    '$modalInstance', 'displayFactory',
    function ($scope, presentationName, $modalInstance, displayFactory) {
      $scope.presentationName = presentationName;
      $scope.displayFactory = displayFactory;

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]); //ctr
