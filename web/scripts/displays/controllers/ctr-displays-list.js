'use strict';

angular.module('risevision.displays.controllers')
  .controller('displaysList', ['$scope', '$window', 'userState', 'display',
    'ScrollingListService', '$loading', '$filter', 'displayFactory',
    'displayTracker', 'STORE_URL', 'PLAYER_PRO_PRODUCT_ID',
    function ($scope, $window, userState, display, ScrollingListService, $loading,
      $filter, displayFactory, displayTracker, STORE_URL, PLAYER_PRO_PRODUCT_ID) {
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

      $scope.openRiseProStoreLink = function() {
        $window.open(STORE_URL + '/product/' + PLAYER_PRO_PRODUCT_ID, '_blank');
      };

      $scope.openUnsupportedHelpLink = function() {
        $window.open('https://risevision.zendesk.com/hc/en-us/articles/115003786306', '_blank');
      };

      $scope.showStartTrial = function() {
        var modalInstance = displayFactory.startPlayerProTrialModal();

        modalInstance.result
        .then(function() {
          console.log("Refresh search list");
          $scope.displays.doSearch();
        }, function() {
          console.log("Start Trial modal closed");
        });
      };

      $scope.getDisplayType = function(display) {
        var status = display.proSubscription && display.proSubscription.status;

        //return "unsupported";

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
