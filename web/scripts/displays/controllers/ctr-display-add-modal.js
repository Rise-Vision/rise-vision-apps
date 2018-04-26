'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAddModal', ['$scope', '$modalInstance', 'displayFactory',
    'userState', '$log', 'display', '$filter', 'downloadOnly',
    function ($scope, $modalInstance, displayFactory, userState, $log,
      displayService, $filter, downloadOnly) {
      $scope.factory = displayFactory;
      $scope.display = displayFactory.display;
      $scope.userEmail = userState.getUserEmail();
      $scope.displayService = displayService;
      $scope.showEmailForm = false;
      $scope.anotherEmail = null;
      $scope.errorMessage = null;
      $scope.downloadOnly = downloadOnly;

      $scope.toggleEmailForm = function () {
        $scope.showEmailForm = !$scope.showEmailForm;
      };

      $scope.save = function () {
        if (!$scope.displayAdd.$valid) {
          console.error('form not valid: ', $scope.displayAdd.errors);
          return;
        }

        displayFactory.addDisplay().then(function () {
          $scope.display = displayFactory.display;
        });
      };

      $scope.sendToAnotherEmail = function () {
        $scope.errorMessage = null;
        displayService.sendSetupEmail($scope.display.id, $scope.anotherEmail)
          .then(function () {
            $modalInstance.dismiss();
          }, function (error) {
            $scope.errorMessage = $filter('translate')(
              'displays-app.fields.email.failed');
          });
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]);
