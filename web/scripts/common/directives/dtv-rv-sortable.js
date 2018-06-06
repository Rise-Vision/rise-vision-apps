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
          sortable = Sortable.create($element[0], {
            sort: true,
            scroll: false,
            animation: 150,
            handle: '.rv-sortable-handle',
            draggable: '.rv-sortable-item',
            forceFallback: isFirefox(),
            onEnd: function (evt) {
              if ($scope.onSort) {
                $scope.onSort({
                  evt: evt
                });
              }
            }
          });

          $scope.$on('$destroy', function () {
            sortable.destroy();
          });
        }

        function isFirefox() {
          return navigator.userAgent.indexOf('Firefox') >= 0;
        }
      }
    };
  }]);
