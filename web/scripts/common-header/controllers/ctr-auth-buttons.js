'use strict';

angular.module('risevision.common.header')
  .controller('AuthButtonsCtr', ['$scope', '$modal', '$templateCache',
    'userState', 'userAuthFactory', 'canAccessApps',
    '$loading', 'hubspot',
    '$log', 'uiFlowManager', 'auth2APILoader', 'bindToScopeWithWatch',
    '$window', 'APPS_URL',
    function ($scope, $modal, $templateCache, userState, userAuthFactory,
      canAccessApps,
      $loading, hubspot, $log, uiFlowManager, auth2APILoader,
      bindToScopeWithWatch, $window, APPS_URL) {

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


      //render dialogs based on status the UI is stuck on
      $scope.$watch(function () {
          return uiFlowManager.getStatus();
        },
        function (newStatus, oldStatus) {
          if (newStatus) {
            $log.debug('status changed from', oldStatus, 'to', newStatus);

            //render a dialog based on the status current UI is in
            if (newStatus === 'registeredAsRiseVisionUser') {
              if (!userState.registrationModalInstance && userState
                .isLoggedIn()) { // avoid duplicate registration modals
                hubspot.loadAs(userState.getUsername());
                userState.registrationModalInstance = $modal.open({
                  template: $templateCache.get('partials/common-header/registration-modal.html'),
                  controller: 'RegistrationModalCtrl',
                  backdrop: 'static', //prevent from closing modal by clicking outside
                  keyboard: false, //prevent from closing modal by pressing escape
                  resolve: {
                    account: ['getUserProfile', 'getAccount',
                      function (getUserProfile, getAccount) {
                        return getUserProfile(userState.getUsername())
                          .then(null, function (resp) {
                            if (resp && resp.message ===
                              'User has not yet accepted the Terms of Service'
                            ) {
                              return getAccount();
                            } else {
                              return null;
                            }
                          })
                          .catch(function () {
                            return null;
                          });
                      }
                    ]
                  }
                });
              }

              userState.registrationModalInstance.result.finally(function () {
                //TODO: put it somewhere else
                userState.registrationModalInstance = null;
                uiFlowManager.invalidateStatus();
              });
            } else if (newStatus === 'signedInWithGoogle') {
              $scope.login();
            }
          }
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
        var alertsUrl = APPS_URL + '/alerts?cid=' + userState.getSelectedCompanyId();

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
      auth2APILoader() //force loading auth2 api on startup
        //to avoid popup blocker
        .then().finally(function () {
          userAuthFactory.authenticate(false).then().finally(function () {
            $loading.stopGlobal('auth-buttons-silent');
            if (!uiFlowManager.isStatusUndetermined()) {
              //attempt to reach a stable registration state only
              //when there is currently no validating checking
              uiFlowManager.invalidateStatus('registrationComplete');
            }
          });
        });


    }
  ]);
