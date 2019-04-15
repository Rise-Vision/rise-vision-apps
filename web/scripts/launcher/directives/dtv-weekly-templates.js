'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('weeklyTemplates', ['$loading',
    function ($loading) {
      return {
        restrict: 'E',
        templateUrl: 'partials/launcher/weekly-templates.html',
        link: function ($scope) {} //link()
      };
    }
  ]);
