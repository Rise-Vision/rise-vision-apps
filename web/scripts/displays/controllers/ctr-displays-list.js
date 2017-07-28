'use strict';

angular.module('risevision.displays.controllers')
  .controller('displaysList', ['$scope', 'userState', 'display',
    'ScrollingListService', '$loading', '$filter', 'displayFactory',
    'displayTracker',
    function ($scope, userState, display, ScrollingListService, $loading,
      $filter, displayFactory, displayTracker) {
      $scope.search = {
        sortBy: 'name',
        count: $scope.listLimit,
        reverse: false,
      };

      $scope.displays = new ScrollingListService(display.list,
        $scope.search);
      $scope.selectedCompayId = userState.getSelectedCompanyId();
      $scope.displayTracker = displayTracker;
      $scope.displayFactory = displayFactory;
      $scope.displayService = display;

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

      $scope.getDisplayType = function(display) {
        var status = display.proSubscription && display.proSubscription.status;
        //status = "3rdParty";

        if (!status) {
          // Status not loaded yet
        }
        else if(!$filter('status')(display) === 'notinstalled') {
          // Player has not been installed yet
        }
        else if(!$scope.displayService.hasSchedule(display)) {
          // No schedule defined
        }
        else if (displayFactory.isOutdatedPlayer(display)) {
          return 'unsupported';
        }
        else if (displayFactory.is3rdPartyPlayer(display)) {
          return '3rd-party';
        }
        else if (status === 'Subscribed') {
          return 'subscribed';
        }
        else if (status === 'Not Subscribed') {
          return 'not-subscribed';
        }
        else if (status === 'On Trial') {
          return 'on-trial';
        }
        else if (status === 'Trial Expired') {
          return 'trial-expired';
        }
        else if (status === 'Suspended') {
          return 'suspended';
        }
        else if (status === 'Cancelled') {
          return 'cancelled';
        }
        else {
          console.log("Unexpected status for display: ", display.id, status);
        }
      };
    }
  ]);
