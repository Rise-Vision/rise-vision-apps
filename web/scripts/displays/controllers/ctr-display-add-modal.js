'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAddModal', ['$scope', '$modalInstance', 'displayFactory',
    'userState', '$log', 'displayEmail', '$filter', 'downloadOnly',
    function ($scope, $modalInstance, displayFactory, userState, $log,
      displayEmail, $filter, downloadOnly) {
      $scope.factory = displayFactory;
      $scope.display = displayFactory.display;
      $scope.userEmail = userState.getUserEmail();
      $scope.displayEmail = displayEmail;
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
        displayEmail.send($scope.display.id, $scope.display.name, $scope.anotherEmail)
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
