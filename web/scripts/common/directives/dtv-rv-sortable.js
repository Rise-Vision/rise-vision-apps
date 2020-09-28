'use strict';

angular.module('risevision.apps.directives')
  .directive('rvSortable', [function () {
    return {
      restrict: 'AC',
      scope: {
        onSort: '&',
        appendTo: '@',
      },
      link: function ($scope, $element) {
        var sortable;

        var _applySortable = function () {
          sortable = new Draggable.Sortable($element[0], {
            handle: '.rv-sortable-handle',
            draggable: '.rv-sortable-item',
            mirror: {
              appendTo: $scope.appendTo,
              constrainDimensions: true,
              xAxis: false
            }
          });

          sortable.on('sortable:stop', function (evt) {
            if ($scope.onSort) {
              $scope.$evalAsync(function () {
                $scope.onSort({
                  evt: evt
                });
              });
            }
          });

          $scope.$on('$destroy', function () {
            sortable.destroy();
          });
        };

        _applySortable();
      }
    };
  }]);
