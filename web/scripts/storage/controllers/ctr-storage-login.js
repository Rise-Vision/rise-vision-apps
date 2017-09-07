'use strict';

angular.module('risevision.storage.controllers')
  .controller('StorageLoginCtrl', ['$scope', 'userAuthFactory', 'uiFlowManager',
    function ($scope, userAuthFactory, uiFlowManager) {

      // Login Modal
      $scope.login = function () {
        return userAuthFactory.authenticatePopup().finally(function () {
          uiFlowManager.invalidateStatus('registrationComplete');
        });
      };
    }
  ]);
