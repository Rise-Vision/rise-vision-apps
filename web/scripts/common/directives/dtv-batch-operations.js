'use strict';

angular.module('risevision.apps.directives')
  .directive('batchOperations', [
    function () {
      return {
        restrict: 'E',
        scope: {
          listObject: '=',
          listOperations: '=',
        },
        templateUrl: 'partials/common/batch-operations.html',
        link: function () {
        } //link()
      };
    }
  ]);
