'use strict';

angular.module('risevision.common.header')
  .controller('RegisterButtonCtrl', ['$scope', 'uiFlowManager',
    function ($scope, uiFlowManager) {

      $scope.register = function () {
        uiFlowManager.invalidateStatus('registrationComplete');
      };
    }
  ]);
