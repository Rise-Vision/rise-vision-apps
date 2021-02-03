'use strict';

angular.module('risevision.common.header.directives')
  .directive('emptySelectParser', [

    function () {
      return {
        require: 'ngModel',
        link: function (scope, ele, attr, ctrl) {
          ctrl.$parsers.unshift(function (value) {
            return value === null ? '' : value;
          });
        }
      };
    }
  ]);
