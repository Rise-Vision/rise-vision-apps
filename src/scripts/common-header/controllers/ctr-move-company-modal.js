'use strict';

angular.module('risevision.common.header')
  .controller('MoveCompanyModalCtrl', ['$scope', '$modalInstance',
    'moveCompany', 'lookupCompany', 'userState', '$loading',
    function ($scope, $modalInstance, moveCompany, lookupCompany, userState,
      $loading) {

      $scope.company = {};
      $scope.errors = [];
      $scope.messages = [];

      $scope.$watch('loading', function (loading) {
        if (loading) {
          $loading.start('move-company-modal');
        } else {
          $loading.stop('move-company-modal');
        }
      });

      $scope.selectedCompany = userState.getCopyOfSelectedCompany();

      $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.moveCompany = function () {
        $scope.messages = [];
        $scope.loading = true;
        moveCompany($scope.company.authKey, userState.getSelectedCompanyId()).then(
            function () {
              $scope.messages.push(
                'Success. The company has been moved under your company.');
              $scope.moveSuccess = true;
            },
            function (err) {
              $scope.errors.push('Error: ' + JSON.stringify(err));
            })
          .finally(function () {
            $scope.loading = false;
          });
      };

      $scope.getCompany = function () {
        $scope.errors = [];
        $scope.messages = [];
        $scope.loading = true;
        lookupCompany($scope.company.authKey).then(function (resp) {
          angular.extend($scope.company, resp);
        }, function (resp) {
          $scope.errors.push('Failed to retrieve company. ' + resp.message);
        }).finally(function () {
          $scope.loading = false;
        });
      };

      $scope.$watch('moveSuccess', function (moveSuccess) {
        if (moveSuccess) {
          $scope.dismissButtonText = 'Close';
        } else {
          $scope.dismissButtonText = 'Cancel';
        }
      });
    }
  ]);
