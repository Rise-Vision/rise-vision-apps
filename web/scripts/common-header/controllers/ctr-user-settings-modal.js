'use strict';
/*global confirm: false */

angular.module('risevision.common.header')
  .controller('UserSettingsModalCtrl', [
    '$scope', '$filter', '$modalInstance', 'updateUser', 'getUserProfile',
    'deleteUser', 'username', 'userRoleMap', '$log', '$loading', 'userState',
    'userAuthFactory', 'uiFlowManager', 'humanReadableError', 'messageBox', 'confirmModal',
    '$rootScope', 'userTracker', 'userauth', '$q', 'COMPANY_ROLE_FIELDS',
    function ($scope, $filter, $modalInstance, updateUser, getUserProfile,
      deleteUser, username, userRoleMap, $log, $loading, userState,
      userAuthFactory, uiFlowManager, humanReadableError, messageBox, confirmModal,
      $rootScope, userTracker, userauth, $q, COMPANY_ROLE_FIELDS) {
      $scope.user = {};
      $scope.userPassword = {};
      $scope.showChangePassword = false;
      $scope.isRiseAuthUser = userState.isRiseAuthUser();
      $scope.$watch('loading', function (loading) {
        if (loading) {
          $loading.start('user-settings-modal');
        } else {
          $loading.stop('user-settings-modal');
        }
      });

      //push roles into array
      $scope.availableRoles = [];
      angular.forEach(userRoleMap, function (v, k) {
        $scope.availableRoles.push({
          key: k,
          name: v
        });
      });
      $scope.COMPANY_ROLE_FIELDS = COMPANY_ROLE_FIELDS;

      // convert string to numbers
      $scope.$watch('user.status', function (status) {
        if (typeof $scope.user.status === 'string') {
          $scope.user.status = parseInt(status);
        }
      });

      $scope.$watch('userPassword.currentPassword', function () {
        if ($scope.showChangePassword) {
          $scope.forms.userSettingsForm.currentPassword.$setValidity('currentPasswordNotValid', true);
        }
      });

      $scope.isUserAdmin = userState.isUserAdmin();
      $scope.username = username;

      $scope.loading = true;
      getUserProfile(username).then(function (user) {
        $scope.user = user;
        $scope.editingYourself = userState.checkUsername(user.username);

      }).finally(function () {
        $scope.loading = false;
      });

      $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.deleteUser = function () {
        confirmModal('Deleting User', 'Are you sure you want to delete this user?', 'common.delete-forever')
          .then(function () {
            $scope.loading = true;

            deleteUser($scope.username)
              .then(function () {
                userTracker('User Deleted', $scope.username, userState.checkUsername(username));

                if (userState.checkUsername(username)) {
                  userAuthFactory.signOut().then().finally(function () {
                    uiFlowManager.invalidateStatus('registrationComplete');
                  });
                }

                $modalInstance.dismiss('deleted');
              })
              .catch(function (error) {
                var errorMessage = 'Error: ' + humanReadableError(error);

                messageBox('Failed to delete User!', errorMessage);
              })
              .finally(function () {
                $scope.loading = false;
              });
          });
      };

      $scope.save = function () {
        if ($scope.showChangePassword) {
          $scope.forms.userSettingsForm.currentPassword.$setValidity('currentPasswordNotValid', true);
        }

        if ($scope.forms.userSettingsForm.$valid) {
          var changePasswordPromise = $q.resolve();

          $scope.loading = true;

          if ($scope.showChangePassword) {
            changePasswordPromise = userauth.updatePassword(
              username,
              $scope.userPassword.currentPassword,
              $scope.userPassword.newPassword);
            changePasswordPromise
              .then(function () {
                $scope.userPassword = {};
                $scope.showChangePassword = false;
              })
              .catch(function (err) {
                var newError = err.result.error;

                if (newError.code === 409) {
                  $scope.forms.userSettingsForm.currentPassword.$setValidity('currentPasswordNotValid', false);
                  newError.changePassword = true;
                }
                return $q.reject(newError);
              });
          }

          changePasswordPromise
            .then(function () {
              return updateUser(username, $scope.user);
            })
            .then(function (resp) {
              if (userState.checkUsername(username)) {
                userState.updateUserProfile(resp.item);
              }

              userTracker('User Updated', $scope.username, userState.checkUsername(username));

              $modalInstance.close('success');
            })
            .catch(function (error) {
              error = (error.result && error.result.error) || error;
              $log.debug(error);
              var errorMessage = 'Error: ' + humanReadableError(error);
              if (error.code === 409 && !error.changePassword) {
                errorMessage = $filter('translate')(
                  'common-header.user.error.duplicate-user', {
                    'username': $scope.user.username
                  });
              } else if (error.changePassword) {
                errorMessage = error.message;
              }

              messageBox('common-header.user.error.update-user',
                errorMessage);
            })
            .finally(function () {
              $scope.loading = false;
            });
        }
      };

      $scope.editRoleAllowed = function (role) {
        if (userState.isRiseAdmin()) {
          return true;
        } else if (userState.isUserAdmin()) {
          if (role.key === 'sa' || role.key === 'ba') {
            return false;
          } else if (role.key === 'ua' &&
            userState.checkUsername($scope.user.username)) {
            //cannot unassign oneself from ua
            return false;
          } else {
            return true;
          }
        } else {
          //do not allow user to check/uncheck role by default
          return false;
        }
      };

      $scope.editRoleVisible = function (role) {
        if (userState.isSelectedCompanyChargebee() && role.key === 'pu') {
          return false;
        } else if (userState.isRiseAdmin()) {
          if (userState.isSubcompanySelected() && (role.key === 'sa' || role.key ===
              'ba')) {
            return false;
          } else {
            return true;
          }
        } else if (userState.isUserAdmin() || userState.isRiseVisionUser()) {
          if (role.key === 'sa' || role.key === 'ba') {
            return false;
          } else {
            return true;
          }
        } else {
          // in practice should never reach here
          return false;
        }
      };

      $scope.forms = {};

      $scope.toggleChangePassword = function () {
        $scope.showChangePassword = !$scope.showChangePassword;
      };
    }
  ]);
