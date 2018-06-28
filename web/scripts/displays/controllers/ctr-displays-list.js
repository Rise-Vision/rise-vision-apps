'use strict';

angular.module('risevision.displays.controllers')
  .controller('displaysList', ['$scope', '$rootScope', '$window', 'userState', 'display',
    'ScrollingListService', '$loading', '$filter', 'displayFactory',
    'displayTracker', 'playerProFactory', 'displayStatusFactory',
    function ($scope, $rootScope, $window, userState, display, ScrollingListService, $loading,
      $filter, displayFactory, displayTracker, playerProFactory, displayStatusFactory) {
      $scope.search = {
        sortBy: 'name',
        count: $scope.listLimit,
        reverse: false,
        name: 'Displays'
      };

      $scope.displays = new ScrollingListService(display.list, $scope.search);
      $scope.selectedCompayId = userState.getSelectedCompanyId();
      $scope.displayTracker = displayTracker;
      $scope.displayFactory = displayFactory;
      $scope.displayService = display;
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

      $rootScope.$on('risevision.company.trial.started', function () {
        $scope.displays.doSearch();
      });

      $scope.openUnsupportedHelpLink = function () {
        $window.open('https://risevision.zendesk.com/hc/en-us/articles/115003786306', '_blank');
      };

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
        if (playerProFactory.is3rdPartyPlayer(display)) {
          return '3rd-party';
        } else if (playerProFactory.isUnsupportedPlayer(display)) {
          return 'unsupported';
        } else if (display.playerProAuthorized) {
          return 'professional';
        } else {
          return 'standard';
        }
      };
    }
  ]);
