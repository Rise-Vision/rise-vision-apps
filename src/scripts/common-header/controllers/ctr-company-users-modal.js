'use strict';

angular.module('risevision.common.header')
  .filter('roleLabel', ['userRoleMap',
    function (userRoleMap) {
      return function (key) {
        return userRoleMap[key];
      };
    }
  ])
  .controller('CompanyUsersModalCtrl', ['$scope', '$loading', '$modalInstance', '$modal',
    '$templateCache', 'ScrollingListService', 'company', 'getUsers',
    function ($scope, $loading, $modalInstance, $modal, $templateCache,
      ScrollingListService, company, getUsers) {

      $scope.search = {
        companyId: company.id,
        sortBy: 'username',
        reverse: false,
        name: 'Users'
      };

      $scope.users = new ScrollingListService(getUsers, $scope.search);

      $scope.filterConfig = {
        placeholder: 'Search Users'
      };

      $scope.$watch('users.loadingItems', function (loading) {
        if (loading) {
          $loading.start('company-users-list');
        } else {
          $loading.stop('company-users-list');
        }
      });

      $scope.addUser = function (size) {
        var instance = $modal.open({
          template: $templateCache.get('partials/common-header/user-settings-modal.html'),
          controller: 'AddUserModalCtrl',
          size: size,
          resolve: {
            companyId: function () {
              return company.id;
            }
          }
        });
        instance.result.finally($scope.users.doSearch);
      };

      $scope.editUser = function (username, size) {
        var instance = $modal.open({
          template: $templateCache.get('partials/common-header/user-settings-modal.html'),
          controller: 'UserSettingsModalCtrl',
          size: size,
          resolve: {
            username: function () {
              return username;
            },
            add: function () {
              return false;
            }
          }
        });
        instance.result.finally($scope.users.doSearch);
      };

      $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);
