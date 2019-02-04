'use strict';

angular.module('risevision.editor.directives')
  .directive('iframeSrc',
    function () {
      return {
        restrict: 'A',
        scope: {
          iframeSrc: '='
        },
        link: function ($scope, element) {
          element.attr('src', $scope.iframeSrc);
        } //link()
      };
    }
  );
