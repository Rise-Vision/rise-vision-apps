'use strict';

angular.module('risevision.common.components.search-filter', [])
  .directive('searchFilter', ['$timeout',
    function ($timeout) {

      return {
        restrict: 'E',
        scope: {
          filterConfig: '=',
          search: '=',
          doSearch: '=',
          iconSet: '@'
        },
        templateUrl: 'partials/components/search-filter/search-filter.html',
        link: function ($scope) {
          $scope.delay = (function () {
            var promise = null;
            return function (callback, ms) {
              $timeout.cancel(promise); //clearTimeout(timer);
              promise = $timeout(callback, ms); //timer = setTimeout(callback, ms);
            };
          })();

          $scope.reset = function () {
            if ($scope.search.query) {
              $scope.search.query = '';
              $scope.doSearch();
            }
          };

        } //link()
      };
    }
  ]);
