'use strict';

angular.module('risevision.displays.controllers')
  .controller('displaysList', ['$scope', '$rootScope', '$q', 'userState', 'display',
    'ScrollingListService', '$filter', 'displayFactory', 'playerLicenseFactory',
    '$modal', 'displaySummaryFactory', 'DisplayListOperations',
    function ($scope, $rootScope, $q, userState, display, ScrollingListService,
      $filter, displayFactory, playerLicenseFactory, $modal, displaySummaryFactory,
      DisplayListOperations) {
      $scope.search = {
        sortBy: 'name',
        count: $scope.listLimit,
        reverse: false,
        name: 'Displays'
      };

      $scope.listOperations = new DisplayListOperations();
      $scope.displays = new ScrollingListService(display.list, $scope.search, $scope.listOperations);

      $scope.selectedCompayId = userState.getSelectedCompanyId();
      $scope.displayFactory = displayFactory;
      $scope.playerLicenseFactory = playerLicenseFactory;
      $scope.displaySummaryFactory = displaySummaryFactory;

      displaySummaryFactory.loadSummary();

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'displays-app.list.filter.placeholder')
      };

      $scope.$on('displayCreated', function () {
        // use doSearch because it clears the list
        $scope.displays.doSearch();
      });

      $rootScope.$on('risevision.company.planStarted', function () {
        $scope.displays.doSearch();
      });

      $scope.getDisplayType = function (display) {
        if (display && display.playerProAuthorized) {
          return 'professional';
        } else {
          return 'standard';
        }
      };
    }
  ]);
