'use strict';

angular.module('risevision.template-editor.directives')
  .directive('componentIcon', ['$compile', 'iconsList',
    function ($compile, iconsList) {
      return {
        restrict: 'E',
        scope: {
          icon: '@',
          type: '@'
        },
        link: function ($scope, element) {
          var _html = function () {
            if ($scope.type === 'streamline') {
              // eventually all icons should fall into this
              var fragment = '<streamline-icon name="' + $scope.icon + '"' +
                ' width="61" height="60"></streamline-icon>';

              return $compile(fragment)($scope);
            } else if ($scope.type === 'svg') {
              return '<svg class="mr-2 fa fa-lg" width="24px" height="18px" viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg">' +
                $scope.icon + '</svg>';
            } else if ($scope.type === 'riseSvg') {
              return '<svg class="mr-2" viewBox="0 0 32 32" width="24" height="18" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="' + iconsList.icons1[$scope.icon] + '"></path>' +
                '<path d="' + iconsList.icons2[$scope.icon] + '"></path>' +
                '</svg>';
            } else {
              return '<i class="mr-2 fa fa-lg ' + $scope.icon + '"></i>';
            }
          };

          $scope.$watch('icon', function (icon) {
            if (icon) {
              element.html(_html());
            }
          });
        }
      };
    }
  ]);
