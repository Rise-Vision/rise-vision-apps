'use strict';

angular.module('risevision.template-editor.directives')
  .directive('componentIcon', [
    function () {
      return {
        restrict: 'E',
        scope: {
          icon: '@',
          type: '@'
        },
        link: function ($scope, element) {
          var _html = function () {
            if ($scope.type === 'svg') {
              return '<svg class="mr-2 fa fa-lg" width="24px" height="18px" viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg">' +
                $scope.icon + '</svg>';
            } else {
              return '<i class="mr-2 fa fa-lg ' + $scope.icon + '"></i>';
            }
          };

          $scope.$watch('icon', function (icon) {
            if (icon) {
              element.replaceWith(_html());
            }
          });
        }
      };
    }
  ]);
