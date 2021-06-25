'use strict';

angular.module('risevision.common.header')
  .controller('AuthButtonsCtr', ['$scope', '$state', '$modal', '$templateCache',
    'userState', 'userAuthFactory', 'canAccessApps',
    '$loading',
    '$log', 'uiFlowManager', 'bindToScopeWithWatch',
    '$window', 'environment',
    function ($scope, $state, $modal, $templateCache, userState, userAuthFactory,
      canAccessApps,
      $loading, $log, uiFlowManager,
      bindToScopeWithWatch, $window, environment) {

      window.$loading = $loading; //DEBUG

      $scope.inRVAFrame = userState.inRVAFrame();

      $scope.spinnerOptions = {
        color: '#999',
        hwaccel: true,
        radius: 10
      };

      //spinner
      $scope.$watch(function () {
          return uiFlowManager.isStatusUndetermined();
        },
        function (undetermined) {
          $scope.undetermined = undetermined;
          $scope.loading = undetermined;
        });

      //watch on username change and populate onto scope variables requried
      // for rendering UI

      $scope.$watch(function () {
          return userState.isLoggedIn();
        },
        function (loggedIn) {
          $scope.isLoggedIn = loggedIn;
          if (loggedIn === true) {
            $scope.userPicture = userState.getUserPicture();
          }
        });
      $scope.$watch(function () {
          return userState.getUserCompanyName();
        },
        function () {
          $scope.companyName = userState.getUserCompanyName();
        });

      $scope.$watch(function () {
          return userState.getUsername();
        },
        function () {
          $scope.username = userState.getUsername();
        });
      bindToScopeWithWatch(userState.isRiseVisionUser, 'isRiseVisionUser',
        $scope);

      // Login Modal
      $scope.login = function (endStatus, signup) {
        $loading.startGlobal('auth-buttons-login');
        canAccessApps(signup, true).finally(function () {
          $loading.stopGlobal('auth-buttons-login');
          uiFlowManager.invalidateStatus(endStatus);
        });
      };

      // Show Alert Settings page
      $scope.alertSettings = function () {
        var alertsUrl = environment.APPS_URL + '/alerts?cid=' + userState.getSelectedCompanyId();

        $window.location.href = alertsUrl;
      };

      // Show User Settings Modal
      $scope.userSettings = function (size) {
        // var modalInstance =
        $modal.open({
          template: $templateCache.get('partials/common-header/user-settings-modal.html'),
          controller: 'UserSettingsModalCtrl',
          size: size,
          resolve: {
            username: function () {
              return userState.getUsername();
            },
            add: function () {
              return false;
            }
          }
        });
      };

      $scope.isChargebee = function () {
        return userState.isSelectedCompanyChargebee();
      };

      $loading.startGlobal('auth-buttons-silent');
      userAuthFactory.authenticate(false).finally(function () {
        $loading.stopGlobal('auth-buttons-silent');
      });

    }
  ]);
