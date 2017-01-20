'use strict';

angular.module('risevision.storage.controllers')
  .controller('StorageLoginCtrl', ['$scope', 'userState', 'uiFlowManager',
    function ($scope, userState, uiFlowManager) {

      // Login Modal
      $scope.login = function () {
        return userState.authenticatePopup().finally(function () {
          uiFlowManager.invalidateStatus('registrationComplete');
        });
      };
    }
  ]);
