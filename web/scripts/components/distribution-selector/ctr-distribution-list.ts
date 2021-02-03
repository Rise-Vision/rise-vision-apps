'use strict';
angular.module('risevision.common.components.distribution-selector')
  .controller('distributionListController', ['$scope',
    'displayService', '$loading', 'ScrollingListService',
    function ($scope, displayService, $loading, ScrollingListService) {
      var DB_MAX_COUNT = 40; //number of records to load at a time

      $scope.search = {
        sortBy: 'name',
        count: DB_MAX_COUNT,
        reverse: false
      };
      $scope.displays = new ScrollingListService(displayService.list, $scope.search);

      $scope.filterConfig = {
        placeholder: 'Search Displays',
        id: 'displaySearchInput'
      };

      $scope.$on('displayCreated', function (event, display) {
        $scope.toggleDisplay(display.id);

        $scope.displays.doSearch();
      });

      $scope.$watch('displays.loadingItems', function (loading) {
        if (loading) {
          $loading.start('display-list-loader');
        } else {
          $loading.stop('display-list-loader');
        }
      });

      $scope.toggleDisplay = function (displayId) {
        var index = $scope.parameters.distribution.indexOf(displayId);
        if (index > -1) {
          $scope.parameters.distribution.splice(index, 1);
        } else {
          $scope.parameters.distribution.push(displayId);
        }
      };

      $scope.isSelected = function (displayId) {
        var index = $scope.parameters.distribution.indexOf(displayId);
        if (index > -1) {
          return true;
        }

        return false;
      };

    }
  ]);
