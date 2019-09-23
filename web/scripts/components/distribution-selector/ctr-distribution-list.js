"use strict";
angular.module("risevision.common.components.distribution-selector")
  .controller("distributionListController", ["$scope", "$rootScope",
    "displayService", "$loading", "BaseList",
    function ($scope, $rootScope, displayService, $loading, BaseList) {
      var DB_MAX_COUNT = 40; //number of records to load at a time

      $scope.displays = new BaseList(DB_MAX_COUNT);
      $scope.search = {
        sortBy: "name",
        count: DB_MAX_COUNT,
        reverse: false
      };

      $scope.filterConfig = {
        placeholder: "Search Displays",
        id: "displaySearchInput"
      };

      $scope.$on("displayCreated", function () {
        $scope.displays.clear();

        $scope.load();
      });

      $scope.$watch("loadingDisplays", function (loading) {
        if (loading) {
          $loading.start("display-list-loader");
        } else {
          $loading.stop("display-list-loader");
        }
      });

      $scope.load = function () {
        if (!$scope.displays.list.length || !$scope.displays.endOfList &&
          $scope.displays.cursor) {
          $scope.loadingDisplays = true;

          displayService.list($scope.search, $scope.displays.cursor)
            .then(function (result) {
              $scope.displays.add(result.items ? result.items : [],
                result.cursor);
            })
            .then(null, function () {
              $scope.error =
                "Failed to load displays. Please try again later.";
            })
            .finally(function () {
              $scope.loadingDisplays = false;
            });
        }
      };

      $scope.load();

      $scope.sortBy = function (cat) {
        $scope.displays.clear();

        if (cat !== $scope.search.sortBy) {
          $scope.search.sortBy = cat;
        } else {
          $scope.search.reverse = !$scope.search.reverse;
        }

        $scope.load();
      };

      $scope.doSearch = function () {
        $scope.displays.clear();

        $scope.load();
      };

      $scope.toggleDisplay = function (displayId) {
        var index = $scope.parameters.distribution.indexOf(displayId);
        if (index > -1) {
          $scope.parameters.distribution.splice(index, 1);
        } else {
          $scope.parameters.distribution.push(displayId);
        }
      };

      $scope.addDisplay = function () {
        $rootScope.$broadcast("distributionSelector.addDisplay");
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
