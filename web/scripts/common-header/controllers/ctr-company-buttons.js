'use strict';

angular.module('risevision.common.header')
  .controller('CompanyButtonsCtrl', ['$scope', '$modal', '$templateCache',
    'userState', 'getCoreCountries', 'companySettingsFactory',

    function ($scope, $modal, $templateCache, userState, getCoreCountries, companySettingsFactory) {
      $scope.inRVAFrame = userState.inRVAFrame();
      $scope.companySettingsFactory = companySettingsFactory;

      $scope.$watch(function () {
          return userState.isSubcompanySelected();
        },
        function () {
          $scope.isSubcompanySelected = userState.isSubcompanySelected();
        });

      $scope.$watch(function () {
          return userState.getSelectedCompanyName();
        },
        function (selectedCompanyName) {
          if (selectedCompanyName) {
            $scope.selectedCompanyName = userState.getSelectedCompanyName();
          }
        });

      $scope.$watch(function () {
          return userState.isRiseVisionUser();
        },
        function (isRvUser) {
          $scope.isRiseVisionUser = isRvUser;
          if (isRvUser === true) {
            $scope.isUserAdmin = userState.isUserAdmin();
            $scope.isPurchaser = userState.isPurchaser();
          }
        });

      $scope.$watch(function () {
          return userState.isRiseAdmin();
        },
        function (isRvAdmin) {
          $scope.isRiseVisionAdmin = isRvAdmin;
        });

      $scope.addSubCompany = function () {
        $modal.open({
          template: $templateCache.get('partials/common-header/subcompany-modal.html'),
          controller: 'SubCompanyModalCtrl',
          size: 'lg',
          resolve: {
            countries: function () {
              return getCoreCountries();
            }
          }
        });
      };

      // Show Company Users Modal
      $scope.companyUsers = function (size) {
        $modal.open({
          template: $templateCache.get('partials/common-header/company-users-modal.html'),
          controller: 'CompanyUsersModalCtrl',
          size: size,
          backdrop: true,
          resolve: {
            company: function () {
              return userState.getCopyOfSelectedCompany();
            }
          }
        });
      };

      $scope.switchCompany = function () {
        var modalInstance = $modal.open({
          template: $templateCache.get('partials/common-header/company-selector-modal.html'),
          controller: 'companySelectorCtr',
          backdrop: true,
          resolve: {
            companyId: function () {
              return userState.getSelectedCompanyId();
            }
          }
        });
        modalInstance.result.then(userState.switchCompany);
      };

      // Show Move Company Modal
      $scope.moveCompany = function (size) {
        // var modalInstance =
        $modal.open({
          template: $templateCache.get('partials/common-header/move-company-modal.html'),
          controller: 'MoveCompanyModalCtrl',
          size: size
        });
      };

      $scope.resetCompany = function () {
        userState.resetCompany();
      };

    }
  ]);
