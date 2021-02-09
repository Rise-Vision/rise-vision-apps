'use strict';

angular.module('risevision.common.header')
  .controller('SignOutButtonCtrl', ['$scope', '$modal', '$templateCache',
    '$log', 'uiFlowManager', 'userAuthFactory', 'userState',
    function ($scope, $modal, $templateCache, $log, uiFlowManager,
      userAuthFactory, userState) {
      $scope.logout = function () {
        if (userState.isRiseAuthUser()) {
          userAuthFactory.signOut()
            .then(function () {
              $log.debug('Custom Auth user signed out');
            })
            .catch(function (err) {
              $log.error('Custom Auth sign out failed', err);
            });
        } else {
          var modalInstance = $modal.open({
            template: $templateCache.get('partials/common-header/signout-modal.html'),
            controller: 'SignOutModalCtrl'
          });
          modalInstance.result.finally(function () {
            uiFlowManager.invalidateStatus('registrationComplete');
          });
        }

      };
    }
  ]);
