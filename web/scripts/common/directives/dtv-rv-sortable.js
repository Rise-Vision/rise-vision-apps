'use strict';

angular.module('risevision.apps.directives')
  .directive('rvSortable', [function () {
    return {
      restrict: 'AC',
      scope: {
        onSort: '&'
      },
      link: function ($scope, $element) {
        var sortable;

        applySortable();

        function applySortable() {
          sortable = new Draggable.Sortable($element[0], {
            handle: '.rv-sortable-handle',
            draggable: '.rv-sortable-item',
            mirror: {
              constrainDimensions: true,
              cursorOffsetX: 10,
              cursorOffsetY: screen.width > 600 ? 200 : 150,
              xAxis: false
            }
          });

          sortable.on('sortable:stop', function (evt) {
              if ($scope.onSort) {
                $scope.onSort({
                  evt: evt
                });
              }
          });

          $scope.$on('$destroy', function () {
            sortable.destroy();
          });
        }
      }
    };
  }]);
