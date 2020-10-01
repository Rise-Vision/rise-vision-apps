'use strict';

angular.module('risevision.displays.controllers')
  .controller('displaysList', ['$scope', '$rootScope', 'userState', 'display',
    'ScrollingListService', '$loading', '$filter', 'displayFactory', 'playerLicenseFactory',
    'displayStatusFactory', '$modal',
    function ($scope, $rootScope, userState, display, ScrollingListService, $loading,
      $filter, displayFactory, playerLicenseFactory, displayStatusFactory, $modal) {
      $scope.search = {
        sortBy: 'name',
        count: $scope.listLimit,
        reverse: false,
        name: 'Displays'
      };

      $scope.displays = new ScrollingListService(display.list, $scope.search);
      $scope.deleteDisplays = function() {
        $modal.open({
          templateUrl: 'partials/displays/bulk-delete-confirmation-modal.html',
          controller: 'BulkDeleteModalCtrl',
          windowClass: 'madero-style centered-modal',
          size: 'sm',
          resolve: {
            selectedItems: $scope.displays.getSelected
          }
        }).result.then($scope.displays.getSelectedAction(displayFactory.deleteDisplayByObject, true));
      };

      $scope.selectedCompayId = userState.getSelectedCompanyId();
      $scope.displayFactory = displayFactory;
      $scope.displayService = display;
      $scope.playerLicenseFactory = playerLicenseFactory;
      $scope.displayStatusFactory = displayStatusFactory;

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'displays-app.list.filter.placeholder')
      };

      $scope.$watch('displays.loadingItems', function (loading) {
        if (loading) {
          $loading.start('displays-list-loader');
        } else {
          $loading.stop('displays-list-loader');
        }
      });

      $scope.$on('displayCreated', function () {
        // use doSearch because it clears the list
        $scope.displays.doSearch();
      });

      $rootScope.$on('risevision.company.planStarted', function () {
        $scope.displays.doSearch();
      });

      $scope.playerNotInstalled = function (display) {
        return $filter('status')(display) === 'notinstalled';
      };

      $scope.playerOnline = function (display) {
        return $filter('status')(display) === 'online';
      };

      $scope.playerOffline = function (display) {
        return $filter('status')(display) === 'offline';
      };

      $scope.getDisplayType = function (display) {
        if (display && display.playerProAuthorized) {
          return 'professional';
        } else {
          return 'standard';
        }
      };
    }
  ]);
