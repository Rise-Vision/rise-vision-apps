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
    }
  ]);
