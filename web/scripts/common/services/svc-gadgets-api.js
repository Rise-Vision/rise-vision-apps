'use strict';

angular.module('risevision.apps.services')
  .factory('gadgetsApi', ['$window', function ($window) {
    return $window.gadgets;
  }]);
